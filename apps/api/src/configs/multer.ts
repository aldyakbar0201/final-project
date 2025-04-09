import multer from 'multer';
import path from 'path';

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images');
    },
    filename(req, file, cb) {
      const uniquePrefix = `img-${Date.now()}`;
      cb(null, uniquePrefix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jepg|jpg|png|webp|avif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    // const minetype = allowedTypes.test(file.mimetype);
    if (extname) {
      return cb(null, true);
    } else {
      return cb(new Error('Image only'));
    }
  },
});
