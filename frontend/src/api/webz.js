import axios from "axios";

const API_KEY = import.meta.env.VITE_WEBZ_API_KEY;

export const fetchNews = async () => {
  const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=KEY`;

  const res = await axios.get(url);
  return res.data.articles || [];
};
