import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

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
}
