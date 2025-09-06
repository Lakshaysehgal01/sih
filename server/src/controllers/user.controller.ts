import type { Request, Response } from "express";
import { readOnlyContract } from "../lib/web3.js";

export const verifyQr = async (req: Request, res: Response) => {
  try {
    const certHash = req.params.hash;
    const result = await readOnlyContract.verifyDocument(certHash);
    const [valid, issuer] = result;
    res.json({ valid, issuer });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const verifyFromDB = async (req: Request, res: Response) => {};
