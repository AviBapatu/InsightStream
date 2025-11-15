import NewsCard from "./NewsCard";

const NewsGrid = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-67 md:gap-8">
      <NewsCard />
      <NewsCard />
      <NewsCard />
      <NewsCard />
      <NewsCard />
    </div>
  );
};

export default NewsGrid;
