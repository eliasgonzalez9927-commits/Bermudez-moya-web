import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendEmail, buildUserConfirmationEmail } from './_email';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { nombre, email, asunto, propertyRef } = req.body;
  if (!email || !nombre) return res.status(400).json({ ok: false, error: 'Missing fields' });
  try {
    const result = await sendEmail(
      email,
      'Recibimos tu consulta - Bermudez Moya',
      buildUserConfirmationEmail(nombre, asunto, propertyRef),
    );
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
