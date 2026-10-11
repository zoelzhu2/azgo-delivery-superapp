const BASE_URL = '/api';

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
  }) {
    const res = await fetch(`${BASE_URL}/expedition/check-rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // 2. Az Cargo (Barang Besar / Armada Truk & Pickup)
  async checkCargoRate(data: {
    vehicleType: string;
    distanceKm: number;
    helperCount: number;
  }) {
    const res = await fetch(`${BASE_URL}/expedition/cargo-fare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // 3. Kirim Paket & Terbitkan Resi (Az Courier / Az Express / Az Cargo)
  async createExpeditionShipment(data: any) {
    const res = await fetch(`${BASE_URL}/expedition/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // 4. Az Pickup (Jemput Barang ke Rumah)
  async requestPickup(data: {
    senderName: string;
    senderPhone: string;
    pickupAddress: string;
    scheduledTime?: string;
    estimatedPackages: number;
    notes?: string;
  }) {
    const res = await fetch(`${BASE_URL}/expedition/pickup-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // 5. Universal Tracking (Semua Resi AZ GO)
  async trackAWB(awb: string) {
    const res = await fetch(`${BASE_URL}/expedition/track/${awb}`);
    return res.json();
  },

  async addScanCheckpoint(data: { trackingNumber: string; city: string; checkpointTitle: string; description: string }) {
    const res = await fetch(`${BASE_URL}/expedition/checkpoints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getHubs() {
    const res = await fetch(`${BASE_URL}/expedition/hubs`);
    return res.json();
  },

  // 6. Az Delivery (Resto Makanan & Minuman)
  async getRestaurants() {
    const res = await fetch(`${BASE_URL}/food/restaurants`);
    return res.json();
  },

  // 7. Az Mart (Belanja Sembako, Minimarket, Sayur)
  async getMartStores() {
    const res = await fetch(`${BASE_URL}/food/marts`);
    return res.json();
  },

  async calculateOrder(items: { productId: string; quantity: number }[], isMart: boolean = false) {
    const res = await fetch(`${BASE_URL}/food/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, isMart })
    });
    return res.json();
  },

  // Ride Hailing
  async estimateRide(data: { distanceKm: number; vehicleType: 'MOTORBIKE' | 'CAR' }) {
    const res = await fetch(`${BASE_URL}/ride/estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async orderRide(data: any) {
    const res = await fetch(`${BASE_URL}/ride/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // 8. ADMIN BACKOFFICE APIS
  async getAdminMetrics() {
    const res = await fetch(`${BASE_URL}/admin/overview`);
    return res.json();
  },

  async getAdminOrders(serviceType?: string) {
    const url = serviceType && serviceType !== 'ALL'
      ? `${BASE_URL}/admin/orders?serviceType=${serviceType}`
      : `${BASE_URL}/admin/orders`;
    const res = await fetch(url);
    return res.json();
  },

  async getAdminPricing() {
    const res = await fetch(`${BASE_URL}/admin/pricing`);
    return res.json();
  },

  async updateAdminPricing(configs: any) {
    const res = await fetch(`${BASE_URL}/admin/pricing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configs)
    });
    return res.json();
  },

  async getAdminDrivers() {
    const res = await fetch(`${BASE_URL}/admin/drivers`);
    return res.json();
  },

  async verifyDriver(driverId: string) {
    const res = await fetch(`${BASE_URL}/admin/drivers/${driverId}/verify`, {
      method: 'PATCH'
    });
    return res.json();
  },

  async createAdminDriver(data: any) {
    const res = await fetch(`${BASE_URL}/admin/drivers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getAdminMerchants() {
    const res = await fetch(`${BASE_URL}/admin/merchants`);
    return res.json();
  },

  async createAdminMerchant(data: any) {
    const res = await fetch(`${BASE_URL}/admin/merchants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getAdminHubs() {
    const res = await fetch(`${BASE_URL}/admin/hubs`);
    return res.json();
  },

  async createAdminHub(data: any) {
    const res = await fetch(`${BASE_URL}/admin/hubs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // 9. AUTH & USER MANAGEMENT APIS
  async login(identifier: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    return res.json();
  },

  async registerCustomer(data: { fullName: string; phone: string; email: string; password?: string }) {
    const res = await fetch(`${BASE_URL}/auth/register-customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async changeOwnPassword(userId: string, currentPassword: string, newPassword: string) {
    const res = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, currentPassword, newPassword })
    });
    return res.json();
  },

  async getAdminUsers() {
    const res = await fetch(`${BASE_URL}/auth/users`);
    return res.json();
  },

  async createAdminUser(data: { email: string; phone: string; fullName: string; role: string; password?: string }) {
    const res = await fetch(`${BASE_URL}/auth/create-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async adminResetPassword(targetUserId: string, newPassword: string) {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId, newPassword })
    });
    return res.json();
  },

  async toggleAdminDriver(driverId: string) {
    const res = await fetch(`${BASE_URL}/admin/drivers/${driverId}/toggle`, {
      method: 'PATCH'
    });
    return res.json();
  },

  async toggleAdminMerchant(merchantId: string) {
    const res = await fetch(`${BASE_URL}/admin/merchants/${merchantId}/toggle`, {
      method: 'PATCH'
    });
    return res.json();
  },

  async toggleAdminHub(hubId: string) {
    const res = await fetch(`${BASE_URL}/admin/hubs/${hubId}/toggle`, {
      method: 'PATCH'
    });
    return res.json();
  },

  async toggleAdminUser(userId: string) {
    const res = await fetch(`${BASE_URL}/auth/users/${userId}/toggle`, {
      method: 'PATCH'
    });
    return res.json();
  },

  async getAdminServices() {
    const res = await fetch(`${BASE_URL}/admin/services`);
    return res.json();
  },

  async toggleAdminService(serviceId: string) {
    const res = await fetch(`${BASE_URL}/admin/services/${serviceId}/toggle`, {
      method: 'PATCH'
    });
    return res.json();
  },

  // 10. PENDAFTARAN MITRA (DRIVER & TOKO/RESTO/MART)
  async submitPartnerApplication(data: any) {
    const res = await fetch(`${BASE_URL}/partner/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getPartnerApplications(status?: string, type?: string) {
    let url = `${BASE_URL}/partner/applications`;
    const params = new URLSearchParams();
    if (status && status !== 'ALL') params.append('status', status);
    if (type && type !== 'ALL') params.append('type', type);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    return res.json();
  },

  async reviewPartnerApplication(id: string, action: 'APPROVE' | 'REJECT', reason?: string) {
    const res = await fetch(`${BASE_URL}/partner/applications/${id}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason })
    });
    return res.json();
  },

  // 11. KEUANGAN, BAGI HASIL, DAN PENARIKAN DANA
  async getFinanceSummary() {
    const res = await fetch(`${BASE_URL}/finance/admin/summary`);
    return res.json();
  },

  async getCommissionConfig() {
    const res = await fetch(`${BASE_URL}/finance/admin/commission`);
    return res.json();
  },

  async updateCommissionConfig(data: any) {
    const res = await fetch(`${BASE_URL}/finance/admin/commission`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getPartnerWallet(partnerId: string, type: 'DRIVER' | 'MERCHANT' = 'DRIVER') {
    const res = await fetch(`${BASE_URL}/finance/wallet/${partnerId}?type=${type}`);
    return res.json();
  },

  async requestWithdrawal(data: {
    partnerId: string;
    partnerName: string;
    partnerType: 'DRIVER' | 'MERCHANT';
    amount: number;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }) {
    const res = await fetch(`${BASE_URL}/finance/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getWithdrawalRequests(status?: string) {
    const url = status && status !== 'ALL'
      ? `${BASE_URL}/finance/admin/withdrawals?status=${status}`
      : `${BASE_URL}/finance/admin/withdrawals`;
    const res = await fetch(url);
    return res.json();
  },

  async reviewWithdrawal(id: string, action: 'APPROVE' | 'REJECT', reason?: string) {
    const res = await fetch(`${BASE_URL}/finance/admin/withdrawals/${id}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason })
    });
    return res.json();
  }
};
