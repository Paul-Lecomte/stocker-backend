const multer = require('multer');
const path = require('path');

// Set up storage for images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Store images in 'uploads' directory
    },
    filename: (req, file, cb) => {
        // Use a unique filename by appending the current timestamp
        const fileExtension = path.extname(file.originalname); // Get the file extension
        cb(null, `${Date.now()}${fileExtension}`); // Save with the timestamp + extension
    }
});

// File filter: only allow image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// Create multer upload instance with storage and filter options
const upload = multer({ storage, fileFilter });

module.exports = upload;