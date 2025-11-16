import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import NewsGrid from "../components/NewsGrid";
import { fetchNews } from "../api/news";
import { useReaderStore } from "../store/useReaderStore";


const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("General");
  const closeReader = useReaderStore((s) => s.closeReader);


  useEffect(() => {
    closeReader();
    setLoading(true);

    fetchNews({
      country: "us",
      category:
        activeCategory.toLowerCase() === "top stories"
          ? undefined
          : activeCategory.toLowerCase(),
    }).then((data) => {
      setArticles(data.articles || []);
      setLoading(false);
    });
  }, [activeCategory]);

  return (
    <>
      <Navbar />
      <CategoryBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <NewsGrid articles={articles} loading={loading} />
    </>
  );
};

export default Home;
