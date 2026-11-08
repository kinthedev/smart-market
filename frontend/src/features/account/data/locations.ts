export interface Province {
  id: string
  name: string
  districts: District[]
}

export interface District {
  id: string
  name: string
  wards: string[]
}

export const vietnamLocations: Province[] = [
  {
    id: "hanoi",
    name: "Hà Nội",
    districts: [
      {
        id: "ba-dinh",
        name: "Quận Ba Đình",
        wards: ["Phường Cống Vị", "Phường Điện Biên", "Phường Đội Cấn", "Phường Giảng Võ", "Phường Kim Mã", "Phường Liễu Giai", "Phường Ngọc Hà", "Phường Quán Thánh", "Phường Thành Công"]
      },
      {
        id: "hoan-kiem",
        name: "Quận Hoàn Kiếm",
        wards: ["Phường Cửa Đông", "Phường Cửa Nam", "Phường Đồng Xuân", "Phường Hàng Bạc", "Phường Hàng Bài", "Phường Hàng Bồ", "Phường Hàng Bông", "Phường Tràng Tiền"]
      },
      {
        id: "cau-giay",
        name: "Quận Cầu Giấy",
        wards: ["Phường Dịch Vọng", "Phường Dịch Vọng Hậu", "Phường Mai Dịch", "Phường Nghĩa Đô", "Phường Nghĩa Tân", "Phường Quan Hoa", "Phường Trung Hòa", "Phường Yên Hòa"]
      },
      {
        id: "dong-da",
        name: "Quận Đống Đa",
        wards: ["Phường Cát Linh", "Phường Hàng Bột", "Phường Khâm Thiên", "Phường Láng Hạ", "Phường Láng Thượng", "Phường Ô Chợ Dừa", "Phường Quang Trung"]
      },
      {
        id: "nam-tu-liem",
        name: "Quận Nam Từ Liêm",
        wards: ["Phường Cầu Diễn", "Phường Đại Mỗ", "Phường Mễ Trì", "Phường Mỹ Đình 1", "Phường Mỹ Đình 2", "Phường Tây Mỗ", "Phường Trung Văn"]
      }
    ]
  },
  {
    id: "hcm",
    name: "TP. Hồ Chí Minh",
    districts: [
      {
        id: "quan-1",
        name: "Quận 1",
        wards: ["Phường Bến Nghé", "Phường Bến Thành", "Phường Cầu Kho", "Phường Cầu Ông Lãnh", "Phường Cô Giang", "Phường Đa Kao", "Phường Tân Định"]
      },
      {
        id: "quan-3",
        name: "Quận 3",
        wards: ["Phường Võ Thị Sáu", "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 9", "Phường 11", "Phường 14"]
      },
      {
        id: "quan-7",
        name: "Quận 7",
        wards: ["Phường Tân Thuận Đông", "Phường Tân Thuận Tây", "Phường Tân Kiểng", "Phường Tân Hưng", "Phường Bình Thuận", "Phường Tân Quy", "Phường Tân Phú", "Phường Tân Phong"]
      },
      {
        id: "binh-thanh",
        name: "Quận Bình Thạnh",
        wards: ["Phường 1", "Phường 2", "Phường 3", "Phường 11", "Phường 15", "Phường 17", "Phường 19", "Phường 21", "Phường 25"]
      },
      {
        id: "tp-thu-duc",
        name: "TP. Thủ Đức",
        wards: ["Phường Thảo Điền", "Phường An Phú", "Phường Hiệp Phú", "Phường Linh Trung", "Phường Linh Chiểu", "Phường Tăng Nhơn Phú A", "Phường Trường Thọ"]
      }
    ]
  },
  {
    id: "danang",
    name: "Đà Nẵng",
    districts: [
      {
        id: "hai-chau",
        name: "Quận Hải Châu",
        wards: ["Phường Hải Châu 1", "Phường Hải Châu 2", "Phường Thạch Thang", "Phường Thanh Bình", "Phường Thuận Phước", "Phường Hòa Cường Bắc", "Phường Hòa Cường Nam"]
      },
      {
        id: "son-tra",
        name: "Quận Sơn Trà",
        wards: ["Phường An Hải Bắc", "Phường An Hải Đông", "Phường An Hải Tây", "Phường Mân Thái", "Phường Phước Mỹ", "Phường Thọ Quang"]
      },
      {
        id: "thanh-khe",
        name: "Quận Thanh Khê",
        wards: ["Phường Tam Thuận", "Phường Thanh Khê Đông", "Phường Thanh Khê Tây", "Phường Xuân Hà", "Phường Tân Chính", "Phường Chính Gián"]
      }
    ]
  },
  {
    id: "cantho",
    name: "Cần Thơ",
    districts: [
      {
        id: "ninh-kieu",
        name: "Quận Ninh Kiều",
        wards: ["Phường Cái Khế", "Phường An Hòa", "Phường Thới Bình", "Phường An Nghiệp", "Phường An Cư", "Phường Tân An", "Phường Xuân Khánh"]
      },
      {
        id: "cai-rang",
        name: "Quận Cái Răng",
        wards: ["Phường Lê Bình", "Phường Hưng Phú", "Phường Hưng Thạnh", "Phường Ba Láng", "Phường Thường Thạnh"]
      }
    ]
  },
  {
    id: "haiphong",
    name: "Hải Phòng",
    districts: [
      {
        id: "hong-bang",
        name: "Quận Hồng Bàng",
        wards: ["Phường Hoàng Văn Thụ", "Phường Minh Khai", "Phường Phan Bội Châu", "Phường Quán Toan", "Phường Sở Dầu"]
      },
      {
        id: "ngo-quyen",
        name: "Quận Ngô Quyền",
        wards: ["Phường Cầu Đất", "Phường Cầu Tre", "Phường Đằng Giang", "Phường Đông Khê", "Phường Lạc Viên", "Phường Máy Chai"]
      }
    ]
  }
]
