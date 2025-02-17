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
  interface AdminConfig {
    email: string;
    password: string;
    mobile: string;

  }
  
  interface AppConfig {
    port: number;
    nodeEnv: 'development' | 'production' | 'test' | 'staging';
    postgres: PostgresConfig;
    mongo: MongoConfig;
    auth: AuthConfig;
    admin: AdminConfig;
  }
  interface DecodedUser {
    id: number;
    email: string;
    mobile: string;
    role: 'admin' | 'regular';
    iat?: number;
    exp?: number;
  }
  export {
    PostgresConfig,
    MongoConfig,
    AuthConfig,
    AppConfig,
    DecodedUser,
    AdminConfig
  }