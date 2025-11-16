import axios from "axios";

const API_BASE = "http://localhost:4000/api/news";

export const fetchNews = async ({
  category,
  q,
  page = 1,
  pageSize = 20,
  country = "in"
} = {}) => {
  const params = {};

  if (category) params.category = category;
  if (q) params.q = q;

  params.page = page;
  params.pageSize = pageSize;

  // Only attach country if not a search as news api ignores country for search
  if (!q) params.country = country;

  const res = await axios.get(API_BASE, { params });
  return res.data;
};
