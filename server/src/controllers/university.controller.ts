import type { Request, Response } from "express";
import cloudinary from "../lib/cloudinary.js";
import crypto from "crypto";
import QRCODE from "qrcode";
import { PDFDocument } from "pdf-lib";
import type { UploadApiResponse } from "cloudinary";
import { Documents } from "../models/issueDocument.model.js";
import { University } from "../models/university.model.js";

// export const issueDocument = async (req: Request, res: Response) => {
//   try {
//     if (!req.file) {
//       res.status(400).json({ message: "No file uploaded" });
//       return;
//     }
//     const { name, university, year, course, cgpa, rollNo } = req.body; //Todo this we will get from our ocr model
//     const pdfBuffer = req.file.buffer;

//     // Upload raw PDF to cloudinary
//     const uploaded: UploadApiResponse = await new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { resource_type: "raw" },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result as UploadApiResponse);
//         }
//       );
//       stream.end(pdfBuffer);
//     });
//     const rawString = `${name}|${rollNo}|${course}|${year}|${university}|${cgpa}`;

//     const certHash =
//       "0x" + crypto.createHash("sha256").update(rawString).digest("hex");
//     console.log(req.authUser);
//     console.log(req.user?.id);

//     const document = await Documents.create({
//       name: name,
//       enrollNo: rollNo,
//       course: course,
//       year: year,
//       type: "pdf",
//       QrLink: uploaded.secure_url,
//       issued: false,
//       issuedBy: req.user?.id,
//     });

//     res.json({
//       certHash: certHash,
//       fileUrl: uploaded.secure_url,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal server Error" });
//   }
// };

// export const finialize = async (req: Request, res: Response) => {
//   try {
//     const { certHash, pdfUrl } = req.body;
//     if (!pdfUrl || !certHash) {
//       res.status(400).json({ error: "pdfUrl and certHash are required" });
//       return;
//     }

//     const qrBuffer = await QRCODE.toBuffer(
//       `http://localhost:8080/api/v1/public/verify/${certHash}`
//     );

//     const existingPdfBytes = await fetch(pdfUrl).then((res) =>
//       res.arrayBuffer()
//     );

//     const pdfDoc = await PDFDocument.load(existingPdfBytes);
//     const page = pdfDoc.getPages()[0];
//     if (!page) {
//       console.log("Page not found");
//       return;
//     }
//     const qrImageEmbed = await pdfDoc.embedPng(qrBuffer);
//     const { width } = page.getSize();
//     page.drawImage(qrImageEmbed, {
//       x: width - 120,
//       y: 40,
//       width: 100,
//       height: 100,
//     });
//     const pdfBytes = await pdfDoc.save();

//     const finalUpload: UploadApiResponse = await new Promise(
//       (resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           {
//             folder: "Document_qr",
//             resource_type: "raw",
//           },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result as UploadApiResponse);
//           }
//         );
//         stream.end(Buffer.from(pdfBytes));
//       }
//     );
//     const url = finalUpload.secure_url;
//     res.status(201).json({ url });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const issueManyDocuments = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      res.status(400).json({ message: "No files uploaded" });
      return;
    }
    const metadataArray = JSON.parse(req.body.metadata);
    const documents: any[] = [];
    for (let i = 0; i < (req.files as Express.Multer.File[]).length; i++) {
      const file = req.files[i];
      const pdfBuffer = file?.buffer;
      const meta = metadataArray[i];
      const uploaded: UploadApiResponse = await new Promise(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "raw", folder: "issue_documents" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as UploadApiResponse);
            }
          );
          stream.end(pdfBuffer);
        }
      );
      const { name, university, year, course, cgpa, rollNo } = meta;
      const rawString = `${name}|${rollNo}|${course}|${year}|${university}|${cgpa}`;
      const certHash =
        "0x" + crypto.createHash("sha256").update(rawString).digest("hex");

      const document = await Documents.create({
        name: name,
        enrollNo: rollNo,
        course: course,
        year: year,
        type: "pdf",
        QrLink: uploaded.secure_url,
        issued: false,
        issuedBy: req.user?.id,
        certHash,
      });
      documents.push({
        certHash,
        fileUrl: uploaded.secure_url,
      });
    }
    res.json({ documents });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const finializeMultiple = async (req: Request, res: Response) => {
  try {
    const { documents } = req.body;
    if (!documents || !Array.isArray(documents)) {
      res.status(400).json({ error: "documents array required" });
      return;
    }
    const results = [];
    for (const doc of documents) {
      const { certHash, fileUrl } = doc;
      if (!fileUrl || !certHash) continue;

      // generate QR code
      const qrBuffer = await QRCODE.toBuffer(
        `${process.env.BASE_URL}${certHash}`
      );

      const existingPdfBytes = await fetch(fileUrl).then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const page = pdfDoc.getPages()[0];
      if (!page) continue;

      // embed QR code
      const qrImageEmbed = await pdfDoc.embedPng(qrBuffer);
      const { width } = page.getSize();
      page.drawImage(qrImageEmbed, {
        x: width - 120,
        y: 40,
        width: 100,
        height: 100,
      });

      const pdfBytes = await pdfDoc.save();

      // upload final PDF to Cloudinary
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
      await Documents.findOneAndUpdate(
        { certHash },
        { QrLink: finalUpload.secure_url, issued: true },
        { new: true }
      );

      results.push({
        certHash,
        finalUrl: finalUpload.secure_url,
      });
    }

    res.status(201).json({ message: "Documents finalized", results });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUniversityDetails = async (req: Request, res: Response) => {
  try {
    const universityId = req.user?.id;
    console.log(universityId);
    if (!universityId) {
      res.status(400).json({ message: "University ID not found in request" });
      return;
    }
    const university = await University.findById(universityId).select(
      "-__v -createdAt -updatedAt -password"
    );
    if (!university) {
      res.status(404).json({ message: "University not found" });
      return;
    }
    res.status(200).json({ university });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
