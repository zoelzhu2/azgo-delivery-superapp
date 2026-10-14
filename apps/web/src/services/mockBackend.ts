import { User } from '@delivery/shared';

// 1. Akun Pengguna Mock
export const MOCK_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@azgo.com',
    phone: '081111111111',
    fullName: 'Super Administrator AZ GO',
    role: 'ADMIN',
    isActive: true,
    passwordHash: 'admin123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'usr-drv-1',
    email: 'driver@azgo.com',
    phone: '081233445566',
    fullName: 'Rudi Hartono (Driver)',
    role: 'DRIVER',
    isActive: true,
    bankName: 'BCA (Bank Central Asia)',
    accountNumber: '8820192819',
    accountHolder: 'Rudi Hartono',
    passwordHash: 'driver123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'usr-mch-1',
    email: 'resto@azgo.com',
    phone: '081299881122',
    fullName: 'Pemilik Ayam Geprek Sambal Bawang',
    role: 'MERCHANT',
    storeType: 'FOOD',
    isActive: true,
    hasSelfCourier: true,
    selfCouriers: [
      {
        id: 'sc-1',
        name: 'Agus Kurir Resto',
        phone: '081299887711',
        vehicleModel: 'Honda Vario 160',
        vehiclePlate: 'L 3892 AZG'
      }
    ],
    bankName: 'Mandiri',
    accountNumber: '1310098765432',
    accountHolder: 'Bambang Pamungkas',
    passwordHash: 'resto123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'usr-mch-2',
    email: 'mart@azgo.com',
    phone: '081377889900',
    fullName: 'Pengelola Az Mart Express',
    role: 'MERCHANT',
    storeType: 'MART',
    isActive: true,
    hasSelfCourier: true,
    selfCouriers: [
      {
        id: 'sc-2',
        name: 'Dedi Kurir Mart',
        phone: '081366554433',
        vehicleModel: 'Yamaha NMAX',
        vehiclePlate: 'L 5567 AZM'
      }
    ],
    bankName: 'BCA',
    accountNumber: '8820199999',
    accountHolder: 'Az Mart Express',
    passwordHash: 'mart123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'usr-hub-1',
    email: 'hub@azgo.com',
    phone: '081900112233',
    fullName: 'Staff Operator Gudang Gateway JKT',
    role: 'HUB_STAFF',
    isActive: true,
    passwordHash: 'hub123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'usr-cust-1',
    email: 'pelanggan@azgo.com',
    phone: '081299887766',
    fullName: 'Siti Rahma',
    role: 'CUSTOMER',
    isActive: true,
    passwordHash: 'user123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// 2. Mock Toko Resto & Mart
export const MOCK_RESTAURANTS: any[] = [
  {
    id: 'resto-1',
    name: 'Ayam Geprek Sambal Bawang Juara',
    category: 'Kuliner Lokal, Pedas, Ayam',
    type: 'FOOD',
    rating: 4.8,
    bannerUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500',
    address: 'Jl. Merdeka Barat No. 12',
    isOpen: true,
    isActive: true,
    items: [
      { id: 'm-1', name: 'Paket Ayam Geprek Level 3 + Nasi', price: 25000, description: 'Ayam krispi gurih dengan sambal bawang pedas nampol', imageUrl: '', isAvailable: true },
      { id: 'm-2', name: 'Paket Ayam Geprek Keju Mozzarella', price: 32000, description: 'Ayam geprek berbalut keju lumer melimpah', imageUrl: '', isAvailable: true },
      { id: 'm-3', name: 'Es Teh Manis Jumbo Segar', price: 6000, description: 'Es teh segar manis pelepas dahaga', imageUrl: '', isAvailable: true }
    ]
  },
  {
    id: 'resto-2',
    name: 'Kopi Kenangan Senja & Bakery',
    category: 'Cafe, Kopi, Roti & Pastry',
    type: 'FOOD',
    rating: 4.9,
    bannerUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500',
    address: 'Jl. Pemuda No. 44',
    isOpen: true,
    isActive: true,
    items: [
      { id: 'm-4', name: 'Es Kopi Susu Gula Aren Spesial', price: 18000, description: 'Espresso murni dengan susu segar dan aren alami', imageUrl: '', isAvailable: true },
      { id: 'm-5', name: 'Croissant Cokelat Mentega', price: 22000, description: 'Pastry renyah Prancis dengan lelehan cokelat', imageUrl: '', isAvailable: true }
    ]
  }
];

export const MOCK_MARTS: any[] = [
  {
    id: 'mart-1',
    name: 'Az Mart Express - Pusat',
    category: 'Minimarket, Sembako & Minuman',
    type: 'MART',
    rating: 4.9,
    bannerUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500',
    address: 'Jl. Sudirman No. 88',
    isOpen: true,
    isActive: true,
    items: [
      { id: 'prod-1', name: 'Minyak Goreng Sania Pouch 2L', price: 36000, description: 'Minyak goreng kelapa sawit higienis', imageUrl: '', isAvailable: true },
      { id: 'prod-2', name: 'Beras Premium Ramos Wangi 5kg', price: 74000, description: 'Beras pulen bersih kualitas utama', imageUrl: '', isAvailable: true },
      { id: 'prod-3', name: 'Gula Pasir Gulaku Tebu 1kg', price: 17500, description: 'Gula pasir murni kristal putih', imageUrl: '', isAvailable: true },
      { id: 'prod-4', name: 'Telur Ayam Negeri Fresh (10 butir)', price: 28000, description: 'Telur ayam segar pilihan bernutrisi', imageUrl: '', isAvailable: true }
    ]
  }
];

// 3. Mock Hub Drop Point
export const MOCK_HUBS: any[] = [
  {
    id: 'hub-1',
    hubCode: 'HUB-JKT-01',
    name: 'Jakarta Sorting Center & Hub',
    hubType: 'SORTING_CENTER',
    city: 'Jakarta',
    address: 'Kawasan Industri Pulogadung Blok C3, Jakarta Timur',
    isActive: true,
    totalIncomingParcels: 342,
    totalDispatchedParcels: 289
  },
  {
    id: 'hub-2',
    hubCode: 'DP-TBT-01',
    name: 'Drop Point Tebet Raya',
    hubType: 'DROP_POINT',
    city: 'Jakarta',
    address: 'Jl. Tebet Barat Dalam Raya No. 45, Jakarta Selatan',
    isActive: true,
    totalIncomingParcels: 85,
    totalDispatchedParcels: 82
  },
  {
    id: 'hub-3',
    hubCode: 'HUB-BDG-01',
    name: 'Bandung Hub Gateway',
    hubType: 'SORTING_CENTER',
    city: 'Bandung',
    address: 'Jl. Soekarno Hatta No. 512, Bandung',
    isActive: true,
    totalIncomingParcels: 198,
    totalDispatchedParcels: 176
  }
];

// 4. Mock Admin Orders
export const MOCK_ADMIN_ORDERS: any[] = [
  {
    id: 'ord-101',
    orderNumber: 'AZD-882910',
    serviceType: 'AZ_DELIVERY',
    customerName: 'Siti Rahma',
    driverName: 'Rudi Hartono (Motor)',
    pickup: 'Ayam Geprek Sambal Bawang Juara',
    dropoff: 'Jl. Melati No. 14, Jaksel',
    status: 'IN_TRANSIT',
    totalAmount: 38000,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 'ord-102',
    orderNumber: 'AZC-20260927-9102',
    serviceType: 'AZ_COURIER',
    customerName: 'Budi Santoso',
    driverName: 'Kurir First-Mile (Andi)',
    pickup: 'Jakarta Drop Point Tebet',
    dropoff: 'Bandung Central Drop Point',
    status: 'SORTED_AT_HUB',
    totalAmount: 24000,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString()
  },
  {
    id: 'ord-103',
    orderNumber: 'AZK-441092',
    serviceType: 'AZ_CARGO',
    customerName: 'PT Maju Logistik',
    driverName: 'Agus Subekti (Pickup Bak)',
    pickup: 'Gudang Marunda',
    dropoff: 'Kawasan Industri Cikarang',
    status: 'ACCEPTED',
    totalAmount: 185000,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: 'ord-104',
    orderNumber: 'AZM-198273',
    serviceType: 'AZ_MART',
    customerName: 'Dewi Lestari',
    driverName: 'Hendra (Personal Shopper)',
    pickup: 'Az Mart Express - Pusat',
    dropoff: 'Apartemen Rasuna Said Tower B',
    status: 'SHOPPING',
    totalAmount: 125000,
    createdAt: new Date(Date.now() - 10 * 60000).toISOString()
  }
];

// 5. Mock Pricing Config
export const MOCK_PRICING: any = {
  deliveryBaseFare: 10000,
  deliveryPerKm: 2500,
  courierRatePerKg: 11000,
  expressRateMultiplier: 1.5,
  cargoPickupBakBase: 85000,
  cargoTruckEngkelBase: 250000,
  cargoHelperFee: 50000,
  platformFee: 2000
};

// 6. Mock Drivers
export const MOCK_DRIVERS: any[] = [
  {
    id: 'drv-1',
    name: 'Rudi Hartono',
    phone: '081233445566',
    vehiclePlate: 'L 4921 AZG (Honda Vario 160)',
    role: 'MOTORBIKE',
    rating: 4.9,
    completedTrips: 184,
    status: 'ONLINE',
    isVerified: true
  },
  {
    id: 'drv-2',
    name: 'Agus Subekti',
    phone: '081277889911',
    vehiclePlate: 'B 9201 TAA (Daihatsu GranMax Pickup)',
    role: 'CARGO_PICKUP',
    rating: 4.8,
    completedTrips: 92,
    status: 'ONLINE',
    isVerified: true
  },
  {
    id: 'drv-3',
    name: 'Joko Susilo',
    phone: '081388776655',
    vehiclePlate: 'B 8832 UXZ (Truk Engkel 4 Roda)',
    role: 'CARGO_TRUCK',
    rating: 5.0,
    completedTrips: 64,
    status: 'OFFLINE',
    isVerified: true
  }
];

// 7. Mock Services
export const MOCK_SERVICES: any[] = [
  { id: 'AZ_DELIVERY', name: 'Az Delivery', description: 'Antar Kilat Makanan Resto & Barang Instan Motor', icon: 'Bike', isActive: true },
  { id: 'AZ_COURIER', name: 'Az Courier', description: 'Ekspedisi Pengiriman Reguler Antar Kota / Kecamatan dengan Resi AWB', icon: 'Package', isActive: true },
  { id: 'AZ_EXPRESS', name: 'Az Express', description: 'Layanan Kilat Prioritas Garansi Sampai Hari yang Sama (Sameday)', icon: 'Zap', isActive: true },
  { id: 'AZ_CARGO', name: 'Az Cargo', description: 'Muatan Berat & Pindahan Rumah (Pickup Bak, Box, & Truk Engkel)', icon: 'Truck', isActive: true },
  { id: 'AZ_MART', name: 'Az Mart', description: 'Belanja Sembako, Sayur Segar, dan Kebutuhan Harian di Minimarket Mitra', icon: 'ShoppingCart', isActive: true },
  { id: 'AZ_PICKUP', name: 'Az Pickup', description: 'Layanan Gratis Jemput Paket ke Alamat Rumah untuk Agen & Penjual Online', icon: 'MapPin', isActive: true }
];

// 8. Mock Finance & Wallets
export const MOCK_FINANCE_SUMMARY: any = {
  totalGrossRevenue: 18450000,
  platformCommissionEarned: 2767500,
  merchantPayableBalance: 8320000,
  driverPayableBalance: 7362500,
  pendingWithdrawalAmount: 350000
};

export const MOCK_COMMISSION_CONFIG: any = {
  foodCommissionPercent: 15,
  martCommissionPercent: 10,
  driverCommissionPercent: 15,
  deliveryDriverSharePercent: 85,
  cargoDriverSharePercent: 88,
  cargoCommissionPercent: 12,
  hubHandlingFeePerParcel: 1500
};

export const MOCK_WITHDRAWALS: any[] = [
  {
    id: 'wdr-1',
    partnerId: 'usr-drv-1',
    partnerName: 'Rudi Hartono (Driver)',
    partnerType: 'DRIVER',
    amount: 350000,
    bankName: 'BCA (Bank Central Asia)',
    accountNumber: '8820192819',
    accountHolder: 'Rudi Hartono',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString()
  }
];

export const MOCK_PARTNER_APPLICATIONS: any[] = [
  {
    id: 'pa-1',
    fullName: 'Fajar Nugroho',
    phone: '081234567899',
    email: 'fajar@gmail.com',
    type: 'DRIVER',
    vehicleType: 'MOTOR',
    vehiclePlate: 'B 3829 AZG',
    city: 'Jakarta',
    status: 'PENDING_REVIEW',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString()
  },
  {
    id: 'pa-2',
    fullName: 'Warung Bakso Pak Kumis',
    phone: '081398765432',
    email: 'baksokumis@gmail.com',
    type: 'MERCHANT',
    storeType: 'FOOD',
    storeName: 'Bakso Sapi Urat Pak Kumis',
    storeCategory: 'Kuliner Bakso & Mie Ayam',
    city: 'Surabaya',
    status: 'PENDING_REVIEW',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString()
  }
];
