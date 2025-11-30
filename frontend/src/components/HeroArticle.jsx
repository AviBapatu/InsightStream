import { useNavigate } from "react-router-dom";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useReaderStore } from "../store/useReaderStore";
import { useAuthStore } from "../store/useAuthStore";
import { useBookmarksStore } from "../store/useBookmarksStore";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion } from "framer-motion";

dayjs.extend(relativeTime);

const HeroArticle = ({ article }) => {
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

  // Extract category from article data if available
  const category = article.source?.name || "Featured";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-6xl mx-auto px-4 mt-4 mb-6"
    >
      <div
        onClick={handleClick}
        className="
          rounded-xl overflow-hidden 
          bg-white border border-gray-200
          shadow-sm hover:shadow-md
          transition-all duration-300 
          hover:-translate-y-0.5
          cursor-pointer
          group
        "
      >
        {/* Hero Image */}
        <div className="relative w-full aspect-5/2 md:aspect-7/2 bg-gray-100 overflow-hidden">
          {article.urlToImage ? (
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className="
              absolute top-4 right-4 
              text-3xl
              transition-all duration-200
              hover:scale-125
              active:scale-95
              leading-none
              z-10
            "
            style={{
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
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
        <div className="p-4 md:p-5">
          {/* Category Badge */}
          <div className="mb-2">
            <span
              className="
              text-xs uppercase tracking-wider font-medium
              text-gold-600
            "
            >
              {category}
            </span>
          </div>

          {/* Title */}
          <h1
            className="
            text-lg md:text-xl lg:text-2xl
            font-bold text-gray-900
            leading-snug
            line-clamp-2
            mb-2
          "
          >
            {article.title}
          </h1>

          {/* Description (Desktop only) */}
          {isDesktop && article.description && (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-1 mb-2">
              {article.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{article.source?.name}</span>
            <span>·</span>
            <span>{dayjs(article.publishedAt).fromNow()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroArticle;
