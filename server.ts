import express from "express";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Proxy for Gvamax
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
      ...(opera && { opera: String(opera) })
    });

    try {
      const response = await fetch(`https://gvamax.ar/Api/v3/inmuebles?${params}`);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
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
