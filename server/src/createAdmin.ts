import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "./models/admin.model.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface AdminInput {
  fullName: string;
  email: string;
  password: string;
}

async function createAdmin(adminData: AdminInput): Promise<void> {
  try {
    // Connect to MongoDB
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email: adminData.email }, { fullName: adminData.fullName }],
    });

    if (existingAdmin) {
      console.log("❌ Admin with this email or fullName already exists");
      process.exit(1);
    }

    // Hash password
    const saltRounds = 12; // Higher salt rounds for admin accounts
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Create admin
    const newAdmin = new Admin({
      fullName: adminData.fullName,
      email: adminData.email,
      password: hashedPassword,
      pendingRequests: [], // Empty array initially
    });

    await newAdmin.save();

    console.log("🎉 Admin created successfully!");
    console.log(`📧 Email: ${adminData.email}`);
    console.log(`👤 Full Name: ${adminData.fullName}`);
    console.log(`🔒 Password: ${adminData.password} (stored as hash)`);
  } catch (error) {
    console.error("❌ Error creating admin:", error);

    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        console.error("Admin with this email or fullName already exists");
      } else if (error.message.includes("validation")) {
        console.error("Validation error - check required fields");
      } else {
        console.error("Error:", error.message);
      }
    }

    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Get admin details from command line arguments or prompts
async function getAdminDetails(): Promise<AdminInput> {
  const args = process.argv.slice(2);

  if (args.length >= 3 && args[0] && args[1] && args[2]) {
    return {
      fullName: args[0],
      email: args[1],
      password: args[2],
    };
  }

  // If no arguments, use default admin (for development)
  console.log("⚠️  No arguments provided, creating default admin...");
  console.log("Usage: npm run create-admin <fullName> <email> <password>");
  console.log("Creating default admin for development...\n");

  return {
    fullName: "Super Admin",
    email: "admin@example.com",
    password: "admin123", // Change this in production!
  };
}

// Validate input
function validateInput(adminData: AdminInput): boolean {
  if (!adminData.fullName || adminData.fullName.length < 2) {
    console.error("❌ Full name must be at least 2 characters");
    return false;
  }

  if (!adminData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminData.email)) {
    console.error("❌ Please provide a valid email address");
    return false;
  }

  if (!adminData.password || adminData.password.length < 6) {
    console.error("❌ Password must be at least 6 characters");
    return false;
  }

  return true;
}

// Main execution
async function main() {
  try {
    console.log("🚀 Admin Creation Script\n");

    const adminData = await getAdminDetails();

    if (!validateInput(adminData)) {
      process.exit(1);
    }

    console.log("Creating admin with following details:");
    console.log(`👤 Full Name: ${adminData.fullName}`);
    console.log(`📧 Email: ${adminData.email}`);
    console.log(`🔒 Password: ${"*".repeat(adminData?.password?.length)}\n`);

    await createAdmin(adminData);
  } catch (error) {
    console.error("💥 Script failed:", error);
    process.exit(1);
  }
}

// Run the script
main();
