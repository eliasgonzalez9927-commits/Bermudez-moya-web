import express from "express";
import { Resend } from "resend";
import { createServer as createViteServer } from "vite";

// ─── In-memory verification codes store ───────────────────────────────────────
// key: username, value: { code, expires, userId }
const verificationCodes = new Map<string, { code: string; expires: number; userId: string }>();

// ─── Email helpers ─────────────────────────────────────────────────────────────
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'bermudezmoyap@gmail.com';
const BRAND_RED = '#C21C28';
const BRAND_BLACK = '#1D1D1B';

const emailBase = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Bermudez Moya</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
        <!-- HEADER -->
        <tr>
          <td style="background:${BRAND_BLACK};padding:32px 40px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="background:${BRAND_RED};width:44px;height:44px;border-radius:12px;text-align:center;vertical-align:middle;">
                  <span style="color:#fff;font-size:20px;font-weight:900;font-family:monospace;">BM</span>
                </td>
                <td style="padding-left:14px;vertical-align:middle;">
                  <p style="margin:0;color:#fff;font-size:18px;font-weight:900;letter-spacing:-0.5px;">BERMUDEZ MOYA</p>
                  <p style="margin:0;color:#9ca3af;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">GESTIÓN INMOBILIARIA</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- CONTENT -->
        <tr>
          <td style="padding:40px 40px 32px;">
            ${content}
          </td>
        </tr>
        <!-- FOOTER -->
        <tr>
          <td style="background:#f8f8f9;padding:24px 40px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
              Bermudez Moya · San Juan, Argentina
            </p>
            <p style="margin:6px 0 0;color:#d1d5db;font-size:10px;">
              Este email fue enviado automáticamente. Por favor no respondas a este mensaje.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

// 1. Confirmación al usuario que envió el formulario
const buildUserConfirmationEmail = (nombre: string, asunto: string, propertyRef?: string) =>
  emailBase(`
    <h1 style="margin:0 0 8px;color:${BRAND_BLACK};font-size:26px;font-weight:900;">¡Recibimos tu consulta!</h1>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Gracias por contactarnos, ${nombre}.</p>

    <div style="background:#fafafa;border-radius:16px;padding:24px;margin-bottom:28px;border-left:4px solid ${BRAND_RED};">
      <p style="margin:0 0 6px;color:#9ca3af;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Tu consulta</p>
      <p style="margin:0;color:${BRAND_BLACK};font-size:15px;font-weight:700;">${asunto || propertyRef || 'Consulta General'}</p>
      ${propertyRef ? `<p style="margin:6px 0 0;color:${BRAND_RED};font-size:11px;font-weight:700;text-transform:uppercase;">Ref: ${propertyRef}</p>` : ''}
    </div>

    <p style="margin:0 0 28px;color:#374151;font-size:14px;line-height:1.7;">
      Un miembro de nuestro equipo revisará tu mensaje y se pondrá en contacto con vos a la brevedad.
      Si necesitás respuesta urgente, podés comunicarte por cualquiera de estos canales:
    </p>

    <table cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:0 6px 0 0;" width="50%">
          <a href="https://wa.me/5492646000000" style="display:block;background:#25D366;color:#fff;text-decoration:none;text-align:center;padding:14px;border-radius:12px;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">
            💬 WhatsApp
          </a>
        </td>
        <td style="padding:0 0 0 6px;" width="50%">
          <a href="mailto:${CONTACT_EMAIL}" style="display:block;background:${BRAND_BLACK};color:#fff;text-decoration:none;text-align:center;padding:14px;border-radius:12px;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">
            ✉️ Email
          </a>
        </td>
      </tr>
    </table>
  `);

// 2. Notificación interna al admin cuando llega un lead
const buildAdminLeadEmail = (data: Record<string, string>) =>
  emailBase(`
    <div style="display:inline-block;background:${BRAND_RED};color:#fff;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;padding:6px 14px;border-radius:20px;margin-bottom:20px;">
      Nuevo Lead Web
    </div>
    <h1 style="margin:0 0 24px;color:${BRAND_BLACK};font-size:22px;font-weight:900;">${data.nombre} ${data.apellido}</h1>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;margin-bottom:24px;">
      ${[
        ['Email', data.email],
        ['Celular', data.celular],
        ['Asunto', data.asunto || data.propertyRef || '—'],
        ['Mensaje', data.detalle],
      ].map(([label, val], i) => `
        <tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'};">
          <td style="padding:12px 16px;font-size:11px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;width:100px;border-top:1px solid #f3f4f6;">${label}</td>
          <td style="padding:12px 16px;font-size:14px;color:${BRAND_BLACK};font-weight:600;border-top:1px solid #f3f4f6;">${val}</td>
        </tr>`).join('')}
    </table>

    <p style="margin:0;color:#9ca3af;font-size:11px;">Este lead fue guardado automáticamente en el panel de administración.</p>
  `);

// 3. Email con código de verificación para reseteo de contraseña
const buildVerificationCodeEmail = (code: string) =>
  emailBase(`
    <p style="margin:0 0 8px;color:#9ca3af;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Verificación de identidad</p>
    <h1 style="margin:0 0 28px;color:${BRAND_BLACK};font-size:24px;font-weight:900;">Código de acceso</h1>

    <div style="background:#fafafa;border:2px dashed #e5e7eb;border-radius:20px;padding:36px;text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 8px;color:#9ca3af;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Tu código</p>
      <p style="margin:0;color:${BRAND_RED};font-size:48px;font-weight:900;letter-spacing:10px;font-family:monospace;">${code}</p>
    </div>

    <div style="background:#fef2f2;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0;color:#b91c1c;font-size:13px;font-weight:700;">
        ⏱ Este código expira en <strong>15 minutos</strong>.
      </p>
    </div>

    <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
      Si no solicitaste este código, ignorá este mensaje. Tu contraseña no será modificada.
    </p>
  `);

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // ─── Resend client (graceful degradation si no hay API key) ──────────────────
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  const sendEmail = async (to: string, subject: string, html: string) => {
    if (!resend) {
      console.log(`[Email skipped — no RESEND_API_KEY] To: ${to} | Subject: ${subject}`);
      return { ok: true, note: 'Email not configured' };
    }
    const { error } = await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
    if (error) throw error;
    return { ok: true };
  };

  // ─── Endpoint 1: notificación al admin de nuevo lead ─────────────────────────
  app.post('/api/send-email', async (req, res) => {
    const { nombre, apellido, email, celular, asunto, detalle, propertyRef } = req.body;
    try {
      const result = await sendEmail(
        CONTACT_EMAIL,
        `Nuevo lead web: ${nombre} ${apellido} — ${asunto || propertyRef || 'Consulta General'}`,
        buildAdminLeadEmail({ nombre, apellido, email, celular, asunto, detalle, propertyRef }),
      );
      res.status(200).json(result);
    } catch (err: any) {
      console.error('Error sending admin notification:', err.message);
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // ─── Endpoint 2: confirmación al usuario que envió el formulario ──────────────
  app.post('/api/send-confirmation', async (req, res) => {
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
      console.error('Error sending confirmation:', err.message);
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // ─── Endpoint 3: enviar código de verificación para reseteo de contraseña ─────
  app.post('/api/send-verification-code', async (req, res) => {
    const { username } = req.body;
    if (!username || !username.includes('@')) {
      return res.status(400).json({ ok: false, error: 'El usuario debe ser un email válido.' });
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expires = Date.now() + 15 * 60 * 1000; // 15 minutos
    verificationCodes.set(username, { code, expires, userId: username });

    try {
      await sendEmail(
        username,
        'Código de verificación - Bermudez Moya Admin',
        buildVerificationCodeEmail(code),
      );
      res.status(200).json({ ok: true });
    } catch (err: any) {
      verificationCodes.delete(username);
      console.error('Error sending verification code:', err.message);
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // ─── Endpoint 4: validar código de verificación ───────────────────────────────
  app.post('/api/verify-code', async (req, res) => {
    const { username, code } = req.body;
    const entry = verificationCodes.get(username);
    if (!entry) return res.status(400).json({ ok: false, error: 'No hay código activo para este usuario.' });
    if (Date.now() > entry.expires) {
      verificationCodes.delete(username);
      return res.status(400).json({ ok: false, error: 'El código expiró. Solicitá uno nuevo.' });
    }
    if (entry.code !== String(code)) {
      return res.status(400).json({ ok: false, error: 'Código incorrecto.' });
    }
    verificationCodes.delete(username);
    res.status(200).json({ ok: true });
  });

  // ─── API Proxy for Gvamax ─────────────────────────────────────────────────────
  app.get("/api/properties", async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { page = 1, tipo, opera, disponible = 1 } = req.query;
    const params = new URLSearchParams({
      token: process.env.VITE_GVAMAX_TOKEN || 'b495ce63ede0f4efc9eec62cb947c162',
      id: process.env.VITE_GVAMAX_ID || '1253',
      disponible: String(disponible),
      page: String(page),
      ...(tipo && { tipo: String(tipo) }),
      ...(opera && { opera: String(opera) }),
    });

    try {
      const response = await fetch(`https://gvamax.ar/Api/v3/inmuebles?${params}`);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ─── Vite middleware ──────────────────────────────────────────────────────────
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
