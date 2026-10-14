import { UserRole } from '@delivery/shared';
import { 
  MOCK_USERS, 
  MOCK_RESTAURANTS, 
  MOCK_MARTS, 
  MOCK_HUBS, 
  MOCK_ADMIN_ORDERS, 
  MOCK_PRICING, 
  MOCK_DRIVERS, 
  MOCK_SERVICES, 
  MOCK_FINANCE_SUMMARY, 
  MOCK_COMMISSION_CONFIG, 
  MOCK_WITHDRAWALS, 
  MOCK_PARTNER_APPLICATIONS 
} from './mockBackend';
import { getSupabase } from './supabaseClient';

const BASE_URL = '/api';

let runtimeDemoMode: boolean | null = null;

export const setApiDemoMode = (isDemo: boolean) => {
  runtimeDemoMode = isDemo;
};

export const isCurrentDemoMode = (): boolean => {
  if (runtimeDemoMode !== null) return runtimeDemoMode;
  if (typeof window === 'undefined') return false;
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get('demo') === 'true' || searchParams.get('demo') === '1' || searchParams.get('mode') === 'demo') {
    return true;
  }
  if (searchParams.get('real') === 'true' || searchParams.get('real') === '1' || searchParams.get('mode') === 'real') {
    return false;
  }
  const saved = localStorage.getItem('azgo_demo_mode');
  if (saved !== null) {
    return saved === 'true';
  }
  return false; // Default: Real mode (bersih)
};

// Real Mode Local Persistence Helpers
function getRealStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setRealStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/**
 * Helper request aman (Safe Fetch):
 * Menghubungi backend API jika ada. 
 * Jika backend tidak aktif / 404 HTML (seperti di Vercel frontend-only),
 * otomatis menggunakan data mock lokal tanpa error JSON parsing!
 */
async function safeFetch(
  endpoint: string, 
  options: RequestInit | undefined, 
  fallbackFn: () => any
): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch (err) {
    // Backend offline / running static on Vercel
  }
  return fallbackFn();
}

export const api = {
  // 1. Az Courier & Az Express (Tarif, Resi AWB)
  async checkExpeditionRate(data: {
    originCity: string;
    destinationCity: string;
    weightKg: number;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    serviceCode?: 'REGULAR' | 'EXPRESS';
  }): Promise<any> {
    return safeFetch('/expedition/check-rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const volWeight = Math.round((data.lengthCm * data.widthCm * data.heightCm) / 6000);
      const chargeableWeight = Math.max(data.weightKg, volWeight, 1);
      const isExpress = data.serviceCode === 'EXPRESS';
      const basePerKg = isExpress ? 18000 : 11000;
      const total = basePerKg * chargeableWeight;
      return {
        success: true,
        data: {
          serviceCode: data.serviceCode || 'REGULAR',
          serviceName: isExpress ? 'Az Express (Sameday/Nextday)' : 'Az Courier (Reguler)',
          origin: data.originCity,
          destination: data.destinationCity,
          chargeableWeightKg: chargeableWeight,
          baseRatePerKg: basePerKg,
          ratePerKg: basePerKg,
          shippingFee: total,
          appFee: 2000,
          totalCost: total + 2000,
          etdText: isExpress ? '0-1 Hari (Sameday/Kilat)' : '1-3 Hari Kerja',
          estimatedDays: isExpress ? '0-1 Hari (Sameday/Kilat)' : '1-3 Hari Kerja'
        }
      };
    });
  },

  // 2. Az Cargo (Barang Besar / Armada Truk & Pickup)
  async checkCargoRate(data: {
    vehicleType: string;
    distanceKm: number;
    helperCount: number;
  }): Promise<any> {
    return safeFetch('/expedition/cargo-fare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const baseFare = data.vehicleType === 'TRUCK_ENGKEL' ? 250000 : 85000;
      const distanceFare = data.distanceKm * 5000;
      const helperFee = data.helperCount * 50000;
      return {
        success: true,
        data: {
          vehicleType: data.vehicleType,
          distanceKm: data.distanceKm,
          helperCount: data.helperCount,
          baseFare,
          distanceFare,
          helperFee,
          totalAmount: baseFare + distanceFare + helperFee
        }
      };
    });
  },

  // 3. Kirim Paket & Terbitkan Resi (Az Courier / Az Express / Az Cargo)
  async createExpeditionShipment(data: any): Promise<any> {
    return safeFetch('/expedition/shipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const prefix = data.serviceType === 'EXPRESS' ? 'AZX' : (data.serviceType === 'CARGO' ? 'AZK' : 'AZC');
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const awb = `${prefix}-${dateStr}-${randomDigits}`;
      const newOrder = {
        id: 'ord-' + Date.now(),
        orderNumber: awb,
        trackingNumber: awb,
        serviceType: data.serviceType === 'EXPRESS' ? 'AZ_EXPRESS' : (data.serviceType === 'CARGO' ? 'AZ_CARGO' : 'AZ_COURIER'),
        serviceName: data.serviceType === 'EXPRESS' ? 'Az Express (Kilat)' : (data.serviceType === 'CARGO' ? 'Az Cargo' : 'Az Courier'),
        customerName: data.senderName || 'Pelanggan AzGo',
        customerPhone: data.senderPhone || '',
        driverName: 'Menunggu Driver',
        pickup: data.originCity || data.pickupAddress || 'Drop Point',
        dropoff: data.destinationCity || data.deliveryAddress || 'Alamat Penerima',
        status: 'ORDER_CREATED',
        totalAmount: Number(data.totalCost) || Number(data.totalAmount) || 15000,
        createdAt: new Date().toISOString(),
        ...data
      };

      if (!isCurrentDemoMode()) {
        const existing = getRealStorage<any[]>('azgo_real_admin_orders', []);
        setRealStorage('azgo_real_admin_orders', [newOrder, ...existing]);
      }

      return {
        success: true,
        message: 'Resi Pengiriman Berhasil Diterbitkan!',
        data: newOrder
      };
    });
  },

  // 4. Az Pickup (Jemput Barang ke Rumah)
  async requestPickup(data: {
    senderName: string;
    senderPhone: string;
    pickupAddress: string;
    scheduledTime?: string;
    estimatedPackages: number;
    notes?: string;
  }): Promise<any> {
    return safeFetch('/expedition/pickup-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const pCode = 'AZP-' + Math.floor(100000 + Math.random() * 900000);
      const newOrder = {
        id: 'ord-' + Date.now(),
        pickupCode: pCode,
        orderNumber: pCode,
        trackingNumber: pCode,
        serviceType: 'AZ_PICKUP',
        serviceName: 'Az Pickup (Jemput Paket)',
        customerName: data.senderName,
        customerPhone: data.senderPhone,
        driverName: 'Menunggu Kurir Penjemput',
        pickup: data.pickupAddress,
        dropoff: 'Drop Point Terdekat',
        status: 'SCHEDULED',
        totalAmount: 0,
        createdAt: new Date().toISOString(),
        ...data
      };

      if (!isCurrentDemoMode()) {
        const existing = getRealStorage<any[]>('azgo_real_admin_orders', []);
        setRealStorage('azgo_real_admin_orders', [newOrder, ...existing]);
      }

      return {
        success: true,
        message: 'Permintaan jemput paket berhasil dijadwalkan!',
        data: newOrder
      };
    });
  },

  // 5. Universal Tracking (Semua Resi AZ GO)
  async trackAWB(awb: string): Promise<any> {
    return safeFetch(`/expedition/track/${awb}`, undefined, () => {
      if (!isCurrentDemoMode()) {
        const realOrders = getRealStorage<any[]>('azgo_real_admin_orders', []);
        const found = realOrders.find(o => o.orderNumber === awb || o.trackingNumber === awb);
        if (found) {
          return {
            success: true,
            message: 'Data pelacakan resi berhasil ditemukan',
            data: {
              trackingNumber: awb,
              serviceType: found.serviceType,
              serviceName: found.serviceName,
              status: found.status || 'ORDER_CREATED',
              origin: found.pickup,
              destination: found.dropoff,
              senderName: found.customerName || found.senderName || 'Pengirim',
              receiverName: found.receiverName || 'Penerima',
              checkpoints: [
                { 
                  title: 'Pesanan Diterima Sistem', 
                  description: 'Resi terdaftar dalam antrean sistem operasional', 
                  city: found.pickup, 
                  timestamp: found.createdAt 
                }
              ]
            }
          };
        }
        return {
          success: false,
          message: `Nomor resi ${awb} tidak ditemukan pada database operasional.`
        };
      }

      const isExpress = awb.startsWith('AZX');
      const isCargo = awb.startsWith('AZK');
      return {
        success: true,
        message: 'Data pelacakan resi berhasil ditemukan',
        data: {
          trackingNumber: awb,
          serviceType: isExpress ? 'AZ_EXPRESS' : (isCargo ? 'AZ_CARGO' : 'AZ_COURIER'),
          serviceName: isExpress ? 'Az Express (Kilat Prioritas)' : (isCargo ? 'Az Cargo (Muatan Besar)' : 'Az Courier (Reguler)'),
          status: 'ON_THE_WAY',
          origin: 'Jakarta (Drop Point Tebet)',
          destination: 'Surabaya (Gateway Gubeng)',
          senderName: 'Siti Rahma',
          receiverName: 'Budi Santoso',
          checkpoints: [
            { title: 'Paket Diantar Kurir Terakhir', description: 'Kurir sedang dalam perjalanan menuju alamat penerima', city: 'Surabaya', timestamp: new Date().toISOString() },
            { title: 'Tiba di Sorting Center Surabaya', description: 'Paket telah selesai disortir di Gateway Surabaya', city: 'Surabaya', timestamp: new Date(Date.now() - 4 * 3600000).toISOString() },
            { title: 'Diberangkatkan dari Jakarta Hub', description: 'Paket dalam perjalanan darat via Truk Ekspedisi AZ GO', city: 'Jakarta', timestamp: new Date(Date.now() - 14 * 3600000).toISOString() },
            { title: 'Resi Diterbitkan', description: 'Paket diterima di Drop Point Tebet', city: 'Jakarta', timestamp: new Date(Date.now() - 24 * 3600000).toISOString() }
          ]
        }
      };
    });
  },

  async addScanCheckpoint(data: { trackingNumber: string; city: string; checkpointTitle: string; description: string }): Promise<any> {
    return safeFetch('/expedition/checkpoints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => ({ success: true, message: 'Checkpoint berhasil ditambahkan' }));
  },

  async getHubs(): Promise<any> {
    return safeFetch('/expedition/hubs', undefined, () => {
      if (isCurrentDemoMode()) {
        return { success: true, data: MOCK_HUBS };
      }
      const realHubs = getRealStorage<any[]>('azgo_real_hubs', []);
      return { success: true, data: realHubs.filter(h => h.isActive !== false) };
    });
  },

  // 6. Az Delivery (Resto Makanan & Minuman)
  async getRestaurants(): Promise<any> {
    return safeFetch('/food/restaurants', undefined, () => {
      if (isCurrentDemoMode()) {
        return { success: true, data: MOCK_RESTAURANTS };
      }
      const realMerchants = getRealStorage<any[]>('azgo_real_merchants', []);
      const foodStores = realMerchants.filter(m => m.type === 'FOOD' && m.isActive !== false);
      return { success: true, data: foodStores };
    });
  },

  // 7. Az Mart (Belanja Sembako, Minimarket, Sayur)
  async getMartStores(): Promise<any> {
    return safeFetch('/food/marts', undefined, () => {
      if (isCurrentDemoMode()) {
        return { success: true, data: MOCK_MARTS };
      }
      const realMerchants = getRealStorage<any[]>('azgo_real_merchants', []);
      const martStores = realMerchants.filter(m => m.type === 'MART' && m.isActive !== false);
      return { success: true, data: martStores };
    });
  },

  async calculateOrder(items: { productId: string; quantity: number }[], isMart: boolean = false): Promise<any> {
    return safeFetch('/food/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, isMart })
    }, () => {
      const subtotal = items.reduce((acc, curr) => acc + (curr.quantity * 25000), 0) || 50000;
      return {
        success: true,
        data: {
          subtotal,
          deliveryFee: 9000,
          serviceFee: 2000,
          total: subtotal + 9000 + 2000
        }
      };
    });
  },

  // Ride Hailing
  async estimateRide(data: { distanceKm: number; vehicleType: 'MOTORBIKE' | 'CAR' }): Promise<any> {
    return safeFetch('/ride/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => ({
      success: true,
      data: {
        distanceKm: data.distanceKm,
        fare: (data.vehicleType === 'CAR' ? 18000 : 10000) + (data.distanceKm * 3000)
      }
    }));
  },

  async orderRide(data: any): Promise<any> {
    return safeFetch('/ride/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const newRide = { ...data, id: 'ride-' + Date.now(), status: 'SEARCHING_DRIVER', createdAt: new Date().toISOString() };
      if (!isCurrentDemoMode()) {
        const existing = getRealStorage<any[]>('azgo_real_admin_orders', []);
        setRealStorage('azgo_real_admin_orders', [newRide, ...existing]);
      }
      return { success: true, data: newRide };
    });
  },

  // 8. ADMIN BACKOFFICE APIS
  async getAdminMetrics(): Promise<any> {
    return safeFetch('/admin/overview', undefined, () => {
      if (isCurrentDemoMode()) {
        return {
          success: true,
          data: {
            todayRevenue: 18450000,
            activeOrdersCount: 24,
            onlineDriversCount: 18,
            totalParcelsToday: 142,
            onTimeDeliveryRate: '98.4%'
          }
        };
      }

      const orders = getRealStorage<any[]>('azgo_real_admin_orders', []);
      const drivers = getRealStorage<any[]>('azgo_real_drivers', []);
      const todayRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.totalCost) || 0), 0);
      return {
        success: true,
        data: {
          todayRevenue,
          activeOrdersCount: orders.length,
          onlineDriversCount: drivers.filter(d => d.isActive !== false).length,
          totalParcelsToday: orders.length,
          onTimeDeliveryRate: orders.length > 0 ? '100%' : '-'
        }
      };
    });
  },

  async getAdminOrders(serviceType?: string): Promise<any> {
    const url = serviceType && serviceType !== 'ALL'
      ? `/admin/orders?serviceType=${serviceType}`
      : `/admin/orders`;
    return safeFetch(url, undefined, () => {
      if (isCurrentDemoMode()) {
        const filtered = serviceType && serviceType !== 'ALL'
          ? MOCK_ADMIN_ORDERS.filter(o => o.serviceType === serviceType)
          : MOCK_ADMIN_ORDERS;
        return { success: true, data: filtered };
      }

      let realOrders = getRealStorage<any[]>('azgo_real_admin_orders', []);
      if (serviceType && serviceType !== 'ALL') {
        realOrders = realOrders.filter(o => o.serviceType === serviceType);
      }
      return { success: true, data: realOrders };
    });
  },

  async getAdminPricing(): Promise<any> {
    return safeFetch('/admin/pricing', undefined, () => {
      if (isCurrentDemoMode()) {
        return { success: true, data: MOCK_PRICING };
      }
      const realPricing = getRealStorage('azgo_real_pricing', MOCK_PRICING);
      return { success: true, data: realPricing };
    });
  },

  async updateAdminPricing(configs: any): Promise<any> {
    return safeFetch('/admin/pricing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configs)
    }, () => {
      if (!isCurrentDemoMode()) {
        setRealStorage('azgo_real_pricing', configs);
      }
      return {
        success: true,
        message: 'Konfigurasi tarif berhasil diperbarui',
        data: configs
      };
    });
  },

  async getAdminDrivers(): Promise<any> {
    return safeFetch('/admin/drivers', undefined, () => {
      if (isCurrentDemoMode()) {
        return { success: true, data: MOCK_DRIVERS };
      }
      const realDrivers = getRealStorage<any[]>('azgo_real_drivers', []);
      return { success: true, data: realDrivers };
    });
  },

  async verifyDriver(driverId: string): Promise<any> {
    return safeFetch(`/admin/drivers/${driverId}/verify`, { method: 'PATCH' }, () => {
      if (!isCurrentDemoMode()) {
        const drivers = getRealStorage<any[]>('azgo_real_drivers', []);
        const updated = drivers.map(d => d.id === driverId ? { ...d, status: 'VERIFIED', isVerified: true } : d);
        setRealStorage('azgo_real_drivers', updated);
      }
      return {
        success: true,
        message: 'Mitra driver berhasil diverifikasi'
      };
    });
  },

  async createAdminDriver(data: any): Promise<any> {
    return safeFetch('/admin/drivers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const newDriver = {
        ...data,
        id: 'drv-' + Date.now(),
        rating: 5.0,
        completedTrips: 0,
        status: 'ONLINE',
        isOnline: true,
        isActive: true,
        isVerified: true,
        createdAt: new Date().toISOString()
      };

      if (!isCurrentDemoMode()) {
        const drivers = getRealStorage<any[]>('azgo_real_drivers', []);
        setRealStorage('azgo_real_drivers', [newDriver, ...drivers]);
      }

      return {
        success: true,
        message: 'Driver berhasil ditambahkan',
        data: newDriver
      };
    });
  },

  async toggleAdminDriver(driverId: string): Promise<any> {
    return safeFetch(`/admin/drivers/${driverId}/toggle`, { method: 'PATCH' }, () => {
      if (!isCurrentDemoMode()) {
        const drivers = getRealStorage<any[]>('azgo_real_drivers', []);
        const target = drivers.find(d => d.id === driverId);
        const newStatus = target ? !target.isActive : false;
        const updated = drivers.map(d => d.id === driverId ? { ...d, isActive: newStatus } : d);
        setRealStorage('azgo_real_drivers', updated);
        return {
          success: true,
          message: 'Status driver diperbarui',
          data: { id: driverId, isActive: newStatus }
        };
      }
      return {
        success: true,
        message: 'Status driver diperbarui',
        data: { id: driverId, isActive: true }
      };
    });
  },

  async getAdminMerchants(): Promise<any> {
    return safeFetch('/admin/merchants', undefined, () => {
      if (isCurrentDemoMode()) {
        return { success: true, data: [...MOCK_RESTAURANTS, ...MOCK_MARTS] };
      }
      const realMerchants = getRealStorage<any[]>('azgo_real_merchants', []);
      return { success: true, data: realMerchants };
    });
  },

  async createAdminMerchant(data: any): Promise<any> {
    return safeFetch('/admin/merchants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const newMerchant = {
        id: 'merch-' + Date.now(),
        name: data.name,
        type: data.type || 'FOOD',
        category: data.category || (data.type === 'MART' ? 'Minimarket' : 'Kuliner'),
        address: data.address || '',
        rating: 5.0,
        isOpen: true,
        isActive: true,
        bannerUrl: data.type === 'MART'
          ? 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
        items: data.initialItemName ? [
          {
            id: 'item-' + Date.now(),
            name: data.initialItemName,
            price: Number(data.initialItemPrice) || 25000,
            category: data.category || 'Menu Utama',
            isAvailable: true,
            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
          }
        ] : [],
        createdAt: new Date().toISOString()
      };

      if (!isCurrentDemoMode()) {
        const merchants = getRealStorage<any[]>('azgo_real_merchants', []);
        setRealStorage('azgo_real_merchants', [newMerchant, ...merchants]);
      }

      return {
        success: true,
        message: 'Mitra toko berhasil ditambahkan',
        data: newMerchant
      };
    });
  },

  async toggleAdminMerchant(merchantId: string): Promise<any> {
    return safeFetch(`/admin/merchants/${merchantId}/toggle`, { method: 'PATCH' }, () => {
      if (!isCurrentDemoMode()) {
        const merchants = getRealStorage<any[]>('azgo_real_merchants', []);
        const target = merchants.find(m => m.id === merchantId);
        const newStatus = target ? !target.isActive : false;
        const updated = merchants.map(m => m.id === merchantId ? { ...m, isActive: newStatus } : m);
        setRealStorage('azgo_real_merchants', updated);
        return {
          success: true,
          message: 'Status toko diperbarui',
          data: { id: merchantId, isActive: newStatus }
        };
      }
      return {
        success: true,
        message: 'Status merchant diperbarui',
        data: { id: merchantId, isActive: true }
      };
    });
  },

  async getAdminHubs(): Promise<any> {
    return safeFetch('/admin/hubs', undefined, () => {
      if (isCurrentDemoMode()) {
        return { success: true, data: MOCK_HUBS };
      }
      const realHubs = getRealStorage<any[]>('azgo_real_hubs', []);
      return { success: true, data: realHubs };
    });
  },

  async createAdminHub(data: any): Promise<any> {
    return safeFetch('/admin/hubs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const newHub = {
        ...data,
        id: 'hub-' + Date.now(),
        isActive: true,
        totalIncomingParcels: 0,
        totalDispatchedParcels: 0,
        createdAt: new Date().toISOString()
      };

      if (!isCurrentDemoMode()) {
        const hubs = getRealStorage<any[]>('azgo_real_hubs', []);
        setRealStorage('azgo_real_hubs', [newHub, ...hubs]);
      }

      return {
        success: true,
        message: 'Hub drop point berhasil ditambahkan',
        data: newHub
      };
    });
  },

  async toggleAdminHub(hubId: string): Promise<any> {
    return safeFetch(`/admin/hubs/${hubId}/toggle`, { method: 'PATCH' }, () => {
      if (!isCurrentDemoMode()) {
        const hubs = getRealStorage<any[]>('azgo_real_hubs', []);
        const target = hubs.find(h => h.id === hubId);
        const newStatus = target ? !target.isActive : false;
        const updated = hubs.map(h => h.id === hubId ? { ...h, isActive: newStatus } : h);
        setRealStorage('azgo_real_hubs', updated);
        return {
          success: true,
          message: 'Status hub diperbarui',
          data: { id: hubId, isActive: newStatus }
        };
      }
      return {
        success: true,
        message: 'Status hub diperbarui',
        data: { id: hubId, isActive: true }
      };
    });
  },

  // 9. AUTH & USER MANAGEMENT APIS (TERHUBUNG KE SUPABASE REAL DENGAN FALLBACK MOCK)
  async login(identifier: string, password?: string): Promise<any> {
    const cleanId = (identifier || '').trim().toLowerCase();
    const sb = getSupabase();

    // 1. Coba verifikasi ke database Supabase (Mode Real)
    if (sb) {
      try {
        let query = sb.from('users').select('*');
        if (cleanId === 'admin') {
          query = query.or('email.ilike.admin%,email.ilike.%admin@%');
        } else {
          query = query.or(`email.ilike.${cleanId},phone.eq.${cleanId}`);
        }

        const { data: users, error } = await query;
        if (!error && users && users.length > 0) {
          const sbUser = users[0];
          if (password && sbUser.password && sbUser.password !== password) {
            return { success: false, message: 'Password yang Anda masukkan salah.' };
          }
          if (sbUser.is_active === false) {
            return { success: false, message: 'Akun Anda sedang dinonaktifkan / diblokir oleh Administrator.' };
          }

          const userObj = {
            id: sbUser.id,
            email: sbUser.email,
            phone: sbUser.phone || '',
            fullName: sbUser.full_name,
            role: sbUser.role as UserRole,
            isActive: sbUser.is_active !== false,
            createdAt: sbUser.created_at || new Date().toISOString(),
            updatedAt: sbUser.updated_at || new Date().toISOString()
          };

          return {
            success: true,
            message: 'Login berhasil!',
            data: { user: userObj, token: 'sb-jwt-' + sbUser.id }
          };
        }
      } catch (sbErr) {
        console.warn('Supabase login check error:', sbErr);
      }
    }

    // 2. Akun Real Admin bawaan (admin / admin123)
    if (cleanId === 'admin' || cleanId === 'admin@azgo.com') {
      if (!password || password === 'admin123') {
        const realAdminUser = {
          id: 'usr-admin-real',
          email: 'admin@azgo.com',
          phone: '081200000000',
          fullName: 'Super Admin AzGo',
          role: 'ADMIN' as UserRole,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return {
          success: true,
          message: 'Login berhasil sebagai Super Admin',
          data: { user: realAdminUser, token: 'real-session-admin' }
        };
      } else {
        return { success: false, message: 'Password admin salah! (Default: admin123)' };
      }
    }

    // 3. Cek di daftar user real local jika terdaftar
    const realUsers = getRealStorage<any[]>('azgo_real_users', []);
    const localUser = realUsers.find(
      u => u.email.toLowerCase() === cleanId || u.phone === cleanId
    );
    if (localUser) {
      if (password && localUser.password && localUser.password !== password) {
        return { success: false, message: 'Password salah.' };
      }
      return {
        success: true,
        message: 'Login berhasil!',
        data: { user: localUser, token: 'real-token-' + localUser.id }
      };
    }

    // 4. Jika sedang di MODE DEMO: Boleh pakai akun demo instan
    if (isCurrentDemoMode()) {
      const user = MOCK_USERS.find(
        u => u.email.toLowerCase() === cleanId || u.phone === cleanId
      );

      if (user) {
        return {
          success: true,
          message: 'Login berhasil (Demo)!',
          data: { user, token: 'mock-session-jwt-' + user.id }
        };
      }

      if (cleanId.includes('driver')) {
        return { success: true, message: 'Login demo Driver', data: { user: MOCK_USERS[1], token: 'mock-driver' } };
      }
      if (cleanId.includes('resto')) {
        return { success: true, message: 'Login demo Resto', data: { user: MOCK_USERS[2], token: 'mock-resto' } };
      }
      if (cleanId.includes('mart')) {
        return { success: true, message: 'Login demo Mart', data: { user: MOCK_USERS[3], token: 'mock-mart' } };
      }
      if (cleanId.includes('hub')) {
        return { success: true, message: 'Login demo Hub', data: { user: MOCK_USERS[4], token: 'mock-hub' } };
      }
    }

    // 5. Di Mode Real: Tolak jika akun tidak terdaftar
    return {
      success: false,
      message: 'Akun tidak ditemukan. Di Mode Real, hanya akun resmi yang dapat masuk. Hubungi Admin untuk membuat akun.'
    };
  },

  async registerCustomer(data: { fullName: string; phone: string; email: string; password?: string }): Promise<any> {
    const sb = getSupabase();
    if (sb) {
      try {
        const { data: newUser, error } = await sb.from('users').insert({
          email: data.email,
          phone: data.phone,
          full_name: data.fullName,
          role: 'CUSTOMER',
          password: data.password || 'user123',
          is_active: true
        }).select().single();

        if (newUser && !error) {
          const uObj = {
            id: newUser.id,
            fullName: newUser.full_name,
            phone: newUser.phone,
            email: newUser.email,
            role: 'CUSTOMER' as UserRole,
            isActive: newUser.is_active !== false,
            createdAt: newUser.created_at,
            updatedAt: newUser.updated_at
          };
          const existing = getRealStorage<any[]>('azgo_real_users', []);
          setRealStorage('azgo_real_users', [uObj, ...existing]);

          return {
            success: true,
            message: 'Pendaftaran akun berhasil!',
            data: { user: uObj, token: 'sb-reg-token-' + newUser.id }
          };
        }
      } catch (err) {}
    }

    const localNewUser = {
      id: 'usr-cust-' + Date.now(),
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      role: 'CUSTOMER' as UserRole,
      password: data.password || 'user123',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const existing = getRealStorage<any[]>('azgo_real_users', []);
    setRealStorage('azgo_real_users', [localNewUser, ...existing]);

    return {
      success: true,
      message: 'Pendaftaran akun berhasil!',
      data: { user: localNewUser, token: 'real-reg-token-' + localNewUser.id }
    };
  },

  async changeOwnPassword(userId: string, currentPassword: string, newPassword: string): Promise<any> {
    const sb = getSupabase();
    if (sb) {
      try {
        const { data: curr } = await sb.from('users').select('password').eq('id', userId).maybeSingle();
        if (curr && curr.password !== currentPassword) {
          return { success: false, message: 'Password saat ini salah.' };
        }
        await sb.from('users').update({ password: newPassword, updated_at: new Date().toISOString() }).eq('id', userId);
        return { success: true, message: 'Password berhasil diubah!' };
      } catch (err) {}
    }

    const realUsers = getRealStorage<any[]>('azgo_real_users', []);
    const updated = realUsers.map(u => u.id === userId ? { ...u, password: newPassword, updatedAt: new Date().toISOString() } : u);
    setRealStorage('azgo_real_users', updated);

    return {
      success: true,
      message: 'Password berhasil diubah!'
    };
  },

  async getAdminUsers(): Promise<any> {
    if (isCurrentDemoMode()) {
      return {
        success: true,
        data: MOCK_USERS
      };
    }

    // Mode Real: Ambil data pengguna nyata dari Supabase
    const sb = getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb.from('users').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0 && !error) {
          return {
            success: true,
            data: data.map(u => ({
              id: u.id,
              email: u.email,
              phone: u.phone,
              fullName: u.full_name,
              role: u.role as UserRole,
              isActive: u.is_active !== false,
              createdAt: u.created_at || new Date().toISOString(),
              updatedAt: u.updated_at || new Date().toISOString()
            }))
          };
        }
      } catch (err) {}
    }

    // Fallback: Real storage (Hanya akun admin nyata, bukan akun demo Siti/Rudi)
    const localReal = getRealStorage<any[]>('azgo_real_users', []);
    if (localReal.length > 0) {
      return { success: true, data: localReal };
    }

    const defaultAdminOnly = [
      {
        id: 'usr-admin-real',
        email: 'admin@azgo.com',
        phone: '081200000000',
        fullName: 'Super Admin AzGo',
        role: 'ADMIN' as UserRole,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    setRealStorage('azgo_real_users', defaultAdminOnly);
    return {
      success: true,
      data: defaultAdminOnly
    };
  },

  async createAdminUser(data: { email: string; phone: string; fullName: string; role: string; password?: string }): Promise<any> {
    const role = (data.role || 'CUSTOMER') as UserRole;
    const sb = getSupabase();
    if (sb) {
      try {
        const { data: newUser, error } = await sb.from('users').insert({
          email: data.email,
          phone: data.phone,
          full_name: data.fullName,
          role,
          password: data.password || 'admin123',
          is_active: true
        }).select().single();

        if (newUser && !error) {
          const userObj = {
            id: newUser.id,
            email: newUser.email,
            phone: newUser.phone,
            fullName: newUser.full_name,
            role: newUser.role as UserRole,
            isActive: newUser.is_active !== false,
            createdAt: newUser.created_at,
            updatedAt: newUser.updated_at
          };
          const existing = getRealStorage<any[]>('azgo_real_users', []);
          setRealStorage('azgo_real_users', [userObj, ...existing]);

          return {
            success: true,
            message: 'User berhasil dibuat',
            data: userObj
          };
        }
      } catch (err) {}
    }

    const localUser = {
      id: 'usr-' + Date.now(),
      ...data,
      role,
      password: data.password || 'admin123',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const existing = getRealStorage<any[]>('azgo_real_users', []);
    setRealStorage('azgo_real_users', [localUser, ...existing]);

    return {
      success: true,
      message: 'User berhasil dibuat',
      data: localUser
    };
  },

  async adminResetPassword(targetUserId: string, newPassword: string): Promise<any> {
    const sb = getSupabase();
    if (sb) {
      try {
        await sb.from('users').update({ password: newPassword, updated_at: new Date().toISOString() }).eq('id', targetUserId);
      } catch (err) {}
    }

    const realUsers = getRealStorage<any[]>('azgo_real_users', []);
    const updated = realUsers.map(u => u.id === targetUserId ? { ...u, password: newPassword } : u);
    setRealStorage('azgo_real_users', updated);

    return {
      success: true,
      message: `Password berhasil direset menjadi: ${newPassword}`
    };
  },

  async toggleAdminUser(userId: string): Promise<any> {
    const sb = getSupabase();
    if (sb) {
      try {
        const { data: curr } = await sb.from('users').select('*').eq('id', userId).maybeSingle();
        if (curr) {
          const newStatus = !curr.is_active;
          await sb.from('users').update({ is_active: newStatus, updated_at: new Date().toISOString() }).eq('id', userId);
          return {
            success: true,
            message: `Akses login user ${curr.full_name} berhasil ${newStatus ? 'diaktifkan' : 'diblokir'}`,
            data: {
              id: userId,
              fullName: curr.full_name,
              isActive: newStatus
            }
          };
        }
      } catch (err) {}
    }

    const realUsers = getRealStorage<any[]>('azgo_real_users', []);
    const target = realUsers.find(u => u.id === userId);
    const newStatus = target ? !target.isActive : false;
    const updated = realUsers.map(u => u.id === userId ? { ...u, isActive: newStatus } : u);
    setRealStorage('azgo_real_users', updated);

    return {
      success: true,
      message: `Akses user berhasil ${newStatus ? 'diaktifkan' : 'diblokir'}`,
      data: {
        id: userId,
        fullName: target?.fullName || 'User',
        isActive: newStatus
      }
    };
  },

  async getAdminServices(): Promise<any> {
    return safeFetch('/admin/services', undefined, () => ({
      success: true,
      data: MOCK_SERVICES
    }));
  },

  async toggleAdminService(serviceId: string): Promise<any> {
    return safeFetch(`/admin/services/${serviceId}/toggle`, { method: 'PATCH' }, () => ({
      success: true,
      message: 'Status layanan diperbarui'
    }));
  },

  // 10. PENDAFTARAN MITRA (DRIVER & TOKO/RESTO/MART)
  async submitPartnerApplication(data: any): Promise<any> {
    return safeFetch('/partner/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const newApp = {
        ...data,
        id: 'pa-' + Date.now(),
        status: 'PENDING_REVIEW',
        createdAt: new Date().toISOString(),
        submittedAt: new Date().toISOString()
      };
      if (!isCurrentDemoMode()) {
        const apps = getRealStorage<any[]>('azgo_real_partner_applications', []);
        setRealStorage('azgo_real_partner_applications', [newApp, ...apps]);
      }
      return {
        success: true,
        message: 'Pendaftaran mitra berhasil dikirim! Tim AzGo akan meninjau berkas Anda dalam 1x24 jam.',
        data: newApp
      };
    });
  },

  async getPartnerApplications(status?: string, type?: string): Promise<any> {
    return safeFetch('/partner/applications', undefined, () => {
      if (isCurrentDemoMode()) {
        let apps = MOCK_PARTNER_APPLICATIONS;
        if (status && status !== 'ALL') apps = apps.filter(a => a.status === status);
        if (type && type !== 'ALL') apps = apps.filter(a => a.type === type);
        return { success: true, data: apps };
      }

      let realApps = getRealStorage<any[]>('azgo_real_partner_applications', []);
      if (status && status !== 'ALL') realApps = realApps.filter(a => a.status === status);
      if (type && type !== 'ALL') realApps = realApps.filter(a => a.type === type);
      return { success: true, data: realApps };
    });
  },

  async reviewPartnerApplication(id: string, action: 'APPROVE' | 'REJECT', reason?: string): Promise<any> {
    return safeFetch(`/partner/applications/${id}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason })
    }, () => {
      if (!isCurrentDemoMode()) {
        const apps = getRealStorage<any[]>('azgo_real_partner_applications', []);
        const updated = apps.map(a => a.id === id ? { ...a, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED', rejectReason: reason } : a);
        setRealStorage('azgo_real_partner_applications', updated);
      }
      return {
        success: true,
        message: `Pendaftaran berhasil di-${action === 'APPROVE' ? 'setujui' : 'tolak'}`,
        data: { id, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' }
      };
    });
  },

  // 11. KEUANGAN, BAGI HASIL, DAN PENARIKAN DANA
  async getFinanceSummary(): Promise<any> {
    return safeFetch('/finance/admin/summary', undefined, () => {
      if (isCurrentDemoMode()) {
        return {
          success: true,
          data: MOCK_FINANCE_SUMMARY
        };
      }

      const orders = getRealStorage<any[]>('azgo_real_admin_orders', []);
      const totalGmv = orders.reduce((acc, o) => acc + (Number(o.totalAmount) || Number(o.totalCost) || 0), 0);
      const platformRevenue = Math.round(totalGmv * 0.15);
      return {
        success: true,
        data: {
          totalGmv,
          platformRevenue,
          driverNetPayout: Math.round(totalGmv * 0.70),
          merchantNetPayout: Math.round(totalGmv * 0.15),
          pendingWithdrawals: 0,
          completedOrdersCount: orders.length
        }
      };
    });
  },

  async getCommissionConfig(): Promise<any> {
    return safeFetch('/finance/admin/commission', undefined, () => ({
      success: true,
      data: MOCK_COMMISSION_CONFIG
    }));
  },

  async updateCommissionConfig(data: any): Promise<any> {
    return safeFetch('/finance/admin/commission', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => ({
      success: true,
      message: 'Pengaturan komisi berhasil diperbarui',
      data
    }));
  },

  async getPartnerWallet(partnerId: string, type: 'DRIVER' | 'MERCHANT' = 'DRIVER'): Promise<any> {
    return safeFetch(`/finance/wallet/${partnerId}?type=${type}`, undefined, () => {
      if (isCurrentDemoMode()) {
        return {
          success: true,
          data: {
            partnerId,
            partnerType: type,
            balance: type === 'DRIVER' ? 485000 : 1240000,
            currentBalance: type === 'DRIVER' ? 485000 : 1240000,
            totalWithdrawn: 1200000,
            pendingWithdrawal: 0,
            transactions: [
              { id: 'tx-1', amount: 35000, type: 'EARNING', title: 'Komisi Order AZD-882910', date: new Date().toISOString() },
              { id: 'tx-2', amount: 24000, type: 'EARNING', title: 'Komisi Order AZC-20260927', date: new Date(Date.now() - 3600000).toISOString() }
            ],
            recentTransactions: [
              { id: 'tx-1', amount: 35000, type: 'EARNING', title: 'Komisi Order AZD-882910', date: new Date().toISOString() },
              { id: 'tx-2', amount: 24000, type: 'EARNING', title: 'Komisi Order AZC-20260927', date: new Date(Date.now() - 3600000).toISOString() }
            ]
          }
        };
      }

      return {
        success: true,
        data: {
          partnerId,
          partnerType: type,
          balance: 0,
          currentBalance: 0,
          totalWithdrawn: 0,
          pendingWithdrawal: 0,
          transactions: [],
          recentTransactions: []
        }
      };
    });
  },

  async requestWithdrawal(data: {
    partnerId: string;
    partnerName: string;
    partnerType: 'DRIVER' | 'MERCHANT';
    amount: number;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }): Promise<any> {
    return safeFetch('/finance/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const newWd = {
        ...data,
        id: 'wdr-' + Date.now(),
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      if (!isCurrentDemoMode()) {
        const list = getRealStorage<any[]>('azgo_real_withdrawals', []);
        setRealStorage('azgo_real_withdrawals', [newWd, ...list]);
      }
      return {
        success: true,
        message: 'Permintaan penarikan dana berhasil dikirim!',
        data: newWd
      };
    });
  },

  async getWithdrawalRequests(status?: string): Promise<any> {
    return safeFetch('/finance/admin/withdrawals', undefined, () => {
      if (isCurrentDemoMode()) {
        let wd = MOCK_WITHDRAWALS;
        if (status && status !== 'ALL') wd = wd.filter(w => w.status === status);
        return { success: true, data: wd };
      }

      let realWds = getRealStorage<any[]>('azgo_real_withdrawals', []);
      if (status && status !== 'ALL') realWds = realWds.filter(w => w.status === status);
      return { success: true, data: realWds };
    });
  },

  async reviewWithdrawal(id: string, action: 'APPROVE' | 'REJECT', reason?: string): Promise<any> {
    return safeFetch(`/finance/admin/withdrawals/${id}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason })
    }, () => {
      if (!isCurrentDemoMode()) {
        const list = getRealStorage<any[]>('azgo_real_withdrawals', []);
        const updated = list.map(w => w.id === id ? { ...w, status: action, reason } : w);
        setRealStorage('azgo_real_withdrawals', updated);
      }
      return {
        success: true,
        message: `Penarikan dana berhasil di-${action === 'APPROVE' ? 'setujui' : 'tolak'}`,
        data: { id, status: action }
      };
    });
  }
};
