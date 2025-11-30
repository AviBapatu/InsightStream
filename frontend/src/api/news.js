import axios from "axios";

const API_BASE = "http://localhost:4000/api/news";

export const fetchNews = async ({
  // Common params
  q,
  page = 1,
  pageSize = 20,

  // Top Headlines params
  category,
  country = "us",

  // Everything (search) params
  language,
  sortBy,
  searchIn,
  from,
  to,
  sources,
  domains,
  excludeDomains,
} = {}) => {
  const params = {
    page,
    pageSize,
  };

  // Add search query if exists
  if (q) params.q = q;

  // If it's search mode (q exists), use search-specific params
  if (q) {
    if (language) params.language = language;
    if (sortBy) params.sortBy = sortBy;
    if (searchIn) params.searchIn = searchIn;
    if (from) params.from = from;
    if (to) params.to = to;
    if (sources) params.sources = sources;
    if (domains) params.domains = domains;
    if (excludeDomains) params.excludeDomains = excludeDomains;
  } else {
    // Top Headlines mode
    if (category) params.category = category;
    params.country = country;
  }

  const res = await axios.get(API_BASE, { params });
  return res.data;
};
