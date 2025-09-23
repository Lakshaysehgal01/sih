import type { Request, Response } from "express";
import {
  loginZodSchema,
  signupZodSchema,
  universitySignupZodSchema,
} from "../lib/zod.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/util.js";
import { University } from "../models/university.model.js";
import { pendingRequest } from "../models/pendingUniversity.model.js";
import { Admin } from "../models/admin.model.js";
import nodemailer from "nodemailer";
import { Otp } from "../models/otp.model.js";
import { TempRegistration } from "../models/tempRegistration.model.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";

const roleModels: Record<string, any> = {
  user: User,
  university: University,
  admin: Admin,
};

const checkOTP = async ({ email, otp }: { email: string; otp: string }) => {
  const record = await Otp.findOne({ email, otp });
  if (!record) throw new Error("Invalid or expired OTP");

  await Otp.deleteOne({ _id: record._id }); // cleanup after success
  return true;
};

export const signup = async (req: Request, res: Response) => {
  const result = signupZodSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: result.error.issues[0]?.message,
    });
    return;
  }
  const { email, fullName, password } = result.data;
  try {
    const existingUser = await User.findOne({
      email: email,
    });
    if (existingUser) {
      res.status(400).json({
        message: "Email already exists",
      });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullName,
    });
    if (newUser) {
      generateToken(newUser._id, res, "user");
      const userWithoutPassword = newUser.toObject() as {
        [key: string]: any;
      };
      delete userWithoutPassword.password;
      res.status(201).json(userWithoutPassword);
    } else {
      res.status(400).json({
        message: "Invalid user details ",
      });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal server error " });
  }
};

export const universitySignUp = async (req: Request, res: Response) => {
  try {
    let letterUrl = "";

    if (req.file) {
      try {
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
        letterUrl = cloudinaryResult.secure_url;
      } catch (uploadError) {
        console.error("❌ Cloudinary upload failed:", uploadError);
        return res.status(500).json({
          message: "File upload failed. Please try again.",
        });
      }
    }

    const bodyWithFile = {
      ...req.body,
      letter: letterUrl || req.body.letter, // Use uploaded URL or fallback to existing body value
    };

    const result = universitySignupZodSchema.safeParse(bodyWithFile);
    if (!result.success) {
      res.status(400).json({ message: result.error.issues[0]?.message });
      return;
    }

    const { email, universityName, AISHE, password, letter, publicAddress } =
      result.data;
    const existingUniversity = await University.findOne({
      $or: [{ email }, { AISHE }, { publicAddress }],
    });
    if (existingUniversity) {
      return res
        .status(400)
        .json({ message: "University with provided details already exists" });
    }

    // Store temporary registration data
    await TempRegistration.findOneAndUpdate(
      { email },
      {
        email,
        universityName,
        AISHE,
        password, // Store unhashed temporarily
        letter,
        publicAddress,
      },
      { upsert: true, new: true }
    );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({ email, otp });

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
      from: `"University Verification" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your university email",
      text: `Your OTP for university registration is: ${otp}\n\nIt will expire in 10 minutes.`,
      html: `<p>Your OTP for university registration is:</p>
           <h2>${otp}</h2>
           <p>This code will expire in <b>10 minutes</b>.</p>`,
    };

    // 5. Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: `OTP sent to ${email}. Please verify to complete your registration.`,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error " });
  }
};

export const verifyUniversityOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email?.trim() || !otp?.trim()) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ message: "OTP must be 6 digits" });
  }

  try {
    const otpVerificationSuccess = await checkOTP({ email, otp });
    if (!otpVerificationSuccess) {
      return res.status(400).json({ message: "OTP verification failed" });
    }

    const tempData = await TempRegistration.findOne({
      email,
    });
    if (!tempData) {
      return res
        .status(400)
        .json({ message: "Registartion Session Expired. Please try again!!" });
    }

    // Complete registration
    const hashedPassword = await bcrypt.hash(tempData.password, 10);

    const newPendingRequest = await pendingRequest.create({
      email: tempData.email,
      universityName: tempData.universityName,
      AISHE: tempData.AISHE,
      password: hashedPassword,
      letter: tempData.letter,
      publicAddress: tempData.publicAddress,
    });

    if (!newPendingRequest) {
      return res.status(500).json({
        message: "Could not create pending request",
      });
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
      from: `{New University Added for verification : ${tempData.universityName} } <${process.env.SMTP_USER}>`,
      to: "karansbisht7@gmail.com",
      subject: `Verify the new university request ${tempData.universityName}`,
      text: `A new university has signed up and is pending your approval. Please review the details in the admin panel.`,
      html: `<p>A new university has signed up and is pending your approval. Please review the details in the admin panel.</p>`,
    };

    // 5. Send email
    await transporter.sendMail(mailOptions);

    // Cleanup temporary data
    await TempRegistration.deleteOne({ email });

    res.status(201).json({
      message: "University registration request submitted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error " });
  }
};

export const login = async (req: Request, res: Response) => {
  // ✅ Validate body
  const result = loginZodSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: result.error.issues[0]?.message });
  }
  const { email, password, role } = result.data;

  try {
    // ✅ Check role validity
    const Model = roleModels[role];
    if (!Model) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // ✅ Find account
    const account = await Model.findOne({ email });
    if (!account) {
      return res.status(403).json({ message: "Incorrect credentials" });
    }

    // ✅ Compare password
    const isPasswordCorrect = await bcrypt.compare(password, account.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    // ✅ Issue token with role
    generateToken(account._id, res, role);

    // ✅ Remove password from response
    const safeAccount = account.toObject();
    delete safeAccount.password;

    res.status(200).json({ ...safeAccount, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logout successfully",
    });
  } catch (e) {
    res.status(500).json({ message: "Internal server error " });
  }
};
