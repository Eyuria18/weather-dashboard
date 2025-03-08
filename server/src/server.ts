import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the client dist folder (Vite build output)
app.use(express.static(path.join(process.cwd(), '../client', 'dist')));

// Middleware for parsing JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the API routes
app.use(routes);

// Catch-all route to serve index.html for frontend routing (e.g., React Router)
app.get('*', (_req, res) => {
  res.sendFile(path.join(process.cwd(), '../client', 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
