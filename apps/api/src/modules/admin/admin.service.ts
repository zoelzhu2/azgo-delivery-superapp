import { expeditionRepository } from '../expedition/expedition.repository';
import { foodAndMartService, MerchantStore } from '../food/food.service';
import { Hub } from '@delivery/shared';

export class AdminService {
  private orders: any[] = [
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
      pickup: 'Jakarta Drop Point',
      dropoff: 'Bandung Central Drop Point',
      status: 'SORTED_AT_HUB',
      totalAmount: 24000,
      createdAt: new Date(Date.now() - 45 * 60000).toISOString()
    },
    {
      id: 'ord-103',
      orderNumber: 'AZK-441092',
      serviceType: 'AZ_CARGO',
      customerName: 'PT Maju Bersama',
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
      pickup: 'Az Mart Express - Sudirman',
      dropoff: 'Apartemen Rasuna Said Tower B',
      status: 'SHOPPING',
      totalAmount: 125000,
      createdAt: new Date(Date.now() - 10 * 60000).toISOString()
    },
    {
      id: 'ord-105',
      orderNumber: 'AZP-581559',
      serviceType: 'AZ_PICKUP',
      customerName: 'Rina Butik',
      driverName: 'Kurir Jemput (Bambang)',
      pickup: 'Jl. Mangga No. 5',
      dropoff: 'Agen Drop Point Tebet',
      status: 'DRIVER_ASSIGNED',
      totalAmount: 0,
      createdAt: new Date(Date.now() - 2 * 60000).toISOString()
    }
  ];

  private pricingConfigs = {
    deliveryBaseFare: 10000,
    deliveryPerKm: 2500,
    courierRatePerKg: 11000,
    expressRateMultiplier: 1.5,
    cargoPickupBakBase: 85000,
    cargoTruckEngkelBase: 250000,
    cargoHelperFee: 50000,
    platformFee: 2000
  };

  private drivers = [
    { id: 'drv-1', name: 'Rudi Hartono', phone: '081233445566', vehicle: 'Honda Vario (B 1234 XYZ)', role: 'MOTORBIKE', isOnline: true, status: 'VERIFIED', rating: 4.9, isActive: true },
    { id: 'drv-2', name: 'Agus Subekti', phone: '081399887766', vehicle: 'Daihatsu Gran Max Pickup (B 5678 CAR)', role: 'CARGO_PICKUP', isOnline: true, status: 'VERIFIED', rating: 4.8, isActive: true },
    { id: 'drv-3', name: 'Fajar Nugraha', phone: '085711223344', vehicle: 'Isuzu Elf Engkel (B 9012 TRK)', role: 'CARGO_TRUCK', isOnline: false, status: 'VERIFIED', rating: 5.0, isActive: true },
    { id: 'drv-4', name: 'Bambang Irawan', phone: '081822334455', vehicle: 'Yamaha NMAX (B 3456 PQR)', role: 'COURIER_PICKUP', isOnline: true, status: 'PENDING_APPROVAL', rating: 0.0, isActive: true }
  ];

  private servicesConfig = [
    { id: 'AZ_DELIVERY', name: 'Az Delivery', description: 'Makanan, minuman, barang lokal', isEnabled: true, isActive: true, icon: '🛵' },
    { id: 'AZ_COURIER', name: 'Az Courier', description: 'Kirim paket & dokumen standar', isEnabled: true, isActive: true, icon: '📦' },
    { id: 'AZ_EXPRESS', name: 'Az Express', description: 'Pengiriman kilat same-day/next-day', isEnabled: true, isActive: true, icon: '🚚' },
    { id: 'AZ_CARGO', name: 'Az Cargo', description: 'Barang besar, pickup & truk', isEnabled: true, isActive: true, icon: '🚛' },
    { id: 'AZ_MART', name: 'Az Mart', description: 'Belanja sembako & kebutuhan harian', isEnabled: true, isActive: true, icon: '🛒' },
    { id: 'AZ_PICKUP', name: 'Az Pickup', description: 'Jemput barang ke lokasi Anda', isEnabled: true, isActive: true, icon: '📍' },
    { id: 'TRACKING', name: 'Tracking', description: 'Lacak pengiriman resi real-time', isEnabled: true, isActive: true, icon: '🔎' }
  ];

  getServicesConfig() {
    return this.servicesConfig;
  }

  toggleServiceStatus(serviceId: string) {
    const s = this.servicesConfig.find(x => x.id === serviceId);
    if (!s) throw new Error('Layanan tidak ditemukan');
    s.isEnabled = !s.isEnabled;
    (s as any).isActive = s.isEnabled;
    return s;
  }

  getMetrics() {
    return {
      todayRevenue: 14850000,
      activeOrdersCount: this.orders.length,
      onlineDriversCount: this.drivers.filter(d => d.isOnline && d.isActive !== false).length,
      totalParcelsToday: 142,
      onTimeDeliveryRate: '98.4%'
    };
  }

  getOrders(filterType?: string) {
    if (!filterType || filterType === 'ALL') return this.orders;
    return this.orders.filter(o => o.serviceType === filterType);
  }

  getPricing() {
    return this.pricingConfigs;
  }

  updatePricing(newConfigs: any) {
    this.pricingConfigs = { ...this.pricingConfigs, ...newConfigs };
    return this.pricingConfigs;
  }

  // 1. MANAJEMEN MITRA DRIVER
  getDrivers() {
    return this.drivers;
  }

  addDriver(data: { name: string; phone: string; vehicle: string; role: string }) {
    const newDriver = {
      id: `drv-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      vehicle: data.vehicle,
      role: data.role || 'MOTORBIKE',
      isOnline: true,
      status: 'VERIFIED',
      rating: 5.0,
      isActive: true
    };
    this.drivers.unshift(newDriver);
    return newDriver;
  }

  verifyDriver(driverId: string) {
    const d = this.drivers.find(x => x.id === driverId);
    if (d) d.status = 'VERIFIED';
    return d;
  }

  toggleDriverStatus(driverId: string) {
    const d = this.drivers.find(x => x.id === driverId);
    if (!d) throw new Error('Driver tidak ditemukan');
    (d as any).isActive = (d as any).isActive === false ? true : false;
    if (!(d as any).isActive) {
      d.isOnline = false; // Nonaktifkan status online driver
    }
    return d;
  }

  // 2. MANAJEMEN MITRA TOKO / RESTO & MART
  getMerchants(): MerchantStore[] {
    return foodAndMartService.getAllMerchants();
  }

  toggleMerchantStatus(merchantId: string) {
    return foodAndMartService.toggleMerchantStatus(merchantId);
  }

  // 3. MANAJEMEN CABANG DROP POINT & GUDANG SORTIR
  async toggleHub(hubId: string) {
    return await expeditionRepository.toggleHub(hubId);
  }

  addMerchant(data: {
    name: string;
    category: string;
    type: 'FOOD' | 'MART';
    address: string;
    bannerUrl?: string;
    initialItemName?: string;
    initialItemPrice?: number;
  }): MerchantStore {
    const defaultBanner = data.type === 'FOOD'
      ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500'
      : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';

    const newMerchant: MerchantStore = {
      id: `mch-${Date.now()}`,
      name: data.name,
      category: data.category,
      type: data.type,
      rating: 5.0,
      bannerUrl: data.bannerUrl || defaultBanner,
      address: data.address,
      isOpen: true,
      items: data.initialItemName ? [
        {
          id: `item-${Date.now()}`,
          name: data.initialItemName,
          price: Number(data.initialItemPrice || 20000),
          description: 'Menu / produk unggulan mitra',
          imageUrl: '',
          isAvailable: true
        }
      ] : []
    };

    return foodAndMartService.addMerchant(newMerchant);
  }

  // 3. MANAJEMEN CABANG DROP POINT & GUDANG SORTIR
  async getHubs(): Promise<Hub[]> {
    return await expeditionRepository.getHubs();
  }

  async addHub(data: { hubCode: string; name: string; hubType: 'DROP_POINT' | 'SORTING_CENTER'; city: string; address: string }): Promise<Hub> {
    const newHub: Hub = {
      id: `hub-${Date.now()}`,
      hubCode: data.hubCode.toUpperCase(),
      name: data.name,
      hubType: data.hubType,
      city: data.city,
      address: data.address,
      isActive: true
    };
    return await expeditionRepository.addHub(newHub);
  }
}

export const adminService = new AdminService();
