export interface MerchantStore {
  id: string;
  name: string;
  category: string;
  type: 'FOOD' | 'MART';
  rating: number;
  bannerUrl: string;
  address: string;
  isOpen: boolean;
  isActive?: boolean;
  items: StoreProduct[];
}

export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
}

export class FoodAndMartService {
  // Resto Mitra untuk Az Delivery
  private restaurants: MerchantStore[] = [
    {
      id: 'resto-1',
      name: 'Ayam Geprek Sambal Bawang Juara',
      category: 'Kuliner Lokal, Pedas',
      type: 'FOOD',
      rating: 4.8,
      bannerUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500',
      address: 'Jl. Merdeka Barat No. 12',
      isOpen: true,
      items: [
        { id: 'm-1', name: 'Paket Ayam Geprek Level 3 + Nasi', price: 25000, description: 'Ayam krispi dengan sambal bawang pedas nampol', imageUrl: '', isAvailable: true },
        { id: 'm-2', name: 'Es Teh Manis Jumbo', price: 6000, description: 'Es teh segar manis', imageUrl: '', isAvailable: true }
      ]
    },
    {
      id: 'resto-2',
      name: 'Kopi Kenangan Senja',
      category: 'Cafe, Kopi & Roti',
      type: 'FOOD',
      rating: 4.9,
      bannerUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500',
      address: 'Jl. Riau No. 44',
      isOpen: true,
      items: [
        { id: 'm-3', name: 'Es Kopi Susu Gula Aren', price: 18000, description: 'Espresso dengan susu segar dan gula aren asli', imageUrl: '', isAvailable: true },
        { id: 'm-4', name: 'Croissant Cokelat Mentega', price: 22000, description: 'Pastry renyah isi cokelat leleh', imageUrl: '', isAvailable: true }
      ]
    }
  ];

  // Toko Sembako & Supermarket Mitra untuk Az Mart
  private martStores: MerchantStore[] = [
    {
      id: 'mart-1',
      name: 'Az Mart Express - Sudirman',
      category: 'Minimarket & Kebutuhan Rumah',
      type: 'MART',
      rating: 4.9,
      bannerUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500',
      address: 'Jl. Sudirman Kav 21',
      isOpen: true,
      items: [
        { id: 'p-1', name: 'Minyak Goreng Sania 2 Liter', price: 34000, description: 'Minyak kelapa sawit murni kualitas premium', imageUrl: '', isAvailable: true },
        { id: 'p-2', name: 'Beras Pandan Wangi 5 Kg', price: 72000, description: 'Beras pulen wangi kualitas super', imageUrl: '', isAvailable: true },
        { id: 'p-3', name: 'Telur Ayam Negeri (Isi 10 Butir)', price: 26000, description: 'Telur segar pilihan peternak', imageUrl: '', isAvailable: true },
        { id: 'p-4', name: 'Susu UHT Full Cream 1 Liter', price: 19500, description: 'Susu sapi segar siap minum', imageUrl: '', isAvailable: true }
      ]
    },
    {
      id: 'mart-2',
      name: 'Toko Buah & Sayur Segar Jaya',
      category: 'Sayuran & Buah Segar',
      type: 'MART',
      rating: 4.7,
      bannerUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500',
      address: 'Pasar Modern Blok B No. 8',
      isOpen: true,
      items: [
        { id: 'p-5', name: 'Apel Fuji Manis 1 Kg', price: 38000, description: 'Apel fuji renyah manis kaya vitamin', imageUrl: '', isAvailable: true },
        { id: 'p-6', name: 'Pakcoy Hidroponik Segar 500gr', price: 12000, description: 'Sayuran hijau bebas pestisida', imageUrl: '', isAvailable: true }
      ]
    }
  ];

  getRestaurants(): MerchantStore[] {
    return this.restaurants.filter(r => r.isActive !== false);
  }

  getMartStores(): MerchantStore[] {
    return this.martStores.filter(m => m.isActive !== false);
  }

  getAllMerchants(): MerchantStore[] {
    return [...this.restaurants, ...this.martStores];
  }

  addMerchant(store: MerchantStore): MerchantStore {
    store.isActive = true;
    if (store.type === 'FOOD') {
      this.restaurants.push(store);
    } else {
      this.martStores.push(store);
    }
    return store;
  }

  toggleMerchantStatus(id: string): MerchantStore {
    const store = this.getAllMerchants().find(s => s.id === id);
    if (!store) throw new Error('Toko/Resto tidak ditemukan');
    store.isActive = store.isActive === false ? true : false;
    return store;
  }

  calculateOrder(items: { productId: string; quantity: number }[], distanceKm: number = 3, isMart: boolean = false) {
    let subtotal = 0;
    const orderedItems = [];
    const pool = isMart ? this.martStores : this.restaurants;

    for (const orderItem of items) {
      let foundProduct: StoreProduct | null = null;
      for (const store of pool) {
        const prod = store.items.find(x => x.id === orderItem.productId);
        if (prod) {
          foundProduct = prod;
          break;
        }
      }
      if (foundProduct) {
        const itemSubtotal = foundProduct.price * orderItem.quantity;
        subtotal += itemSubtotal;
        orderedItems.push({
          product: foundProduct,
          quantity: orderItem.quantity,
          subtotal: itemSubtotal
        });
      }
    }

    const deliveryFee = 9000 + Math.max(0, distanceKm - 3) * 2500;
    const shoppingServiceFee = isMart ? 3000 : 0;
    const appFee = 2000;
    const totalAmount = subtotal + deliveryFee + shoppingServiceFee + appFee;

    return {
      orderedItems,
      subtotal,
      deliveryFee,
      shoppingServiceFee,
      appFee,
      totalAmount
    };
  }
}

export const foodAndMartService = new FoodAndMartService();
