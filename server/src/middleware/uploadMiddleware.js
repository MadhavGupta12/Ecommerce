import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, 'uploads/');
  },
  filename(_req, file, cb) {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (_req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp/;
  const isValid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
  cb(isValid ? null : new Error('Only image uploads are allowed'), isValid);
};

export const upload = multer({ storage, fileFilter });
