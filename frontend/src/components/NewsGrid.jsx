import NewsCard from "./NewsCard";

const NewsGrid = ({ articles = [], loading }) => {
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {articles.map((article, i) => (
        <NewsCard key={i} article={article} index={i} />
      ))}
    </div>
  );
};

export default NewsGrid;