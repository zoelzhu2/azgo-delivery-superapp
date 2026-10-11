export type ServiceType =
  | 'AZ_DELIVERY'  // 🛵 Makanan, minuman, barang instan
  | 'AZ_COURIER'   // 📦 Kirim paket/dokumen standar
  | 'AZ_EXPRESS'   // 🚚 Pengiriman kilat prioritas
  | 'AZ_CARGO'     // 🚛 Barang besar & muatan armada
  | 'AZ_MART'      // 🛒 Belanja kebutuhan harian
  | 'AZ_PICKUP'    // 📍 Jemput barang ke lokasi
  | 'RIDE';

export type DeliveryMode = 'POINT_TO_POINT' | 'HUB_AND_SPOKE';

export type OrderStatus =
  | 'DRAFT'
  | 'SEARCHING_DRIVER'
  | 'ACCEPTED'
  | 'PREPARING_ORDER'
  | 'READY_FOR_PICKUP'
  | 'ARRIVED_PICKUP'
  | 'IN_TRANSIT'
  | 'COMPLETED'
  | 'CANCELLED';

export interface OrderLocation {
  address: string;
  lat?: number;
  lng?: number;
  city?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  driverId?: string;
  merchantId?: string;
  serviceType: ServiceType;
  deliveryMode: DeliveryMode;
  status: OrderStatus;
  pickup: OrderLocation;
  dropoff: OrderLocation;
  distanceKm: number;
  subtotalAmount: number;
  deliveryFee: number;
  appFee: number;
  totalAmount: number;
  trackingNumber?: string;
  paymentMethod: 'CASH' | 'WALLET' | 'QRIS';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
}
