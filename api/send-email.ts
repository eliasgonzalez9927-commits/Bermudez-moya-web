import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendEmail, CONTACT_EMAIL, buildAdminLeadEmail } from './_email';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { nombre, apellido, email, celular, asunto, detalle, propertyRef } = req.body;
  try {
    const result = await sendEmail(
      CONTACT_EMAIL,
      `Nuevo lead web: ${nombre} ${apellido} — ${asunto || propertyRef || 'Consulta General'}`,
      buildAdminLeadEmail({ nombre, apellido, email, celular, asunto, detalle, propertyRef }),
    );
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
