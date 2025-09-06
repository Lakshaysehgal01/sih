import type { Request, Response } from "express";
import { contract } from "../lib/web3.js";

export const addUniversity = async (req: Request, res: Response) => {
  try {
    const { universityAddress } = req.body;
    const tx = await contract.addUniversity(universityAddress);
    await tx.wait();
    const hash = tx.hash;
    res.status(201).json(hash);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const removeUniversity = async (req: Request, res: Response) => {
  try {
    const { universityAddress } = req.body;
    const tx = await contract.removeUniversity(universityAddress);
    await tx.wait();
    const hash = tx.hash;
    res.status(201).json(hash);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
