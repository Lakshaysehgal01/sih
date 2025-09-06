declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: number;
    MONGO_URL: string;
    JWT_SECRET: string;
    NODE_ENV: string;
  }
}
