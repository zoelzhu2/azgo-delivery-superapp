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
      return {
        success: true,
        message: 'Resi Pengiriman Berhasil Diterbitkan!',
        data: {
          ...data,
          trackingNumber: awb,
          status: 'ORDER_CREATED',
          createdAt: new Date().toISOString()
        }
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
      return {
        success: true,
        message: 'Permintaan jemput paket berhasil dijadwalkan!',
        data: {
          ...data,
          pickupCode: pCode,
          orderNumber: pCode,
          status: 'SCHEDULED'
        }
      };
    });
  },

  // 5. Universal Tracking (Semua Resi AZ GO)
  async trackAWB(awb: string): Promise<any> {
    return safeFetch(`/expedition/track/${awb}`, undefined, () => {
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
    return safeFetch('/expedition/hubs', undefined, () => ({
      success: true,
      data: MOCK_HUBS
    }));
  },

  // 6. Az Delivery (Resto Makanan & Minuman)
  async getRestaurants(): Promise<any> {
    return safeFetch('/food/restaurants', undefined, () => ({
      success: true,
      data: MOCK_RESTAURANTS
    }));
  },

  // 7. Az Mart (Belanja Sembako, Minimarket, Sayur)
  async getMartStores(): Promise<any> {
    return safeFetch('/food/marts', undefined, () => ({
      success: true,
      data: MOCK_MARTS
    }));
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
    }, () => ({
      success: true,
      data: { ...data, id: 'ride-' + Date.now(), status: 'SEARCHING_DRIVER' }
    }));
  },

  // 8. ADMIN BACKOFFICE APIS
  async getAdminMetrics(): Promise<any> {
    return safeFetch('/admin/overview', undefined, () => ({
      success: true,
      data: {
        todayRevenue: 18450000,
        activeOrdersCount: 24,
        onlineDriversCount: 18,
        totalParcelsToday: 142,
        onTimeDeliveryRate: '98.4%'
      }
    }));
  },

  async getAdminOrders(serviceType?: string): Promise<any> {
    const url = serviceType && serviceType !== 'ALL'
      ? `/admin/orders?serviceType=${serviceType}`
      : `/admin/orders`;
    return safeFetch(url, undefined, () => {
      const filtered = serviceType && serviceType !== 'ALL'
        ? MOCK_ADMIN_ORDERS.filter(o => o.serviceType === serviceType)
        : MOCK_ADMIN_ORDERS;
      return {
        success: true,
        data: filtered
      };
    });
  },

  async getAdminPricing(): Promise<any> {
    return safeFetch('/admin/pricing', undefined, () => ({
      success: true,
      data: MOCK_PRICING
    }));
  },

  async updateAdminPricing(configs: any): Promise<any> {
    return safeFetch('/admin/pricing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configs)
    }, () => ({
      success: true,
      message: 'Konfigurasi tarif berhasil diperbarui',
      data: configs
    }));
  },

  async getAdminDrivers(): Promise<any> {
    return safeFetch('/admin/drivers', undefined, () => ({
      success: true,
      data: MOCK_DRIVERS
    }));
  },

  async verifyDriver(driverId: string): Promise<any> {
    return safeFetch(`/admin/drivers/${driverId}/verify`, { method: 'PATCH' }, () => ({
      success: true,
      message: 'Mitra driver berhasil diverifikasi'
    }));
  },

  async createAdminDriver(data: any): Promise<any> {
    return safeFetch('/admin/drivers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => ({
      success: true,
      message: 'Driver berhasil ditambahkan',
      data: { ...data, id: 'drv-' + Date.now(), rating: 5.0, completedTrips: 0, status: 'ONLINE', isVerified: true }
    }));
  },

  async getAdminMerchants(): Promise<any> {
    return safeFetch('/admin/merchants', undefined, () => ({
      success: true,
      data: [...MOCK_RESTAURANTS, ...MOCK_MARTS]
    }));
  },

  async createAdminMerchant(data: any): Promise<any> {
    return safeFetch('/admin/merchants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => ({
      success: true,
      message: 'Mitra toko berhasil ditambahkan',
      data: { ...data, id: 'merch-' + Date.now(), rating: 5.0, isOpen: true, isActive: true, items: [] }
    }));
  },

  async getAdminHubs(): Promise<any> {
    return safeFetch('/admin/hubs', undefined, () => ({
      success: true,
      data: MOCK_HUBS
    }));
  },

  async createAdminHub(data: any): Promise<any> {
    return safeFetch('/admin/hubs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => ({
      success: true,
      message: 'Hub drop point berhasil ditambahkan',
      data: { ...data, id: 'hub-' + Date.now(), isActive: true, totalIncomingParcels: 0, totalDispatchedParcels: 0 }
    }));
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

        const { data: sbUser, error } = await query.limit(1).maybeSingle();
        if (sbUser && !error) {
          if (password && sbUser.password !== password) {
            return { success: false, message: 'Password salah. Periksa kembali password Anda.' };
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
        console.warn('Supabase login check skipped, fallback to mock:', sbErr);
      }
    }

    // 2. Fallback ke akun mock instan jika belum ada di Supabase
    return safeFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    }, () => {
      // Cari akun mock yang cocok berdasarkan email atau nomor telepon
      const user = MOCK_USERS.find(
        u => u.email.toLowerCase() === cleanId || u.phone === cleanId
      );

      if (user) {
        return {
          success: true,
          message: 'Login berhasil!',
          data: {
            user,
            token: 'mock-session-jwt-' + user.id
          }
        };
      }

      // Default jika mengetik 'admin'
      if (cleanId.includes('admin')) {
        return {
          success: true,
          message: 'Login berhasil sebagai Super Admin',
          data: { user: MOCK_USERS[0], token: 'mock-session-admin' }
        };
      }

      // Default jika mengetik 'driver'
      if (cleanId.includes('driver')) {
        return {
          success: true,
          message: 'Login berhasil sebagai Driver',
          data: { user: MOCK_USERS[1], token: 'mock-session-driver' }
        };
      }

      // Default jika mengetik 'resto'
      if (cleanId.includes('resto')) {
        return {
          success: true,
          message: 'Login berhasil sebagai Toko Resto',
          data: { user: MOCK_USERS[2], token: 'mock-session-resto' }
        };
      }

      // Default jika mengetik 'mart'
      if (cleanId.includes('mart')) {
        return {
          success: true,
          message: 'Login berhasil sebagai Toko Mart',
          data: { user: MOCK_USERS[3], token: 'mock-session-mart' }
        };
      }

      // Default jika mengetik 'hub'
      if (cleanId.includes('hub')) {
        return {
          success: true,
          message: 'Login berhasil sebagai Staf Hub',
          data: { user: MOCK_USERS[4], token: 'mock-session-hub' }
        };
      }

      // Default untuk pelanggan lainnya
      const role: UserRole = 'CUSTOMER';
      return {
        success: true,
        message: 'Login berhasil!',
        data: {
          user: {
            id: 'usr-cust-' + Date.now(),
            email: cleanId.includes('@') ? cleanId : `${cleanId}@customer.azgo.com`,
            phone: cleanId.includes('@') ? '081299887766' : cleanId,
            fullName: cleanId.includes('@') ? cleanId.split('@')[0] : 'Pelanggan AzGo',
            role,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          token: 'mock-session-token'
        }
      };
    });
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
          return {
            success: true,
            message: 'Pendaftaran akun berhasil!',
            data: {
              user: {
                id: newUser.id,
                fullName: newUser.full_name,
                phone: newUser.phone,
                email: newUser.email,
                role: 'CUSTOMER',
                isActive: newUser.is_active !== false,
                createdAt: newUser.created_at,
                updatedAt: newUser.updated_at
              },
              token: 'sb-reg-token-' + newUser.id
            }
          };
        }
      } catch (err) {}
    }

    return safeFetch('/auth/register-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const role: UserRole = 'CUSTOMER';
      return {
        success: true,
        message: 'Pendaftaran akun berhasil!',
        data: {
          user: {
            id: 'usr-cust-' + Date.now(),
            fullName: data.fullName,
            phone: data.phone,
            email: data.email,
            role,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          token: 'mock-reg-token'
        }
      };
    });
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

    return safeFetch('/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, currentPassword, newPassword })
    }, () => ({
      success: true,
      message: 'Password berhasil diubah!'
    }));
  },

  async getAdminUsers(): Promise<any> {
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

    return safeFetch('/auth/users', undefined, () => ({
      success: true,
      data: MOCK_USERS
    }));
  },

  async createAdminUser(data: { email: string; phone: string; fullName: string; role: string; password?: string }): Promise<any> {
    const sb = getSupabase();
    if (sb) {
      try {
        const role = (data.role || 'CUSTOMER') as UserRole;
        const { data: newUser, error } = await sb.from('users').insert({
          email: data.email,
          phone: data.phone,
          full_name: data.fullName,
          role,
          password: data.password || 'admin123',
          is_active: true
        }).select().single();

        if (newUser && !error) {
          return {
            success: true,
            message: 'User berhasil dibuat',
            data: {
              id: newUser.id,
              email: newUser.email,
              phone: newUser.phone,
              fullName: newUser.full_name,
              role: newUser.role as UserRole,
              isActive: newUser.is_active !== false,
              createdAt: newUser.created_at,
              updatedAt: newUser.updated_at
            }
          };
        }
      } catch (err) {}
    }

    return safeFetch('/auth/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const role = (data.role || 'CUSTOMER') as UserRole;
      return {
        success: true,
        message: 'User berhasil dibuat',
        data: {
          id: 'usr-' + Date.now(),
          ...data,
          role,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    });
  },

  async adminResetPassword(targetUserId: string, newPassword: string): Promise<any> {
    const sb = getSupabase();
    if (sb) {
      try {
        await sb.from('users').update({ password: newPassword, updated_at: new Date().toISOString() }).eq('id', targetUserId);
        return { success: true, message: `Password berhasil direset menjadi: ${newPassword}` };
      } catch (err) {}
    }

    return safeFetch('/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId, newPassword })
    }, () => ({
      success: true,
      message: 'Password berhasil direset'
    }));
  },

  async toggleAdminDriver(driverId: string): Promise<any> {
    return safeFetch(`/admin/drivers/${driverId}/toggle`, { method: 'PATCH' }, () => ({
      success: true,
      message: 'Status driver diperbarui'
    }));
  },

  async toggleAdminMerchant(merchantId: string): Promise<any> {
    return safeFetch(`/admin/merchants/${merchantId}/toggle`, { method: 'PATCH' }, () => ({
      success: true,
      message: 'Status merchant diperbarui'
    }));
  },

  async toggleAdminHub(hubId: string): Promise<any> {
    return safeFetch(`/admin/hubs/${hubId}/toggle`, { method: 'PATCH' }, () => ({
      success: true,
      message: 'Status hub diperbarui'
    }));
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

    return safeFetch(`/auth/users/${userId}/toggle`, { method: 'PATCH' }, () => {
      const mock = MOCK_USERS.find(u => u.id === userId);
      const newStatus = mock ? !mock.isActive : false;
      return {
        success: true,
        message: 'Status user diperbarui',
        data: {
          id: userId,
          fullName: mock?.fullName || 'User',
          isActive: newStatus
        }
      };
    });
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
    }, () => ({
      success: true,
      message: 'Pendaftaran mitra berhasil dikirim! Tim AzGo akan meninjau berkas Anda dalam 1x24 jam.',
      data: { ...data, id: 'pa-' + Date.now(), status: 'PENDING_REVIEW', createdAt: new Date().toISOString() }
    }));
  },

  async getPartnerApplications(status?: string, type?: string): Promise<any> {
    return safeFetch('/partner/applications', undefined, () => {
      let apps = MOCK_PARTNER_APPLICATIONS;
      if (status && status !== 'ALL') apps = apps.filter(a => a.status === status);
      if (type && type !== 'ALL') apps = apps.filter(a => a.type === type);
      return { success: true, data: apps };
    });
  },

  async reviewPartnerApplication(id: string, action: 'APPROVE' | 'REJECT', reason?: string): Promise<any> {
    return safeFetch(`/partner/applications/${id}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason })
    }, () => ({
      success: true,
      message: `Pendaftaran berhasil di-${action.toLowerCase()}`,
      data: { id, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' }
    }));
  },

  // 11. KEUANGAN, BAGI HASIL, DAN PENARIKAN DANA
  async getFinanceSummary(): Promise<any> {
    return safeFetch('/finance/admin/summary', undefined, () => ({
      success: true,
      data: MOCK_FINANCE_SUMMARY
    }));
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
    return safeFetch(`/finance/wallet/${partnerId}?type=${type}`, undefined, () => ({
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
    }));
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
    }, () => ({
      success: true,
      message: 'Permintaan penarikan dana berhasil dikirim!',
      data: { ...data, id: 'wdr-' + Date.now(), status: 'PENDING', createdAt: new Date().toISOString() }
    }));
  },

  async getWithdrawalRequests(status?: string): Promise<any> {
    return safeFetch('/finance/admin/withdrawals', undefined, () => {
      let wd = MOCK_WITHDRAWALS;
      if (status && status !== 'ALL') wd = wd.filter(w => w.status === status);
      return { success: true, data: wd };
    });
  },

  async reviewWithdrawal(id: string, action: 'APPROVE' | 'REJECT', reason?: string): Promise<any> {
    return safeFetch(`/finance/admin/withdrawals/${id}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason })
    }, () => ({
      success: true,
      message: `Penarikan dana berhasil di-${action === 'APPROVE' ? 'setujui' : 'tolak'}`,
      data: { id, status: action }
    }));
  }
};
