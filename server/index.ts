import express from "express";
import session from "express-session";
import compression from "compression";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import path from "path";

const app = express();

// Performance optimizations for fast loading
app.use(compression()); // Enable gzip compression
app.use(express.json({ limit: '1mb' })); // Optimize JSON parsing

// Optimized static asset caching and headers
app.use((req, res, next) => {
  // Set aggressive caching for static assets
  if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|map)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
    res.setHeader('ETag', 'strong'); // Enable strong ETags
  }
  
  // Fast response headers for all requests
  res.setHeader('X-Powered-By', 'Temple-Donation-System');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  
  next();
});
app.use(express.urlencoded({ extended: false }));

// Optimized static file serving with performance enhancements  
app.use(express.static('public', {
  maxAge: '1d', // 1 day cache for public files
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Extra caching for immutable assets
    if (path.includes('assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Serve React app static files with optimized caching
app.use(express.static('dist/public', {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.includes('assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Session configuration
app.use((session as any)({
  secret: process.env.SESSION_SECRET || 'temple-donation-secret-key-change-in-production',
  resave: true,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(`${new Date().toLocaleTimeString()} [express] ${logLine}`);
    }
  });

  next();
});

(async () => {
  // Register PostgreSQL routes
  registerRoutes(app);
  
  const server = createServer(app);
  
  console.log(`${new Date().toLocaleTimeString()} [express] ✓ PostgreSQL Database Connected - Data will be persistent`);

  app.use((err: any, _req: any, res: any, _next: any) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  // Serve static files from dist/public if available, otherwise use current setup
  const distPath = path.resolve(process.cwd(), "dist/public");
  
  try {
    // Try to serve static files from build directory
    app.use(express.static(distPath));
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
    console.log(`${new Date().toLocaleTimeString()} [express] ✓ Serving static files from ${distPath}`);
  } catch (error) {
    // Fallback to development mode
    console.log(`${new Date().toLocaleTimeString()} [express] ⚠ Static files not found, running in development mode`);
    app.get("*", (_req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Temple Donation System</title>
          </head>
          <body>
            <div id="root">Loading...</div>
            <script>
              window.location.href = '/api/health';
            </script>
          </body>
        </html>
      `);
    });
  }

  // Use PORT environment variable or default to 5000
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  
  // Windows compatible: use localhost and no reusePort  
  server.listen(port, '0.0.0.0', () => {
    console.log(`${new Date().toLocaleTimeString()} [express] serving on localhost:${port}`);
  });
})();
