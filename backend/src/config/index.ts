import convict, { Path } from 'convict';
import { AppConfig, MongoConfig, PostgresConfig } from '../types/interface.types';


class Config {
  private config: convict.Config<AppConfig>;

  constructor() {
    this.config = convict<AppConfig>({
      port: {
        doc: 'The port the application will listen on',
        format: 'port',
        default: 3000,
        env: 'PORT'
      },
      nodeEnv: {
        doc: 'The Node.js environment',
        format: ['development', 'production', 'test', 'staging'],
        default: 'development',
        env: 'NODE_ENV'
      },
      postgres: {
        host: {
          doc: 'Postgres host name/IP',
          format: String,
          default: 'localhost',
          env: 'POSTGRES_HOST'
        },
        port: {
          doc: 'Postgres port',
          format: 'port',
          default: 5432,
          env: 'POSTGRES_PORT'
        },
        database: {
          doc: 'Postgres database name',
          format: String,
          default: 'mydb',
          env: 'POSTGRES_DB'
        },
        user: {
          doc: 'Postgres user',
          format: String,
          default: 'postgres',
          env: 'POSTGRES_USER'
        },
        password: {
          doc: 'Postgres password',
          format: String,
          default: 'password',
          env: 'POSTGRES_PASSWORD',
          sensitive: true
        }
      },
      admin: {
        email: {
          doc: 'Admin email',
          format: String,
          default: 'admin@example.com',
          env: 'ADMIN_EMAIL'
        },
        password: {
          doc: 'Admin password',
          format: String,
          default: 'password',
          env: 'ADMIN_PASSWORD',
          sensitive: true
        },
        mobile: {
          doc: 'Admin mobile number',
          format: String,
          default: '+xxxxxxxxx',
          env: 'ADMIN_MOBILE'
        },
        name: {
          doc: 'Admin name',
          format: String,
          default: 'Admin',
          env: 'ADMIN_NAME'

        }
      },
      mongo: {
        uri: {
          doc: 'MongoDB connection URI',
          format: String,
          default: 'mongodb://localhost:27017/mydb',
          env: 'MONGO_URI'
        }
      },
      auth: {
        jwtSecret: {
            doc: 'JWT Secret for signing tokens',
            format: String,
            default: 'your-secret-jwt-key',
            env: 'JWT_SECRET',
        }
      }
    });

    this.config.validate({ allowed: 'strict' });
  }

  public get<T>(key: Path<AppConfig>): T {
    return this.config.get(key) as unknown as T;
  }

  public get port(): number {
    return this.config.get('port');
  }

  public get nodeEnv(): AppConfig['nodeEnv'] {
    return this.config.get('nodeEnv');
  }

  public get postgres(): PostgresConfig {
    return this.config.get('postgres');
  }

  public get mongo(): MongoConfig {
    return this.config.get('mongo');
  }
}

export default new Config();
