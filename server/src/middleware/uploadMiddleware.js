import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.resolve(__dirname, '../../../uploads');

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadDirectory);
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
