import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const otpStore = new Map<string, string>();

export class AuthService {
  async register(data: any) {
    const { email, username, password } = data;
    const existingUser = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existingUser) throw new Error('Email or username already exists');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword, displayName: username }
    });
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user: { id: user.id, email: user.email, username: user.username, displayName: user.displayName } };
  }

  async login(data: any) {
    const { email, password } = data;
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: email }
        ]
      }
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Email, tên đăng nhập hoặc mật khẩu không chính xác');
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user: { id: user.id, email: user.email, username: user.username, displayName: user.displayName } };
  }

  async forgotPassword(data: any) {
    const { email } = data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Email không tồn tại trong hệ thống');
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);
    
    console.log(`[SMTP SIMULATOR] Gửi email đặt lại mật khẩu đến: ${email} | Mã OTP: ${otp}`);
    return { message: 'Mã xác thực đã được gửi thành công!', otp };
  }

  async resetPassword(data: any) {
    const { email, otp, newPassword } = data;
    const savedOtp = otpStore.get(email);
    if (!savedOtp || savedOtp !== otp) {
      throw new Error('Mã OTP không chính xác hoặc đã hết hạn');
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { email }, data: { password: hashedPassword } });
    otpStore.delete(email);
    return { message: 'Đặt lại mật khẩu thành công!' };
  }

  async changePassword(userId: number, data: any) {
    const { currentPassword, newPassword } = data;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Không tìm thấy người dùng');
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error('Mật khẩu hiện tại không chính xác');
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    return { message: 'Đổi mật khẩu thành công!' };
  }
}
export const authService = new AuthService();
