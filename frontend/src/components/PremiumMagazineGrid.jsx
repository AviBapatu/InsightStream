import { motion } from "framer-motion";
import NewsCard from "./NewsCard";

const PremiumMagazineGrid = ({ articles = [], loading }) => {
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
            <PremiumNewsCard 
              article={article} 
              variant={getCardVariant(idx)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Enhanced NewsCard for Premium Magazine Grid
import { useNavigate } from "react-router-dom";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useReaderStore } from "../store/useReaderStore";
import { useAuthStore } from "../store/useAuthStore";
import { useBookmarksStore } from "../store/useBookmarksStore";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const PremiumNewsCard = ({ article, variant = "small" }) => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const openReader = useReaderStore((s) => s.openReader);
  
  const token = useAuthStore((s) => s.token);
  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const addBookmark = useBookmarksStore((s) => s.addBookmark);
  const removeBookmark = useBookmarksStore((s) => s.removeBookmark);

  const isSaved = bookmarks.some((b) => b.article.url === article.url);

  const handleClick = () => {
    const desktopNow = window.matchMedia("(min-width: 1024px)").matches;
    
    if (desktopNow) {
      openReader(article);
      return;
    }
    
    const safeId = encodeURIComponent(article.url);
    navigate(`/article/${safeId}`, { state: { article } });
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (isSaved) {
      await removeBookmark(article.url, token);
    } else {
      await addBookmark(article, token);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="
        h-full
        rounded-2xl overflow-hidden 
        bg-white border border-gray-200
        shadow-sm hover:shadow-lg
        transition-all duration-300 
        hover:-translate-y-0.5
        cursor-pointer
        group
        flex flex-col
      "
    >
      {/* Image */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className="
            absolute top-3 right-3 
            text-2xl
            transition-all duration-200
            hover:scale-125
            active:scale-95
            leading-none
            z-10
          "
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
        >
          {isSaved ? (
            <AiFillHeart className="text-[#B7892E]" />
          ) : (
            <AiOutlineHeart className="text-white" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col grow">
        {/* Category */}
        {variant === "large" && (
          <div className="mb-2">
            <span className="text-xs uppercase tracking-wider font-medium text-gold-600">
              {article.source?.name || "News"}
            </span>
          </div>
        )}

        {/* Title */}
        <h3
          className={`
            font-semibold text-gray-900 
            leading-snug tracking-tight 
            line-clamp-3
            grow
            ${variant === "large" ? "text-xl md:text-2xl" : "text-base md:text-lg"}
          `}
        >
          {article.title}
        </h3>

        {/* Description - Large cards only on desktop */}
        {variant === "large" && isDesktop && article.description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mt-2">
            {article.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
          {variant === "small" && <span>{article.source?.name}</span>}
          {variant === "small" && <span>·</span>}
          <span>{dayjs(article.publishedAt).fromNow()}</span>
        </div>
      </div>
    </div>
  );
};

export default PremiumMagazineGrid;
