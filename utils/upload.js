const multer = require('multer');
const path = require('path');

// Configure how and where files are saved
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname+'/../static/src/uploads/'); // Directory must exist beforehand
  },
  filename: (req, file, cb) => {
    // Generate a unique filename prefixing current timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});


// Filter files by type (Example: Images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, PNG, and GIF files are allowed!'), false);
  }
};

// Initialize configuration instance
const upload = multer({
  
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit size to 2MB
  fileFilter: fileFilter
});

module.exports = upload;