import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

// Load env vars
dotenv.config({ debug: false });
// Ensure JWT_SECRET exists (development fallback)
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'dev_jwt_secret_change_me';
}
// Normalize keys in case .env was saved with UTF-8 BOM (\uFEFF)
for (const k of Object.keys(process.env)) {
  const cleanKey = k.replace(/^\uFEFF/, '');
  if (cleanKey !== k && !(cleanKey in process.env)) {
    process.env[cleanKey] = process.env[k];
  }
}
// Fallback: load .env.example during development if variable still missing
if (process.env.NODE_ENV !== 'production' && !process.env.GOOGLE_CLIENT_ID) {
  // Extra debug – show available env keys and .env content
  try {
    const fs = require('fs');
    const path = require('path');
    console.error('⚠️  GOOGLE_CLIENT_ID still undefined after dotenv; existing keys starting with "GOOGLE":', Object.keys(process.env).filter(k => k.toLowerCase().includes('google')));
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      console.error('📄 .env file found, dumping its contents for inspection:');
      console.error('-------------------- .env BEGIN --------------------');
      console.error(fs.readFileSync(envPath, 'utf8'));
      console.error('-------------------- .env END ----------------------');
    } else {
      console.error('❌ .env file not found at', envPath);
    }
  } catch (e) {
    console.error('Debug read .env error', e);
  }
  const fs = require('fs');
  const path = require('path');
  const examplePath = path.resolve(process.cwd(), '.env.example');
  if (fs.existsSync(examplePath)) {
    dotenv.config({ path: examplePath, override: false });
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({ origin: true, credentials: true }));
app.use(helmet({
  // Allow cross-origin pop-ups (e.g. Google OAuth) to communicate back via postMessage
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// API routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
