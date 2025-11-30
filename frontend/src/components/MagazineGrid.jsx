import { motion } from "framer-motion";
import NewsCard from "./NewsCard";

const MagazineGrid = ({ articles = [], loading }) => {
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`
                h-96 bg-gray-200 animate-pulse rounded-2xl
                ${i % 3 === 0 ? "lg:col-span-6" : "lg:col-span-3"}
              `}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) return null;

  // Helper to determine card size based on Pattern B
  const getCardSize = (index) => {
    // Pattern B: Row 1: [BIG, small, small], Row 2: [small, BIG, small], Row 3: [small, small, BIG]
    const pattern = index % 6;

    // Desktop grid classes
    if (pattern === 0 || pattern === 4) return "lg:col-span-6"; // Big card positions
    return "lg:col-span-3"; // Small card positions
  };

  const getCardVariant = (index) => {
    const pattern = index % 6;
    return pattern === 0 || pattern === 4 ? "large" : "small";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8 md:mt-12">
      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 auto-rows-fr">
        {articles.map((article, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className={`
              ${getCardSize(idx)}
              md:col-span-1
            `}
          >
            <NewsCard article={article} variant={getCardVariant(idx)} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MagazineGrid;
