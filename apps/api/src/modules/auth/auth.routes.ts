import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

// Public auth routes
router.post('/login', (req, res) => authController.login(req, res));
router.post('/register-customer', (req, res) => authController.registerCustomer(req, res));
router.post('/change-password', (req, res) => authController.changeOwnPassword(req, res));

// Admin-only user management routes
router.get('/users', (req, res) => authController.getUsers(req, res));
router.post('/create-user', (req, res) => authController.createUser(req, res));
router.post('/reset-password', (req, res) => authController.adminResetPassword(req, res));
router.patch('/users/:userId/toggle', (req, res) => authController.toggleUser(req, res));

export default router;
