export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { page = 1, disponible = 1 } = req.query;
  
  const params = new URLSearchParams({
    token: 'b495ce63ede0f4efc9eec62cb947c162',
    id: '1253',
    disponible,
    page
  });

  try {
    const response = await fetch(
      `https://gvamax.ar/Api/v3/inmuebles?${params}`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
