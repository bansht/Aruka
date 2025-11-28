const multer = require("multer");

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Зөвхөн зураг файл оруулах боломжтой!"), false);
  }
};

// Create the multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fieldSize: 300 * 1024 * 1024, // 300MB for field size
    fileSize: 100 * 1024 * 1024,  // 100MB per file
    files: 50,                     // Maximum 50 files
    fields: 100,                   // Maximum 100 non-file fields
  },
});

module.exports = upload;
