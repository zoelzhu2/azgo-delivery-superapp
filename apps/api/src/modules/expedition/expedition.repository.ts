import { Hub, ExpeditionRate, ExpeditionDeliveryDetail, TrackingCheckpoint } from '@delivery/shared';

export class ExpeditionRepository {
  private hubs: Hub[] = [
    { id: 'hub-sby-main', hubCode: 'HUB-SBY-MAIN', name: 'Surabaya Gateway Sorting Center', hubType: 'SORTING_CENTER', city: 'Surabaya', address: 'Jl. Rungkut Industri No. 5, Surabaya', isActive: true },
    { id: 'hub-sby-01', hubCode: 'HUB-SBY-01', name: 'Surabaya Drop Point Gubeng', hubType: 'DROP_POINT', city: 'Surabaya', address: 'Jl. Raya Gubeng No. 42, Surabaya', isActive: true },
    { id: 'hub-mlg-01', hubCode: 'HUB-MLG-01', name: 'Malang Central Drop Point Klojen', hubType: 'DROP_POINT', city: 'Malang', address: 'Jl. Ijen No. 12, Klojen, Malang', isActive: true },
    { id: 'hub-sda-01', hubCode: 'HUB-SDA-01', name: 'Sidoarjo Sorting Hub Waru', hubType: 'SORTING_CENTER', city: 'Sidoarjo', address: 'Jl. Raya Juanda No. 88, Sedati, Sidoarjo', isActive: true },
    { id: 'hub-kdr-01', hubCode: 'HUB-KDR-01', name: 'Kediri Drop Point Kota', hubType: 'DROP_POINT', city: 'Kediri', address: 'Jl. Dhoho No. 65, Kota Kediri', isActive: true },
    { id: 'hub-jmr-01', hubCode: 'HUB-JMR-01', name: 'Jember Drop Point Kaliwates', hubType: 'DROP_POINT', city: 'Jember', address: 'Jl. Gajah Mada No. 102, Kaliwates, Jember', isActive: true },
    { id: 'hub-1', hubCode: 'HUB-JKT-01', name: 'Jakarta Central Drop Point', hubType: 'DROP_POINT', city: 'Jakarta', address: 'Jl. Sudirman No. 10', isActive: true },
    { id: 'hub-2', hubCode: 'HUB-JKT-MAIN', name: 'Jakarta Gateway Sorting Center', hubType: 'SORTING_CENTER', city: 'Jakarta', address: 'Jl. Daan Mogot KM 12', isActive: true },
    { id: 'hub-3', hubCode: 'HUB-BDG-01', name: 'Bandung Central Drop Point', hubType: 'DROP_POINT', city: 'Bandung', address: 'Jl. Asia Afrika No. 25', isActive: true }
  ];

  private rates: ExpeditionRate[] = [
    { id: 'rate-sby-mlg', originCity: 'Surabaya', destinationCity: 'Malang', serviceCode: 'REGULAR', ratePerKg: 8000, minWeightKg: 1, etdDaysMin: 1, etdDaysMax: 2, isActive: true },
    { id: 'rate-mlg-sby', originCity: 'Malang', destinationCity: 'Surabaya', serviceCode: 'REGULAR', ratePerKg: 8000, minWeightKg: 1, etdDaysMin: 1, etdDaysMax: 2, isActive: true },
    { id: 'rate-sby-sda', originCity: 'Surabaya', destinationCity: 'Sidoarjo', serviceCode: 'REGULAR', ratePerKg: 7000, minWeightKg: 1, etdDaysMin: 1, etdDaysMax: 1, isActive: true },
    { id: 'rate-sda-sby', originCity: 'Sidoarjo', destinationCity: 'Surabaya', serviceCode: 'REGULAR', ratePerKg: 7000, minWeightKg: 1, etdDaysMin: 1, etdDaysMax: 1, isActive: true },
    { id: 'rate-sby-kdr', originCity: 'Surabaya', destinationCity: 'Kediri', serviceCode: 'REGULAR', ratePerKg: 9000, minWeightKg: 1, etdDaysMin: 1, etdDaysMax: 2, isActive: true },
    { id: 'rate-kdr-sby', originCity: 'Kediri', destinationCity: 'Surabaya', serviceCode: 'REGULAR', ratePerKg: 9000, minWeightKg: 1, etdDaysMin: 1, etdDaysMax: 2, isActive: true },
    { id: 'rate-sby-jmr', originCity: 'Surabaya', destinationCity: 'Jember', serviceCode: 'REGULAR', ratePerKg: 11000, minWeightKg: 1, etdDaysMin: 1, etdDaysMax: 2, isActive: true },
    { id: 'rate-jmr-sby', originCity: 'Jember', destinationCity: 'Surabaya', serviceCode: 'REGULAR', ratePerKg: 11000, minWeightKg: 1, etdDaysMin: 1, etdDaysMax: 2, isActive: true },
    { id: 'rate-sby-sby', originCity: 'Surabaya', destinationCity: 'Surabaya', serviceCode: 'REGULAR', ratePerKg: 6000, minWeightKg: 1, etdDaysMin: 1, etdDaysMax: 1, isActive: true },
    { id: 'rate-mlg-mlg', originCity: 'Malang', destinationCity: 'Malang', serviceCode: 'REGULAR', ratePerKg: 6000, minWeightKg: 1, etdDaysMin: 1, etdDaysMax: 1, isActive: true },
    { id: 'rate-sda-sda', originCity: 'Sidoarjo', destinationCity: 'Sidoarjo', serviceCode: 'REGULAR', ratePerKg: 6000, minWeightKg: 1, etdDaysMin: 1, etdDaysMax: 1, isActive: true },
    { id: 'rate-sby-jkt', originCity: 'Surabaya', destinationCity: 'Jakarta', serviceCode: 'REGULAR', ratePerKg: 19000, minWeightKg: 1, etdDaysMin: 2, etdDaysMax: 3, isActive: true },
    { id: 'rate-1', originCity: 'Jakarta', destinationCity: 'Bandung', serviceCode: 'REGULAR', ratePerKg: 11000, minWeightKg: 1, etdDaysMin: 1, etdDaysMax: 2, isActive: true },
    { id: 'rate-2', originCity: 'Jakarta', destinationCity: 'Surabaya', serviceCode: 'REGULAR', ratePerKg: 19000, minWeightKg: 1, etdDaysMin: 2, etdDaysMax: 3, isActive: true },
    { id: 'rate-3', originCity: 'Bandung', destinationCity: 'Jakarta', serviceCode: 'REGULAR', ratePerKg: 11000, minWeightKg: 1, etdDaysMin: 1, etdDaysMax: 2, isActive: true },
    { id: 'rate-4', originCity: 'Jakarta', destinationCity: 'Jakarta', serviceCode: 'REGULAR', ratePerKg: 9000, minWeightKg: 1, etdDaysMin: 1, etdDaysMax: 1, isActive: true }
  ];

  private deliveries: Map<string, ExpeditionDeliveryDetail> = new Map();
  private checkpoints: Map<string, TrackingCheckpoint[]> = new Map();

  async getHubs(): Promise<Hub[]> {
    return this.hubs;
  }

  async addHub(hub: Hub): Promise<Hub> {
    this.hubs.push(hub);
    return hub;
  }

  async toggleHub(id: string): Promise<Hub> {
    const hub = this.hubs.find(h => h.id === id);
    if (!hub) throw new Error('Cabang Hub tidak ditemukan');
    hub.isActive = !hub.isActive;
    return hub;
  }

  async findRate(originCity: string, destinationCity: string): Promise<ExpeditionRate | null> {
    const rate = this.rates.find(
      r => r.originCity.toLowerCase() === originCity.toLowerCase() &&
           r.destinationCity.toLowerCase() === destinationCity.toLowerCase() &&
           r.isActive
    );
    return rate || null;
  }

  async saveDelivery(delivery: ExpeditionDeliveryDetail): Promise<ExpeditionDeliveryDetail> {
    this.deliveries.set(delivery.trackingNumber, delivery);
    return delivery;
  }

  async findByTrackingNumber(trackingNumber: string): Promise<ExpeditionDeliveryDetail | null> {
    return this.deliveries.get(trackingNumber) || null;
  }

  async addCheckpoint(checkpoint: TrackingCheckpoint): Promise<TrackingCheckpoint> {
    const list = this.checkpoints.get(checkpoint.trackingNumber) || [];
    list.unshift(checkpoint);
    this.checkpoints.set(checkpoint.trackingNumber, list);
    return checkpoint;
  }

  async getCheckpoints(trackingNumber: string): Promise<TrackingCheckpoint[]> {
    return this.checkpoints.get(trackingNumber) || [];
  }
}

export const expeditionRepository = new ExpeditionRepository();
