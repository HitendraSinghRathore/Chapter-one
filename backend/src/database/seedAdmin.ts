import bcrypt from 'bcryptjs';
import config from '../config';
import { User } from '../models/User';
import { AdminConfig } from '../types/interface.types';

export async function seedAdmin(): Promise<void> {
  const { email, password, mobile } = config.get<AdminConfig>('admin');

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [adminUser, created] = await User.findOrCreate({
      where: { email, role: 'admin' },
      defaults: {
        email,
        mobile,
        passwordHash: hashedPassword,
        role: 'admin',
      },
    });

    if (created) {
      console.log(`Admin user created with email: ${adminUser.email}`);
    } else {
      console.log(`Admin user already exists with email: ${adminUser.email}`);
      
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}