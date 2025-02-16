import convict, { Path } from 'convict';

interface PostgresConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

interface MongoConfig {
  uri: string;
}
interface AuthConfig {
    jwtSecret: string; 
}

interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test' | 'staging';
  postgres: PostgresConfig;
  mongo: MongoConfig;
  auth: AuthConfig;
}

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

  // Typed getters for convenience
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
