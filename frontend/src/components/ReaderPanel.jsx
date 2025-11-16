import { motion, AnimatePresence } from "framer-motion";
import { useReaderStore } from "../store/useReaderStore";
import { useEffect } from "react";

const ReaderPanel = () => {
  const { article, isOpen, closeReader } = useReaderStore();

  // Disable background scroll when the panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen || !article) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={closeReader}
        className="fixed inset-0 bg-black z-40"
      />

      {/* Sliding Panel */}
      <motion.div
        key="panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
        className="
          fixed right-0 top-0 h-full 
          bg-white shadow-xl z-50 
          overflow-y-auto 
          w-full 
          lg:w-1/2 
          xl:w-[45%] 
          2xl:w-[40%]
          border-l border-gray-200
        "
      >
        {/* Content */}
        <div className="pb-20">

          {/* Close button */}
          <div className="p-4 border-b border-gray-200 flex justify-end">
            <button
              onClick={closeReader}
              className="text-gray-500 hover:text-gray-800 text-sm"
            >
              Close ✕
            </button>
          </div>

          {/* Hero Image */}
          {article.urlToImage && (
            <div className="aspect-video w-full bg-gray-200">
              <img
                src={article.urlToImage}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title block */}
          <div className="p-6 space-y-3">
            <h1 className="text-2xl font-semibold leading-tight text-gray-900">
              {article.title}
            </h1>

            <div className="text-sm text-gray-500">
              {article.source?.name} ·{" "}
              {new Date(article.publishedAt).toLocaleString()}
            </div>
          </div>

          {/* Description */}
          <div className="px-6">
            <p className="text-gray-800 leading-relaxed text-[15px]">
              {article.description || "No description available."}
            </p>
          </div>

          {/* Read Original */}
          <div className="p-6">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-block mt-4 text-gold-700 
                border border-gold-700 
                px-4 py-2 rounded-lg 
                hover:bg-gold-700 hover:text-white
                transition-all duration-200
              "
            >
              Read Full Article →
            </a>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReaderPanel;
