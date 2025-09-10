import { ethers } from "ethers";
import dotenv from "dotenv";
import { ABI } from "../constant/abi.js";
import type { Contract } from "ethers";
dotenv.config({ quiet: true });

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const signer = new ethers.Wallet(process.env.ADMIN_WALLET_SECRET_KEY, provider);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  ABI,
  signer
) as Contract & {
  addUniversity: (addr: string) => Promise<any>;
  removeUniversity: (addr: string) => Promise<any>;
};

const readOnlyContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  ABI,
  provider
) as Contract & {
  verifyDocument: (certHash: string) => Promise<[boolean, string, string]>;
};

export { contract, readOnlyContract };
