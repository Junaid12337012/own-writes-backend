import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

// Google client ID from frontend – ideally move to env
const client = new OAuth2Client(
  '368335960912-gq3e1nk2ir2o21bl1qaqckh1jeudgtj4.apps.googleusercontent.com'
);

router.post('/google', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ msg: 'Missing idToken' });

  try {
    // 1. Verify idToken with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: client._clientId,
    });
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
