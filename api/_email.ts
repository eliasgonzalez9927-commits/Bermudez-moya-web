// Shared email utilities — prefixed with _ so Vercel ignores as route
import { Resend } from 'resend';

export const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'bermudezmoyap@gmail.com';
const BRAND_RED = '#C21C28';
const BRAND_BLACK = '#1D1D1B';

export const getResend = () =>
  process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendEmail = async (to: string, subject: string, html: string) => {
  const resend = getResend();
  if (!resend) {
    console.log(`[Email skipped — no RESEND_API_KEY] To: ${to}`);
    return { ok: true, note: 'Email not configured' };
  }
  const { error } = await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
  if (error) throw error;
  return { ok: true };
};

const emailBase = (content: string) => `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
        <tr>
          <td style="background:${BRAND_BLACK};padding:32px 40px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
              <td style="background:${BRAND_RED};width:44px;height:44px;border-radius:12px;text-align:center;vertical-align:middle;">
                <span style="color:#fff;font-size:20px;font-weight:900;font-family:monospace;">BM</span>
              </td>
              <td style="padding-left:14px;vertical-align:middle;">
                <p style="margin:0;color:#fff;font-size:18px;font-weight:900;">BERMUDEZ MOYA</p>
                <p style="margin:0;color:#9ca3af;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">GESTIÓN INMOBILIARIA</p>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr><td style="padding:40px 40px 32px;">${content}</td></tr>
        <tr>
          <td style="background:#f8f8f9;padding:24px 40px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Bermudez Moya · San Juan, Argentina</p>
            <p style="margin:6px 0 0;color:#d1d5db;font-size:10px;">Este email fue enviado automáticamente. Por favor no respondas a este mensaje.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

export const buildUserConfirmationEmail = (nombre: string, asunto: string, propertyRef?: string) =>
  emailBase(`
    <h1 style="margin:0 0 8px;color:${BRAND_BLACK};font-size:26px;font-weight:900;">¡Recibimos tu consulta!</h1>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Gracias por contactarnos, ${nombre}.</p>
    <div style="background:#fafafa;border-radius:16px;padding:24px;margin-bottom:28px;border-left:4px solid ${BRAND_RED};">
      <p style="margin:0 0 6px;color:#9ca3af;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Tu consulta</p>
      <p style="margin:0;color:${BRAND_BLACK};font-size:15px;font-weight:700;">${asunto || propertyRef || 'Consulta General'}</p>
      ${propertyRef ? `<p style="margin:6px 0 0;color:${BRAND_RED};font-size:11px;font-weight:700;text-transform:uppercase;">Ref: ${propertyRef}</p>` : ''}
    </div>
    <p style="margin:0 0 28px;color:#374151;font-size:14px;line-height:1.7;">Un miembro de nuestro equipo se pondrá en contacto con vos a la brevedad. Si necesitás respuesta urgente:</p>
    <table cellpadding="0" cellspacing="0" width="100%"><tr>
      <td style="padding:0 6px 0 0;" width="50%">
        <a href="https://wa.me/5492646000000" style="display:block;background:#25D366;color:#fff;text-decoration:none;text-align:center;padding:14px;border-radius:12px;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">💬 WhatsApp</a>
      </td>
      <td style="padding:0 0 0 6px;" width="50%">
        <a href="mailto:${CONTACT_EMAIL}" style="display:block;background:${BRAND_BLACK};color:#fff;text-decoration:none;text-align:center;padding:14px;border-radius:12px;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">✉️ Email</a>
      </td>
    </tr></table>
  `);

export const buildAdminLeadEmail = (data: Record<string, string>) =>
  emailBase(`
    <div style="display:inline-block;background:${BRAND_RED};color:#fff;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;padding:6px 14px;border-radius:20px;margin-bottom:20px;">Nuevo Lead Web</div>
    <h1 style="margin:0 0 24px;color:${BRAND_BLACK};font-size:22px;font-weight:900;">${data.nombre} ${data.apellido}</h1>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;margin-bottom:24px;">
      ${[['Email', data.email], ['Celular', data.celular], ['Asunto', data.asunto || data.propertyRef || '—'], ['Mensaje', data.detalle]]
        .map(([label, val], i) => `<tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'};"><td style="padding:12px 16px;font-size:11px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;width:100px;border-top:1px solid #f3f4f6;">${label}</td><td style="padding:12px 16px;font-size:14px;color:${BRAND_BLACK};font-weight:600;border-top:1px solid #f3f4f6;">${val}</td></tr>`).join('')}
    </table>
    <p style="margin:0;color:#9ca3af;font-size:11px;">Este lead fue guardado automáticamente en el panel de administración.</p>
  `);

export const buildVerificationCodeEmail = (code: string) =>
  emailBase(`
    <p style="margin:0 0 8px;color:#9ca3af;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Verificación de identidad</p>
    <h1 style="margin:0 0 28px;color:${BRAND_BLACK};font-size:24px;font-weight:900;">Código de acceso</h1>
    <div style="background:#fafafa;border:2px dashed #e5e7eb;border-radius:20px;padding:36px;text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 8px;color:#9ca3af;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Tu código</p>
      <p style="margin:0;color:${BRAND_RED};font-size:48px;font-weight:900;letter-spacing:10px;font-family:monospace;">${code}</p>
    </div>
    <div style="background:#fef2f2;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0;color:#b91c1c;font-size:13px;font-weight:700;">⏱ Este código expira en <strong>15 minutos</strong>.</p>
    </div>
    <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">Si no solicitaste este código, ignorá este mensaje.</p>
  `);
