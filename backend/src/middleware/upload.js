const multer = require('multer');
const path = require('path');
const { ApiError } = require('./errorHandler');

// Configure storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ApiError('Only image files are allowed (jpeg, jpg, png, gif, webp)', 400), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: fileFilter
});

// Middleware for single file upload
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);
    
    singleUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError('File size too large. Maximum size is 5MB', 400));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new ApiError(`Unexpected field: ${err.field}`, 400));
        }
        return next(new ApiError(`Upload error: ${err.message}`, 400));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

// Middleware for multiple files upload
const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const multipleUpload = upload.array(fieldName, maxCount);
    
    multipleUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError('File size too large. Maximum size is 5MB', 400));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new ApiError(`Too many files. Maximum is ${maxCount}`, 400));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new ApiError(`Unexpected field: ${err.field}`, 400));
        }
        return next(new ApiError(`Upload error: ${err.message}`, 400));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

// Middleware for multiple fields upload
const uploadFields = (fields) => {
  return (req, res, next) => {
    const fieldsUpload = upload.fields(fields);
    
    fieldsUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError('File size too large. Maximum size is 5MB', 400));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new ApiError('Too many files uploaded', 400));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new ApiError(`Unexpected field: ${err.field}`, 400));
        }
        return next(new ApiError(`Upload error: ${err.message}`, 400));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

// Validate uploaded file
const validateFile = (file) => {
  if (!file) {
    throw new ApiError('No file uploaded', 400);
  }

  // Check file size
  if (file.size > 5 * 1024 * 1024) {
    throw new ApiError('File size too large. Maximum size is 5MB', 400);
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new ApiError('Invalid file type. Only images are allowed', 400);
  }

  return true;
};

// Validate multiple files
const validateFiles = (files) => {
  if (!files || files.length === 0) {
    throw new ApiError('No files uploaded', 400);
  }

  files.forEach((file, index) => {
    try {
      validateFile(file);
    } catch (error) {
      throw new ApiError(`File ${index + 1}: ${error.message}`, 400);
    }
  });

  return true;
};

// Get file extension from mimetype
const getFileExtension = (mimetype) => {
  const extensions = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp'
  };
  
  return extensions[mimetype] || 'jpg';
};

// Generate unique filename
const generateFileName = (originalName, prefix = '') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = path.extname(originalName).toLowerCase();
  
  return `${prefix}${timestamp}_${random}${extension}`;
};

// Middleware to process uploaded files for Cloudinary
const processUploadedFiles = (req, res, next) => {
  try {
    // Process single file
    if (req.file) {
      req.file.cloudinaryFolder = getCloudinaryFolder(req.route.path);
      req.file.publicId = generatePublicId(req.file.originalname);
    }

    // Process multiple files
    if (req.files) {
      if (Array.isArray(req.files)) {
        // Files from upload.array()
        req.files.forEach(file => {
          file.cloudinaryFolder = getCloudinaryFolder(req.route.path);
          file.publicId = generatePublicId(file.originalname);
        });
      } else {
        // Files from upload.fields()
        Object.keys(req.files).forEach(fieldName => {
          req.files[fieldName].forEach(file => {
            file.cloudinaryFolder = getCloudinaryFolder(req.route.path);
            file.publicId = generatePublicId(file.originalname);
          });
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Get Cloudinary folder based on route
const getCloudinaryFolder = (routePath) => {
  if (routePath.includes('restaurant')) {
    return 'food-delivery/restaurants';
  } else if (routePath.includes('menu')) {
    return 'food-delivery/menu-items';
  } else if (routePath.includes('user')) {
    return 'food-delivery/users';
  } else {
    return 'food-delivery/general';
  }
};

// Generate Cloudinary public ID
const generatePublicId = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const nameWithoutExt = path.parse(originalName).name.replace(/[^a-zA-Z0-9]/g, '_');
  
  return `${nameWithoutExt}_${timestamp}_${random}`;
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  validateFile,
  validateFiles,
  getFileExtension,
  generateFileName,
  processUploadedFiles
};
