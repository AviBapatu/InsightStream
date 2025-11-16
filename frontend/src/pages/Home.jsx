import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import NewsGrid from "../components/NewsGrid";
import { fetchNews } from "../api/news";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews({ country: "us" }).then((data) => {
      setArticles(data.articles || []);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Navbar />
      <CategoryBar />
      <NewsGrid articles={articles} loading={loading} />
    </>
  );
};

export default Home;
