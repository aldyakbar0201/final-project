import path from 'node:path';
import multer from 'multer';

const upload = multer({
  storage: multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, 'public/upload');
    },
    filename: function (_req, file, cb) {
      cb(null, Date.now + '-' + path.extname(file.originalname));
    },
  }),
  fileFilter(_req, file, cb) {
    const accFile = /jpeg|jpg|png|gif/;
    const checkType = accFile.test(
      path.extname(file.originalname).toLowerCase(),
    );

    if (checkType) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpg, jpeg, png, gif) are allowed'));
    }
  },
  limits: { fileSize: 1 * 1024 * 1024 },
});

export default upload;
