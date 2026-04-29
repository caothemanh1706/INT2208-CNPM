import { Card } from '../ui/Card';

export function TotalBalance({ balance }: { balance?: number }) {
  return (
    <Card className="bg-[#81abc9] text-white p-6 md:p-8 rounded-[20px] shadow-sm border-none mb-6 min-h-[160px] flex flex-col justify-center">
      <h2 className="text-[32px] font-bold mb-2 tracking-wide">Tổng số dư</h2>
      <p className="text-2xl font-semibold opacity-90">{balance?.toLocaleString('en-US')} đ</p>
    </Card>
  );
}
