import multer from 'multer';

// Sử dụng memoryStorage để lưu tạm vào RAM trước khi đẩy lên Cloudinary
const storage = multer.memoryStorage();
export const upload = multer({ storage });
