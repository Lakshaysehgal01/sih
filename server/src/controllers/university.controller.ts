import type { Request, Response } from "express";
import cloudinary from "../lib/cloudinary.js";
import crypto from "crypto";
import QRCODE from "qrcode";
import { PDFDocument } from "pdf-lib";
import type { UploadApiResponse } from "cloudinary";

export const issueDocument = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    const { name, university, year, course, cgpa, rollNo } = req.body; //Todo this we will get from our ocr model
    const pdfBuffer = req.file.buffer;

    // Upload raw PDF to cloudinary
    const uploaded: UploadApiResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "raw" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse);
        }
      );
      stream.end(pdfBuffer);
    });
    const rawString = `${name}|${rollNo}|${course}|${year}|${university}|${cgpa}`;

    const certHash =
      "0x" + crypto.createHash("sha256").update(rawString).digest("hex");

    res.json({
      certHash: certHash,
      pdfUrl: uploaded.secure_url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const finialize = async (req: Request, res: Response) => {
  try {
    const { certHash, pdfUrl } = req.body;
    if (!pdfUrl || !certHash) {
      res.status(400).json({ error: "pdfUrl and certHash are required" });
      return;
    }

    const qrBuffer = await QRCODE.toBuffer(
      `http://localhost:8080/api/v1/public/verify/${certHash}`
    );

    const existingPdfBytes = await fetch(pdfUrl).then((res) =>
      res.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];
    if (!page) {
      console.log("Page not found");
      return;
    }
    const qrImageEmbed = await pdfDoc.embedPng(qrBuffer);
    const { width } = page.getSize();
    page.drawImage(qrImageEmbed, {
      x: width - 120,
      y: 40,
      width: 100,
      height: 100,
    });
    const pdfBytes = await pdfDoc.save();

    const finalUpload: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "Document_qr",
            resource_type: "raw",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          }
        );
        stream.end(Buffer.from(pdfBytes));
      }
    );
    const url = finalUpload.secure_url;
    res.status(201).json({ url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
