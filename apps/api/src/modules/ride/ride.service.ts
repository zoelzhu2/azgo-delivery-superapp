import { InstantFareCalculationRequest, InstantFareResult, Order } from '@delivery/shared';

export class RideService {
  calculateFare(req: InstantFareCalculationRequest): InstantFareResult {
    const { vehicleType, distanceKm } = req;
    
    // Tarif dasar motor vs mobil
    const isCar = vehicleType === 'CAR';
    const baseFare = isCar ? 18000 : 10000; // Dasar 0-3 KM
    const pricePerKm = isCar ? 4500 : 2500;
    const baseDistanceKm = 3;

    let distanceFare = 0;
    if (distanceKm > baseDistanceKm) {
      distanceFare = Math.round((distanceKm - baseDistanceKm) * pricePerKm);
    }

    const appFee = 2000;
    const totalFare = baseFare + distanceFare + appFee;

    return {
      baseFare,
      distanceFare,
      appFee,
      totalFare
    };
  }

  createRideOrder(data: {
    customerId: string;
    pickupAddress: string;
    dropoffAddress: string;
    distanceKm: number;
    vehicleType: 'MOTORBIKE' | 'CAR';
  }): Order {
    const fare = this.calculateFare({
      serviceType: 'RIDE',
      vehicleType: data.vehicleType,
      distanceKm: data.distanceKm
    });

    const order: Order = {
      id: `ride-${Date.now()}`,
      orderNumber: `RIDE-${Math.floor(100000 + Math.random() * 900000)}`,
      customerId: data.customerId || 'cust-demo',
      serviceType: 'RIDE',
      deliveryMode: 'POINT_TO_POINT',
      status: 'SEARCHING_DRIVER',
      pickup: { address: data.pickupAddress },
      dropoff: { address: data.dropoffAddress },
      distanceKm: data.distanceKm,
      subtotalAmount: 0,
      deliveryFee: fare.baseFare + fare.distanceFare,
      appFee: fare.appFee,
      totalAmount: fare.totalFare,
      paymentMethod: 'CASH',
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return order;
  }
}

export const rideService = new RideService();
