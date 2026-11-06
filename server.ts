import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Serve static assets from Vite build output directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all routes to index.html for SPA routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Cloud Run assigns PORT (usually 8080 or specified). If running in local or conflict occurs, fallback safely.
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Production server running on http://0.0.0.0:${PORT}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE' && PORT !== 3000) {
    console.warn(`Port ${PORT} in use, falling back to port 3000...`);
    app.listen(3000, '0.0.0.0', () => {
      console.log('Production server running on http://0.0.0.0:3000');
    });
  } else {
    throw err;
  }
});
