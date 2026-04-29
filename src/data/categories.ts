export const expenseCategories = [
  {
    group: 'Ăn uống',
    items: ['Ăn sáng', 'Ăn tiệm', 'Ăn tối', 'Ăn trưa', 'Cafe', 'Đi chợ/siêu thị']
  },
  {
    group: 'Con cái',
    items: ['Đồ chơi', 'Học phí', 'Sách vở', 'Sữa', 'Tiền tiêu vặt']
  },
  {
    group: 'Đi lại',
    items: ['Bảo hiểm xe', 'Gửi xe', 'Rửa xe', 'Sửa chữa, bảo dưỡng xe', 'Taxi/thuê xe', 'Xăng xe']
  },
  {
    group: 'Dịch vụ sinh hoạt',
    items: ['Điện', 'Điện thoại cố định', 'Điện thoại di động', 'Gas', 'Internet', 'Nước', 'Thuê người giúp việc', 'Truyền hình']
  },
  {
    group: 'Hiếu hỉ',
    items: ['Biếu tặng', 'Cưới xin', 'Ma chay', 'Thăm hỏi']
  },
  {
    group: 'Hưởng thụ',
    items: ['Du lịch', 'Làm đẹp', 'Mỹ phẩm', 'Phim ảnh ca nhạc', 'Vui chơi giải trí']
  },
  {
    group: 'Ngân hàng',
    items: ['Phí chuyển khoản']
  },
  {
    group: 'Nhà cửa',
    items: ['Mua sắm đồ đạc', 'Sửa chữa nhà cửa', 'Thuê nhà']
  },
  {
    group: 'Phát triển bản thân',
    items: ['Giao lưu, quan hệ', 'Học hành']
  },
  {
    group: 'Sức khỏe',
    items: ['Khám chữa bệnh', 'Thể thao', 'Thuốc men']
  },
  {
    group: 'Tiền ra',
    items: [] // No sub-items in image
  },
  {
    group: 'Trang phục',
    items: ['Giày dép', 'Phụ kiện khác', 'Quần áo']
  }
];

export const incomeCategories = [
  {
    group: 'Thu nhập',
    items: ['Được cho/tặng', 'khác', 'Lãi tiết kiệm', 'lương', 'Thưởng']
  }
];

// For adjust balance, we can combine them or use a specific set.
export const adjustCategories = [
  {
    group: 'Điều chỉnh',
    items: ['Điều chỉnh tăng', 'Điều chỉnh giảm', 'Khác']
  },
  ...expenseCategories,
  ...incomeCategories
];
