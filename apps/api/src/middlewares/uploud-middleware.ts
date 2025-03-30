import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Setup multer untuk file upload
const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, 'uploads/'); // Menyimpan file di folder 'uploads/'
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter untuk validasi jenis file
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true); // Jika ekstensi file dan MIME type valid
  } else {
    return cb(
      new Error('Only .jpg, .jpeg, .png, .gif files are allowed!'),
      //   false,
    ); // Jika tidak valid
  }
};

// Setup multer dengan limit ukuran file dan filter ekstensi
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 }, // Limit 1MB
  fileFilter: fileFilter,
});

export default upload;
