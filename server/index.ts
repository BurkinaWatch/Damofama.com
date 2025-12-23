import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import fs from "fs";
import path from "path";

const app = express();
const httpServer = createServer(app);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Serve uploaded files statically
app.use("/uploads", express.static(uploadsDir));

// Handle file uploads
app.put("/api/uploads/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(uploadsDir, fileId);
    
    const writeStream = fs.createWriteStream(filePath);
    let uploadCompleted = false;
    let uploadError = false;

    req.on("error", (err) => {
      console.error("Request error during upload:", err);
      uploadError = true;
      writeStream.destroy();
      if (!res.headersSent) {
        res.status(500).json({ error: "Request failed" });
      }
    });

    writeStream.on("finish", () => {
      uploadCompleted = true;
      if (!uploadError && !res.headersSent) {
        res.status(200).json({ success: true, objectPath: `/uploads/${fileId}` });
      }
    });
    
    writeStream.on("error", (err) => {
      console.error("Write stream error during upload:", err);
      uploadError = true;
      if (!res.headersSent) {
        res.status(500).json({ error: "File write failed" });
      }
    });

    req.pipe(writeStream);
  } catch (error) {
    console.error("Upload error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Upload failed" });
    }
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const pathname = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (pathname.startsWith("/api")) {
      let logLine = `${req.method} ${pathname} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
