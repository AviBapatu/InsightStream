import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const NEWS_API_KEY = process.env.NEWS_API_KEY;

// In-memory cache
const cache = new Map();

// TTL rules (in ms)
const TTL = {
  homepage: 5 * 60 * 1000, // 5 minutes
  category: 3 * 60 * 1000, // 3 minutes
  search: 15 * 1000, // 15 seconds
};

const buildKey = (params) => JSON.stringify(params);

app.get("/api/news", async (req, res) => {
  try {
    const {
      // Common params
      q,
      page = 1,
      pageSize = 20,

      // Top Headlines params
      country = "us",
      category,

      // Everything (search) params
      language,
      sortBy,
      searchIn,
      from,
      to,
      sources,
      domains,
      excludeDomains,
    } = req.query;

    // Determine mode: if q exists with search filters, use "everything", else "top-headlines"
    const isSearchMode =
      q &&
      (language ||
        sortBy ||
        searchIn ||
        from ||
        to ||
        sources ||
        domains ||
        excludeDomains);

    const mode = isSearchMode
      ? "search"
      : q
      ? "search"
      : category
      ? "category"
      : "homepage";

    const endpoint =
      isSearchMode || q
        ? "https://newsapi.org/v2/everything"
        : "https://newsapi.org/v2/top-headlines";

    // Build params based on mode
    let params = {
      apiKey: NEWS_API_KEY,
      page,
      pageSize,
    };

    if (endpoint.includes("top-headlines")) {
      // TOP HEADLINES MODE
      params = {
        ...params,
        country,
        category: category || undefined,
        q: q || undefined,
      };
    } else {
      // EVERYTHING (SEARCH) MODE
      params = {
        ...params,
        q: q || undefined,
        language: language || undefined,
        sortBy: sortBy || "publishedAt",
        searchIn: searchIn || undefined,
        from: from || undefined,
        to: to || undefined,
        sources: sources || undefined,
        domains: domains || undefined,
        excludeDomains: excludeDomains || undefined,
      };
    }

    // Remove undefined values
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined) delete params[key];
    });

    const cacheKey = buildKey(params);
    const cached = cache.get(cacheKey);

    if (cached && cached.expires > Date.now()) {
      return res.json({ ...cached.data, cached: true });
    }

    const response = await axios.get(endpoint, { params });

    cache.set(cacheKey, {
      data: response.data,
      expires: Date.now() + TTL[mode],
    });

    return res.json({ ...response.data, cached: false });
  } catch (err) {
    console.error("Proxy error:", err.response?.data || err.message);

    if (err.response?.status === 429) {
      const stale = [...cache.values()][0];
      if (stale) {
        return res.json({ ...stale.data, stale: true });
      }
      return res.status(429).json({ error: "Rate limit exceeded" });
    }

    res.status(500).json({
      error: "Failed to fetch news",
      details: err.response?.data?.message || err.message,
    });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`NewsAPI proxy server is up Baby! ${PORT}`));
