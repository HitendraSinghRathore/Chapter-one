import { Sequelize } from 'sequelize';
import config from '../config';
import { initUserModel } from '../models/User';
import { seedAdmin } from './seedAdmin';

const { host, port, database, user, password } = config.postgres;

export const sequelize = new Sequelize(database, user, password, {
    host,
    port,
    dialect: 'postgres',
    logging: false, 
    dialectOptions: {
        ssl: true,
    }
  });

export function initModels(): void {
    initUserModel(sequelize);
   
}
export async function syncDatabase(force = false): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await sequelize.sync({ force });
    console.log('All models synchronized successfully.');

    // starting seeding admin
    await seedAdmin();
    console.log('Admin user seeded successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

export async function closeDatabase(): Promise<void> {
  try {
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}