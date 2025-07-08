import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

// Google client ID(s) – read from env, comma-separated to support multiple origins
console.log('🔍 GOOGLE_CLIENT_ID env raw:', process.env.GOOGLE_CLIENT_ID);
const GOOGLE_CLIENT_IDS = (process.env.GOOGLE_CLIENT_ID || '').split(',').map(id => id.trim()).filter(Boolean);

if (GOOGLE_CLIENT_IDS.length === 0) {
  console.warn('⚠️  GOOGLE_CLIENT_ID is not set – Google auth routes will fail');
}

const client = new OAuth2Client();

router.post('/google', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ msg: 'Missing idToken' });

  try {
    // 1. Verify idToken with Google
    const verifyOpts: any = { idToken };
    if (GOOGLE_CLIENT_IDS.length) verifyOpts.audience = GOOGLE_CLIENT_IDS;

    const ticket = await client.verifyIdToken(verifyOpts);
    const payload = ticket.getPayload();
    if (!payload) throw new Error('Bad token');

    // 2. Upsert user
    const user = await User.findOneAndUpdate(
      { googleId: payload.sub },
      {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    // 3. Issue JWT for frontend
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.json({ user, token });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ msg: 'Invalid Google token' });
  }
});

export default router;
