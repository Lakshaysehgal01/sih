import { ethers } from "ethers";
import dotenv from "dotenv";
import { ABI } from "../constant/abi.js";
dotenv.config({ quiet: true });

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const signer = new ethers.Wallet(process.env.ADMIN_WALLET_SECERT_KEY, provider);

//Todo see the type and remove any
const contract: any = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  ABI,
  signer
);

const readOnlyContract:any = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  ABI,
  provider
);

export { contract, readOnlyContract };
