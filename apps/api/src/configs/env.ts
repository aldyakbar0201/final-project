import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { config } from 'dotenv';

// Konversi import.meta.url ke direktori
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env';

config({ path: resolve(__dirname, `../../${envFile}`) });
