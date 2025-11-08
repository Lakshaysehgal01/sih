import type { Request, Response } from "express";
import cloudinary from "../lib/cloudinary.js";
import crypto from "crypto";
import QRCODE from "qrcode";
import { PDFDocument } from "pdf-lib";
import type { UploadApiResponse } from "cloudinary";
import { Documents } from "../models/issueDocument.model.js";
import { University } from "../models/university.model.js";

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
            { resource_type: "auto", folder: "issue_documents" },
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
    const universityId = req.user?.id;
    if (!universityId) {
      res.status(400).json({ message: "University ID not found in request" });
      return;
    }
    const findedUniversity = await University.findById(universityId);
    if (!findedUniversity) {
      res.status(404).json({ message: "University not found" });
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
              resource_type: "auto",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as UploadApiResponse);
            }
          );
          stream.end(Buffer.from(pdfBytes));
        }
      );
      const document = await Documents.findOneAndUpdate(
        { certHash },
        { QrLink: finalUpload.secure_url, issued: true },
        { new: true }
      );

      if (!document) continue;
      findedUniversity.issuedDocuments.push(document._id);
      await findedUniversity.save();

      results.push({
        certHash,
        finalUrl: finalUpload.secure_url,
      });
    }

    res.status(201).json({ message: "Documents finalized", results });
  } catch (error) {
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

export const getAllIssuedDocuments = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = (req.user as any)?.role;

    if (!userId) {
      res.status(400).json({ message: "User ID not found in request" });
      return;
    }

    // Query params for pagination
    const pageRaw = Array.isArray(req.query.page)
      ? req.query.page[0]
      : (req.query.page as string | undefined);
    const limitRaw = Array.isArray(req.query.limit)
      ? req.query.limit[0]
      : (req.query.limit as string | undefined);

    let page = parseInt(String(pageRaw || "1"), 10);
    let limit = parseInt(String(limitRaw || "10"), 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    const MAX_LIMIT = 100;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;

    // Build filter based on user role
    let filter: any = {};
    if (userRole === "admin") {
      // Admin can see all documents
      filter = {};
    } else {
      // University can only see their own documents
      filter = { issuedBy: userId };
    }

    const total = await Documents.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    if (page > totalPages) page = totalPages; // clamp page if it exceeds

    const skip = (page - 1) * limit;

    const documents = await Documents.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("issuedBy", "universityName email");

    res.status(200).json({
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error("❌ getAllIssuedDocuments error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUniversityByIssueId = async (req: Request, res: Response) => {
  const { issuerId } = req.params;
  try {
    const university = await University.findOne({
      publicAddress: issuerId,
    }).select(
      "-__v -createdAt -updatedAt -password -issuedDocuments -letter -publicAddress"
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
