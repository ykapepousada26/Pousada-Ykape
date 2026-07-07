import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_ROOMS } from './src/data/initialData';

// Simple in-memory cache for Google Drive folder scrape results
// Kept for 24 hours to maximize performance and avoid Google rate-limiting
const cache: Record<string, { images: string[]; timestamp: number }> = {};
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

/**
 * Scrapes a public Google Drive folder page to extract the image file IDs.
 */
async function fetchDriveImages(folderId: string): Promise<string[]> {
  const url = `https://drive.google.com/drive/folders/${folderId}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const html = await res.text();
    
    // Extract strings that look like 33-char Google Drive IDs starting with 1
    const regex = /"1[a-zA-Z0-9_-]{32}"/g;
    const matches = html.match(regex) || [];
    
    // Clean up quotes and eliminate duplicates or folder ID itself
    const ids = [...new Set(matches.map(m => m.replace(/"/g, '')))]
      .filter(id => id !== folderId);
    
    if (ids.length === 0) {
      return [];
    }

    // Convert to direct googleusercontent image CDN links
    return ids.map(id => `https://lh3.googleusercontent.com/d/${id}`);
  } catch (err) {
    console.error(`[Drive Scraper] Error scraping folder ${folderId}:`, err);
    return [];
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Weather proxy endpoint
  app.get('/api/weather', async (req, res) => {
    const fetchWithRetry = async (retries = 2): Promise<Response> => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout per attempt
      
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-24.7431&longitude=-47.5519&current_weather=true',
          { signal: controller.signal }
        );
        clearTimeout(timeout);
        return response;
      } catch (err: any) {
        clearTimeout(timeout);
        if (retries > 0 && (err.name === 'AbortError' || err.message.includes('timeout'))) {
          console.log(`[Weather Proxy] Retrying... (${retries} left)`);
          return fetchWithRetry(retries - 1);
        }
        throw err;
      }
    };

    try {
      const response = await fetchWithRetry();
      
      if (!response.ok) {
        throw new Error(`Weather API returned ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      const isTimeout = err.name === 'AbortError' || err.message?.includes('timeout');
      console.error('[Weather Proxy] Error:', isTimeout ? 'Timeout after retries' : err.message);
      
      // Return fallback data for Itanhaém/Cananéia region if API is down
      res.json({
        current_weather: {
          temperature: 24.5,
          windspeed: 12.3,
          winddirection: 180,
          weathercode: 1, // Clear/Mainly clear
          time: new Date().toISOString()
        },
        fallback: true
      });
    }
  });

  // Endpoint to fetch images for a single room
  app.get('/api/room-images', async (req, res) => {
    res.json({ images: [] });
  });

  // Endpoint to return the entire rooms list with clean, non-corrupted images
  app.get('/api/rooms', async (req, res) => {
    try {
      res.json(INITIAL_ROOMS);
    } catch (err) {
      console.error('[API Rooms] Error compiling room list:', err);
      res.status(500).json({ error: 'Internal Server Error' });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
