import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const NEWS_API_KEY = process.env.NEWSAPI_KEY;

// In-memory cache
const cache = new Map();

// TTL rules (in ms)
const TTL = {
  homepage: 5 * 60 * 1000,      // 5 minutes
  category: 3 * 60 * 1000,      // 3 minutes
  search: 15 * 1000             // 15 seconds
};

const buildKey = (params) => JSON.stringify(params);

app.get("/api/news", async (req, res) => {
  try {
    const { q, category, page = 1, pageSize = 20, country = "in" } = req.query;

    const mode = q
      ? "search"
      : category
      ? "category"
      : "homepage";

    const endpoint =
      q
        ? "https://newsapi.org/v2/everything"
        : "https://newsapi.org/v2/top-headlines";

    // Build params
    const params = {
      apiKey: NEWS_API_KEY,
      q: q || undefined,
      category: category || undefined,
      page,
      pageSize,
      country: q ? undefined : country,
      sortBy: q ? "publishedAt" : undefined
    };

    const cacheKey = buildKey(params);
    const cached = cache.get(cacheKey);

    if (cached && cached.expires > Date.now()) {
      return res.json({ ...cached.data, cached: true });
    }

    const response = await axios.get(endpoint, { params });

    cache.set(cacheKey, {
      data: response.data,
      expires: Date.now() + TTL[mode]
    });

    return res.json({ ...response.data, cached: false });

  } catch (err) {
    console.error(err);

    if (err.response?.status === 429) {
      const stale = [...cache.values()][0];
      if (stale) {
        return res.json({ ...stale.data, stale: true });
      }
      return res.status(429).json({ error: "Rate limit exceeded" });
    }

    res.status(500).json({ error: "Failed to fetch news" });
  }
});

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`NewsAPI proxy server is up Baby! ${PORT}`)
);
