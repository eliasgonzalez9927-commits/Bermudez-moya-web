import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac } from 'crypto';

const SECRET = process.env.CODE_SECRET || 'bm-secret-fallback-2024';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, code, token } = req.body;

  if (!username || !code || !token) {
    return res.status(400).json({ ok: false, error: 'Datos incompletos.' });
  }

  const [expiresStr, sig] = token.split('.');
  const expires = parseInt(expiresStr, 10);

  if (Date.now() > expires) {
    return res.status(400).json({ ok: false, error: 'El código expiró. Solicitá uno nuevo.' });
  }

  const expected = createHmac('sha256', SECRET)
    .update(`${username}:${code}:${expires}`)
    .digest('hex');

  if (sig !== expected) {
    return res.status(400).json({ ok: false, error: 'Código incorrecto.' });
  }

  res.status(200).json({ ok: true });
}
