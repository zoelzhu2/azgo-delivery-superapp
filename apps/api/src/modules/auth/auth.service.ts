import { User, UserRole } from '@delivery/shared';

export interface AuthSession {
  user: User;
  token: string;
}

export class AuthService {
  // Database Akun Terpusat (Default seed akun untuk pengujian instan)
  private users: (User & { passwordHash: string })[] = [
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
          vehicleModel: 'Honda Beat Hitam',
          vehiclePlate: 'L 3892 AZ'
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
          vehicleModel: 'Yamaha Mio Soul',
          vehiclePlate: 'L 5567 RT'
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
      fullName: 'Siti Rahma (Pelanggan)',
      role: 'CUSTOMER',
      isActive: true,
      passwordHash: 'user123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  /**
   * Pendaftaran akun mandiri untuk Pelanggan (Customer Self-Registration)
   */
  registerCustomer(data: {
    fullName: string;
    phone: string;
    email: string;
    password?: string;
  }): AuthSession {
    const existing = this.users.find(
      u => (data.email && u.email.toLowerCase() === data.email.toLowerCase()) || 
           (data.phone && u.phone === data.phone)
    );

    if (existing) {
      throw new Error('Email atau Nomor Telepon sudah terdaftar sebagai pengguna AZ GO.');
    }

    const newUser = {
      id: `usr-cust-${Date.now()}`,
      email: data.email || `${data.phone}@pelanggan.azgo.com`,
      phone: data.phone,
      fullName: data.fullName,
      role: 'CUSTOMER' as UserRole,
      isActive: true,
      passwordHash: data.password || 'user123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.users.push(newUser);

    const { passwordHash, ...safeUser } = newUser;
    const token = `token-${newUser.id}-${Date.now()}`;

    return {
      user: safeUser,
      token
    };
  }

  /**
   * Login pengguna berdasarkan email atau nomor telepon
   */
  login(identifier: string, password: string): AuthSession {
    const user = this.users.find(
      u => (u.email.toLowerCase() === identifier.toLowerCase() || u.phone === identifier) &&
           u.passwordHash === password
    );

    if (!user) {
      throw new Error('Email/No. HP atau password salah');
    }

    if (user.isActive === false) {
      throw new Error('Akun Anda telah dinonaktifkan oleh administrator. Silakan hubungi admin.');
    }

    const { passwordHash, ...safeUser } = user;
    const token = `token-${user.id}-${Date.now()}`;

    return {
      user: safeUser,
      token
    };
  }

  /**
   * Driver, Toko, dan Hub dapat mengganti password masing-masing
   */
  changeOwnPassword(userId: string, currentPassword: string, newPassword: string): boolean {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('Pengguna tidak ditemukan');
    }

    if (user.passwordHash !== currentPassword) {
      throw new Error('Password lama tidak sesuai');
    }

    if (!newPassword || newPassword.length < 5) {
      throw new Error('Password baru minimal 5 karakter');
    }

    user.passwordHash = newPassword;
    user.updatedAt = new Date().toISOString();
    return true;
  }

  // ================= ADMIN PRIVILEGES ================= //

  /**
   * HANYA ADMIN: Mengambil semua akun pengguna
   */
  getAllUsers(): User[] {
    return this.users.map(({ passwordHash, ...u }) => u);
  }

  /**
   * HANYA ADMIN: Menambahkan pengguna baru
   */
  createUser(data: {
    email: string;
    phone: string;
    fullName: string;
    role: UserRole;
    password: string;
    storeType?: 'FOOD' | 'MART';
    hasSelfCourier?: boolean;
    selfCouriers?: any[];
    bankName?: string;
    accountNumber?: string;
    accountHolder?: string;
  }): User {
    const existing = this.users.find(
      u => u.email.toLowerCase() === data.email.toLowerCase() || u.phone === data.phone
    );

    if (existing) {
      throw new Error('Email atau Nomor Telepon sudah terdaftar');
    }

    const newUser = {
      id: `usr-${data.role.toLowerCase()}-${Date.now()}`,
      email: data.email,
      phone: data.phone,
      fullName: data.fullName,
      role: data.role,
      storeType: data.storeType,
      isActive: true,
      hasSelfCourier: data.hasSelfCourier,
      selfCouriers: data.selfCouriers || [],
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountHolder: data.accountHolder,
      passwordHash: data.password || 'azgo123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.users.unshift(newUser);
    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  }

  /**
   * HANYA ADMIN: Mereset password pengguna lain
   */
  adminResetPassword(targetUserId: string, newPassword: string): boolean {
    const user = this.users.find(u => u.id === targetUserId);
    if (!user) {
      throw new Error('Pengguna target tidak ditemukan');
    }

    user.passwordHash = newPassword || 'azgo123';
    user.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * HANYA ADMIN: Menonaktifkan atau mengaktifkan status pengguna
   */
  toggleUserStatus(targetUserId: string): User {
    const user = this.users.find(u => u.id === targetUserId);
    if (!user) {
      throw new Error('Pengguna tidak ditemukan');
    }
    if (user.role === 'ADMIN') {
      throw new Error('Super Administrator tidak dapat dinonaktifkan');
    }

    user.isActive = user.isActive === false ? true : false;
    user.updatedAt = new Date().toISOString();
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}

export const authService = new AuthService();
