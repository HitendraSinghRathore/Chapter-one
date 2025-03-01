import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/User';

export default class ProfileController {

  static async getProfile(req: Request, res: Response): Promise<Response> {
    if (req.user && req.user.email && req.user.email !== '') {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        roles: [user.role],
      });
    }
    return res.status(200).json({
      id: req.user ? req.user.id : '',
      name: 'Guest',
      email: '',
      mobile: '',
      roles: ['guest'],
    });
  }

  static async updateProfile(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user || !req.user.email || req.user.role === 'regular') {
      return res.status(403).json({ message: 'Not authorized to update guest profile' });
    }
    
    const { name, email, mobile } = req.body;
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      await user.update({ name, email, mobile });
      return res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          roles: [user.role],
        },
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}
