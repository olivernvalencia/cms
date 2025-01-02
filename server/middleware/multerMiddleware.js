import multer from 'multer'; // Use 'import' instead of 'require'
import path from 'path';     // Use 'import' instead of 'require'

// Define the storage configuration with dynamic destination folder selection
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = getUploadFolder(file);  // Function that selects the folder
        cb(null, `./uploads/${folder}`);       // Save the file in the appropriate folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Helper function to select the folder based on the file's field name
const getUploadFolder = (file) => {
    switch (file.fieldname) {
        case 'Profile_Image':  // Update this to match the field name in your frontend
            return 'user_profile';  // Profile images go to 'user_profile'
        case 'certificate':
            return 'certificates';  // Certificates go to 'certificates'
        case 'brgy_logo':
            return 'brgy_logo';     // Barangay logos go to 'brgy_logo'
        default:
            return 'others';        // Any other files go to 'others'
    }
};

// Multer upload setup
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type.'));
        }
        cb(null, true);
    }
});

export default upload;  // Use export default for ES modules
