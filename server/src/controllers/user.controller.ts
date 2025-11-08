import type { Request, Response } from "express";
import { readOnlyContract } from "../lib/web3.js";
export const verifyQr = async (req: Request, res: Response) => {
  try {
    const certHash = req.params.hash || "";
    const result = await readOnlyContract.verifyDocument(certHash);

    const [valid, issuer, url] = result;

    // Convert issuer to lowercase (safely, in case it's undefined or null)
    const normalizedIssuer = issuer ? issuer.toLowerCase() : null;

    res.json({
      valid,
      issuer: normalizedIssuer,
      url,
    });
  } catch (error) {
    console.error("Error verifying QR:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const verifyFromDB = async (req: Request, res: Response) => {};
