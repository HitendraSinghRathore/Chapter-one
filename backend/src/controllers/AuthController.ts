import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import config from '../config';
import { User } from '../models/User';
import { AuthConfig } from '../types/interface.types';
import { Op } from 'sequelize';

export default class AuthController {

  static async signup(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, mobile, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await User.create({
        name: firstName + ' ' + lastName,
        mobile,
        email,
        passwordHash: hashedPassword,
        role: 'regular',
      });

      return res.status(201).json({
        message: 'User created successfully'
      });
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }


  static async login(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { loginValue, password } = req.body;
    try {
        const user = await User.findOne({
            where: {
              [Op.or]: [
                { email: loginValue },
                { mobile: loginValue }
              ]
            }
          });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        roles: [user.role], 
      };

      const token = jwt.sign(
        payload,
        config.get<AuthConfig>('auth').jwtSecret,
        { expiresIn: '1h' }
      );

      res.setHeader('Authorization', `Bearer ${token}`);
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: payload,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }


  static async logout(req: Request, res: Response): Promise<Response> {
    return res.status(200).json({ message: 'Logout successful' });
  }
}
