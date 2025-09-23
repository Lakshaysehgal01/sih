import type { Request, Response } from "express";
import { contract } from "../lib/web3.js";
import { pendingRequest } from "../models/pendingUniversity.model.js";
import nodemailer from "nodemailer";

export const getAllPendingUniversityRequests = async (
  req: Request,
  res: Response
) => {
  try {
    // Parse query params with defaults
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "10", 10);
    const search = (req.query.search as string) || "";

    const skip = (page - 1) * limit;

    const filter = search
      ? { universityName: { $regex: search, $options: "i" } }
      : {};

    // Run both queries in parallel
    const [requests, total] = await Promise.all([
      pendingRequest.find(filter).skip(skip).limit(limit),
      pendingRequest.countDocuments(filter),
    ]);

    res.status(200).json({
      data: requests,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptUniversityRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;

    const request = await pendingRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const tx = await contract.addUniversity(request.publicAddress);
    await tx.wait();

    const newUniversity = {
      universityName: request.universityName,
      AISHE: request.AISHE,
      email: request.email,
      letter: request.letter,
      publicAddress: request.publicAddress,
      password: request.password, // Hashed password
    };

    // Save to University collection
    await (
      await import("../models/university.model.js")
    ).University.create(newUniversity);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // or your SMTP host
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER, // e.g. your Gmail address
        pass: process.env.SMTP_PASS, // app password
      },
    });

    const mailOptions = {
      from: `Congratulations!! Your Details have been verified by the admin. Welcome Aboard! ${process.env.SMTP_USER}`,
      to: request.email,
      subject: "University Registration Approved",
      text: `Congratulations!! Your Details have been verified by the admin. Welcome Aboard! Please Login using your credentials.`,
      html: `<p>Congratulations!! Your Details have been verified by the admin. Welcome Aboard! Please Login using your credentials.</p>`,
    };

    // 5. Send email
    await transporter.sendMail(mailOptions);

    // Remove the request from pending collection
    await pendingRequest.findByIdAndDelete(requestId);

    res.status(200).json({
      message: "University added successfully",
      transactionHash: tx.hash,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectUniversityRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { reason } = req.body;

    const request = await pendingRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // or your SMTP host
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER, // e.g. your Gmail address
        pass: process.env.SMTP_PASS, // app password
      },
    });

    const mailOptions = {
      from: `{New University Added for verification : ${request.universityName} } <${process.env.SMTP_USER}>`,
      to: request.email,
      subject: "University Registration Rejected",
      text: `Your registration for the university ${request.universityName} has been rejected. Reason: ${reason} Please retry registration with correct details or contact support.`,
      html: `<p>Your registration for the university ${request.universityName} has been rejected. Reason: ${reason}.</p>`,
    };

    // 5. Send email
    await transporter.sendMail(mailOptions);

    await pendingRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: "University request rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addUniversity = async (req: Request, res: Response) => {
  try {
    const { universityAddress } = req.body;
    const tx = await contract.addUniversity(universityAddress);
    await tx.wait();
    const hash = tx.hash;
    res.status(201).json(hash);
  } catch (error) {
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
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
