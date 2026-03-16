import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac } from 'crypto';
import { sendEmail, buildVerificationCodeEmail } from './_email';

const SECRET = process.env.CODE_SECRET || 'bm-secret-fallback-2024';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username } = req.body;

  if (!username || !username.includes('@')) {
    return res.status(400).json({ ok: false, error: 'El usuario debe ser un email válido.' });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = Date.now() + 15 * 60 * 1000; // 15 min

  // Stateless signed token — no server-side storage needed
  const sig = createHmac('sha256', SECRET)
    .update(`${username}:${code}:${expires}`)
    .digest('hex');

  try {
    await sendEmail(
      username,
      'Código de verificación - Bermudez Moya Admin',
      buildVerificationCodeEmail(code),
    );
    // Return token to client; client will send it back during verification
    res.status(200).json({ ok: true, token: `${expires}.${sig}` });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
