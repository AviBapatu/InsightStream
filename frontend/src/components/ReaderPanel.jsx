import { motion, AnimatePresence } from "framer-motion";
import { useReaderStore } from "../store/useReaderStore";
import { useEffect, useState } from "react";
import { useBookmarksStore } from "../store/useBookmarksStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  IoArrowBack,
  IoOpenOutline,
  IoShareSocialOutline,
  IoArrowUp,
  IoImageOutline,
} from "react-icons/io5";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const ReaderPanel = () => {
  const { article, isOpen, closeReader } = useReaderStore();
  const { bookmarks, addBookmark, removeBookmark } = useBookmarksStore();
  const { token, user } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const isBookmarked = article
    ? bookmarks.some((b) => b.article?.url === article.url)
    : false;

  // Disable background scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  // Reset image loaded state when article changes
  useEffect(() => {
    setImageLoaded(false);
    setScrolled(false);
    setShowScrollTop(false);
  }, [article]);

  // Handle scroll behavior
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    setScrolled(scrollTop > 20);
    setShowScrollTop(scrollTop > 400);
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = async () => {
    if (!article || bookmarkLoading) return;

    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        const bookmark = bookmarks.find((b) => b.article?.url === article.url);
        if (bookmark) {
          await removeBookmark(bookmark.id, token);
        }
      } else {
        await addBookmark(article, token);
      }
    } catch (error) {
      console.error("Bookmark toggle failed:", error);
    } finally {
      setBookmarkLoading(false);
    }
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeReader();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, closeReader]);

  // Scroll to top function
  const scrollToTop = () => {
    const panel = document.getElementById("reader-panel-content");
    if (panel) {
      panel.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Share function
  const handleShare = async () => {
    if (!article) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(article.url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && article && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={closeReader}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Sliding Panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              opacity: { duration: 0.25 },
            }}
            className="
              fixed right-0 top-0 h-screen
              bg-white z-50 
              w-full 
              lg:w-[50vw] lg:max-w-[820px]
              shadow-[0_0_25px_rgba(0,0,0,0.15)]
            "
          >
            {/* Scrollable Content Container */}
            <div
              id="reader-panel-content"
              onScroll={handleScroll}
              className="h-full overflow-y-auto scroll-smooth reader-scrollbar"
            >
              {/* Top Bar (Sticky Header) */}
              <div
                className={`
                  sticky top-0 z-10 bg-white
                  h-14 px-4 
                  flex items-center justify-between gap-3
                  border-b border-gray-200
                  transition-shadow duration-200
                  ${scrolled ? "shadow-sm" : ""}
                `}
              >
                {/* Back Button */}
                <button
                  onClick={closeReader}
                  className="
                    flex items-center justify-center
                    w-9 h-9 rounded-full
                    text-gray-600 hover:text-gray-900
                    hover:bg-gold-50 hover:ring-2 hover:ring-gold-500/20
                    transition-all duration-200
                    active:scale-95
                  "
                  aria-label="Close reader"
                >
                  <IoArrowBack className="w-5 h-5" />
                </button>

                {/* Source Badge */}
                <button
                  onClick={() => window.open(article.url, "_blank")}
                  className="
                    flex-1 min-w-0
                    px-3 py-1.5 rounded-full
                    bg-gray-50 hover:bg-gray-100
                    text-gray-700 text-sm font-medium
                    truncate
                    transition-colors duration-200
                  "
                  title={`Read on ${article.source?.name}`}
                >
                  {article.source?.name || "Source"}
                </button>

                {/* Bookmark Button */}
                <button
                  onClick={handleBookmarkToggle}
                  disabled={bookmarkLoading || !user}
                  className={`
                    flex items-center justify-center
                    w-9 h-9 rounded-full
                    transition-all duration-200
                    active:scale-95
                    ${
                      isBookmarked
                        ? "text-gold-600 hover:text-gold-700 hover:bg-gold-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }
                    ${bookmarkLoading ? "opacity-50 cursor-wait" : ""}
                    disabled:opacity-40 disabled:cursor-not-allowed
                  `}
                  aria-label={isBookmarked ? "Remove bookmark" : "Save article"}
                  title={
                    !user
                      ? "Sign in to save articles"
                      : isBookmarked
                      ? "Saved"
                      : "Save article"
                  }
                >
                  {isBookmarked ? (
                    <AiFillHeart className="w-5 h-5" />
                  ) : (
                    <AiOutlineHeart className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Hero Image */}
              {article.urlToImage ? (
                <div
                  className="relative aspect-video w-full overflow-hidden"
                  style={{
                    backgroundColor: "var(--color-background-secondary)",
                  }}
                >
                  <motion.img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: imageLoaded ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      e.target.style.display = "none";
                      setImageLoaded(true);
                    }}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IoImageOutline
                        className="w-16 h-16"
                        style={{ color: "var(--color-border-secondary)" }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="aspect-video w-full flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--color-background-secondary)",
                  }}
                >
                  <IoImageOutline
                    className="w-16 h-16"
                    style={{ color: "var(--color-border-secondary)" }}
                  />
                </div>
              )}

              {/* Article Title Block */}
              <div className="px-6 py-5 space-y-2">
                <h1
                  className="text-2xl font-bold leading-tight line-clamp-4"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {article.title}
                </h1>

                {/* Metadata */}
                <div
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {article.author && (
                    <>
                      <span className="truncate max-w-[150px]">
                        {article.author}
                      </span>
                      <span>·</span>
                    </>
                  )}
                  <span>{dayjs(article.publishedAt).fromNow()}</span>
                  {article.source?.category && (
                    <>
                      <span>·</span>
                      <span className="capitalize">
                        {article.source.category}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Article Body */}
              <div className="px-6 py-4 space-y-4">
                {/* First paragraph - slightly larger */}
                {article.description && (
                  <p
                    className="text-lg font-medium leading-[1.65] first-letter:text-2xl first-letter:font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {article.description}
                  </p>
                )}

                {/* Additional content */}
                {article.content && article.content !== article.description && (
                  <div
                    className="space-y-4 text-base leading-[1.65]"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {article.content.split("\n\n").map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                )}

                {/* Read full article notice */}
                <div className="pt-4 pb-2">
                  <p
                    className="text-sm italic"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    This is a preview. Visit the source to read the full
                    article.
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div
                className="px-6 py-6 space-y-3 border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                {/* Primary Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => window.open(article.url, "_blank")}
                    className="
                      flex-1 flex items-center justify-center gap-2
                      px-4 py-2.5 rounded-xl
                      text-white font-medium text-sm
                      transition-all duration-200
                      active:scale-[0.98]
                      shadow-sm hover:shadow-md
                    "
                    style={{ backgroundColor: "var(--color-primary-600)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--color-primary-700)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--color-primary-600)")
                    }
                  >
                    <IoOpenOutline className="w-5 h-5" />
                    <span>Open in Browser</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="
                      flex items-center justify-center
                      w-11 h-11 rounded-xl
                      transition-all duration-200
                      active:scale-95
                    "
                    style={{
                      backgroundColor: "var(--color-background-secondary)",
                      color: "var(--color-text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--color-background-tertiary)";
                      e.currentTarget.style.color = "var(--color-text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--color-background-secondary)";
                      e.currentTarget.style.color =
                        "var(--color-text-secondary)";
                    }}
                    aria-label="Share article"
                  >
                    <IoShareSocialOutline className="w-5 h-5" />
                  </button>
                </div>

                {/* Secondary info */}
                <div className="text-xs text-gray-400 text-center">
                  Published by {article.source?.name} ·{" "}
                  {dayjs(article.publishedAt).format("MMM D, YYYY")}
                </div>
              </div>

              {/* Bottom spacing */}
              <div className="h-8"></div>
            </div>

            {/* Scroll to Top Button */}
            <AnimatePresence>
              {showScrollTop && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={scrollToTop}
                  className="
                    fixed bottom-6 right-6
                    w-12 h-12 rounded-full
                    bg-gold-600 hover:bg-gold-700
                    text-white
                    shadow-lg hover:shadow-xl
                    transition-all duration-200
                    active:scale-95
                    z-20
                  "
                  aria-label="Scroll to top"
                >
                  <IoArrowUp className="w-6 h-6 mx-auto" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReaderPanel;
