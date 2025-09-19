declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: number;
    MONGO_URL: string;
    JWT_SECRET: string;
    NODE_ENV: string;
    CONTRACT_ADDRESS: string;
    ADMIN_WALLET_SECRET_KEY: string;
    RPC_URL: string;
    ClOUDINARY_CLOUD_NAME: string;
    ClOUDINARY_API_KEY: string;
    ClOUDINARY_API_SECERT: string;
    BASE_URL: string;
  }
}
