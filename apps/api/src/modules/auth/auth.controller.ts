import { Request, Response } from 'express';
import { authService } from './auth.service';

export class AuthController {
  login(req: Request, res: Response) {
    try {
      const { identifier, password } = req.body;
      if (!identifier || !password) {
        return res.status(400).json({ success: false, message: 'Email/No. HP dan password wajib diisi' });
      }

      const session = authService.login(identifier, password);
      return res.json({
        success: true,
        data: session,
        message: `Selamat datang, ${session.user.fullName}`
      });
    } catch (err: any) {
      return res.status(401).json({ success: false, message: err.message });
    }
  }

  registerCustomer(req: Request, res: Response) {
    try {
      const { fullName, phone, email, password } = req.body;
      if (!fullName || !phone) {
        return res.status(400).json({ success: false, message: 'Nama lengkap dan nomor handphone wajib diisi' });
      }

      const session = authService.registerCustomer({ fullName, phone, email, password });
      return res.json({
        success: true,
        data: session,
        message: `Pendaftaran berhasil! Selamat datang, ${session.user.fullName}`
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  changeOwnPassword(req: Request, res: Response) {
    try {
      const { userId, currentPassword, newPassword } = req.body;
      if (!userId || !currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'User ID, password saat ini, dan password baru wajib diisi'
        });
      }

      authService.changeOwnPassword(userId, currentPassword, newPassword);
      return res.json({
        success: true,
        message: 'Password akun Anda berhasil diperbarui'
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // ================= ADMIN PRIVILEGES ================= //

  getUsers(req: Request, res: Response) {
    try {
      const users = authService.getAllUsers();
      return res.json({ success: true, data: users });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  createUser(req: Request, res: Response) {
    try {
      const { email, phone, fullName, role, password } = req.body;
      if (!email || !phone || !fullName || !role) {
        return res.status(400).json({
          success: false,
          message: 'Email, telepon, nama lengkap, dan role wajib diisi'
        });
      }

      const newUser = authService.createUser({
        email,
        phone,
        fullName,
        role,
        password: password || 'azgo123'
      });

      return res.status(201).json({
        success: true,
        data: newUser,
        message: `User ${newUser.fullName} (${newUser.role}) berhasil ditambahkan oleh Admin`
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  adminResetPassword(req: Request, res: Response) {
    try {
      const { targetUserId, newPassword } = req.body;
      if (!targetUserId || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Target user ID dan password baru wajib diisi'
        });
      }

      authService.adminResetPassword(targetUserId, newPassword);
      return res.json({
        success: true,
        message: 'Password user berhasil direset oleh Admin'
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  toggleUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const updated = authService.toggleUserStatus(userId);
      const actionText = updated.isActive ? 'diaktifkan kembali' : 'dinonaktifkan (akses login diblokir)';
      return res.json({
        success: true,
        data: updated,
        message: `Akun user ${updated.fullName} berhasil ${actionText}`
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
}

export const authController = new AuthController();
