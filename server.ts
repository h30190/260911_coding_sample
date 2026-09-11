import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Simple Request Logging
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      persistence: "local",
      timestamp: new Date().toISOString()
    });
  });

  // Attachments Mock
  app.post("/api/v1/attachments/presigned-url", (req, res) => {
    try {
      const { fileName } = req.body;
      if (!fileName) {
        return res.status(400).json({ error: "fileName is required" });
      }
      res.json({
        uploadUrl: `local-upload`,
        downloadKey: `local-${Date.now()}-${fileName}`
      });
    } catch (error) {
      console.error("Presigned URL error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Vite in middleware mode...");
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (viteError) {
      console.error("Vite middleware failed to start:", viteError);
    }
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ error: "Something went wrong on the server" });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Ready on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);

