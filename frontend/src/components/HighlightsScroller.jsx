import { useNavigate } from "react-router-dom";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useReaderStore } from "../store/useReaderStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion } from "framer-motion";

dayjs.extend(relativeTime);

const HighlightsScroller = ({ articles }) => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const openReader = useReaderStore((s) => s.openReader);

  if (!articles || articles.length === 0) return null;

  const handleClick = (article) => {
    const desktopNow = window.matchMedia("(min-width: 1024px)").matches;
    
    if (desktopNow) {
      openReader(article);
      return;
    }
    
    const safeId = encodeURIComponent(article.url);
    navigate(`/article/${safeId}`, { state: { article } });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-6 md:mt-10">
      {/* Section Title */}
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 tracking-tight">
        Today's Highlights
      </h2>

      {/* Horizontal Scroller */}
      <div 
        className="
          flex gap-4 md:gap-6 
          overflow-x-auto 
          snap-x snap-mandatory
          scrollbar-hide
          pb-2
        "
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {articles.slice(0, 4).map((article, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            onClick={() => handleClick(article)}
            className="
              shrink-0 
              w-[70vw] sm:w-[45vw] md:w-[280px] lg:w-[320px]
              snap-start
              cursor-pointer
              group
            "
          >
            {/* Card */}
            <div className="
              relative rounded-xl overflow-hidden 
              shadow-xs hover:shadow-lg
              transition-all duration-300
              active:scale-95 md:hover:scale-[1.02]
              h-full
            ">
              {/* Image with Overlay */}
              <div className="relative aspect-3/2 bg-gray-100">
                {article.urlToImage ? (
                  <>
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="
                      absolute inset-0 
                      bg-linear-to-t from-black/80 via-black/40 to-transparent
                      group-hover:from-black/90 group-hover:via-black/50
                      transition-all duration-300
                    "/>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="
                    text-white font-medium text-base md:text-lg
                    leading-snug line-clamp-2
                  ">
                    {article.title}
                  </h3>
                  
                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-xs text-white/80 mt-2">
                    <span>{article.source?.name}</span>
                    <span>·</span>
                    <span>{dayjs(article.publishedAt).fromNow()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default HighlightsScroller;
