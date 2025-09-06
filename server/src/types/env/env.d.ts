declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: number;
    MONGO_URL: string;
    JWT_SECRET: string;
    NODE_ENV: string;
    CONTRACT_ADDRESS:string;
    ADMIN_WALLET_SECERT_KEY:string;
    RPC_URL:string;
  }
}
