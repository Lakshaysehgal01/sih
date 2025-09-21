import multer from "multer";

// Use MEMORY storage instead of disk storage for Cloudinary
const storage = multer.memoryStorage(); // ✅ Files stored in RAM, not disk

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPEG, and PNG files are allowed!"), false);
  }
};

export const upload = multer({
  storage: storage, // ✅ Memory storage for Cloudinary
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 20,
  },
});
