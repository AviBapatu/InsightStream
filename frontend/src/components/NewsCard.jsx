import { useNavigate } from "react-router-dom";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useReaderStore } from "../store/useReaderStore";
import { useAuthStore } from "../store/useAuthStore";
import { useBookmarksStore } from "../store/useBookmarksStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const NewsCard = ({ article, mode = "default", savedData }) => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const openReader = useReaderStore((s) => s.openReader);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const addBookmark = useBookmarksStore((s) => s.addBookmark);
  const removeBookmark = useBookmarksStore((s) => s.removeBookmark);

  // -------------------------
  // IS SAVED?
  // reactive — updates star instantly
  // -------------------------
  const isSaved = bookmarks.some((b) => b.article.url === article.url);

  // -------------------------
  // CLICK BEHAVIOR
  // -------------------------
  const handleClick = () => {
    if (mode === "saved") {
      navigate(`/article/${savedData?.id || article.url}`, {
        state: { article },
      });
      return;
    }

    // Default mode
    if (isDesktop) {
      openReader(article);
    } else {
      navigate(`/article/${article.url}`, { state: { article } });
    }
  };

  // -------------------------
  // REMOVE SAVED
  // -------------------------
  const onRemove = async (e) => {
    e.stopPropagation();
    if (!savedData) return;
    await removeBookmark(savedData.id || savedData.article.url, token);
  };

  // -------------------------
  // CARD CLASSES
  // -------------------------
  const baseClasses =
    "rounded-2xl overflow-hidden bg-white border border-gray-200 transition-all duration-300";

  const hoverClasses =
    mode === "default"
      ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      : "cursor-pointer";

  return (
    <div className={`${baseClasses} ${hoverClasses}`} onClick={handleClick}>
      {/* IMAGE */}
      <div className="aspect-video bg-gray-200">
        {article.urlToImage && (
          <img
            src={article.urlToImage}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5 relative">
        {/* TITLE */}
        <h3 className="font-medium text-lg md:text-xl text-gray-900 leading-snug tracking-tight line-clamp-3">
          {article.title}
        </h3>

        {/* DEFAULT MODE META */}
        {mode === "default" && (
          <div className="text-[11px] md:text-xs text-gray-500 mt-3">
            {article.source?.name} · {dayjs(article.publishedAt).fromNow()}
          </div>
        )}

        {/* SAVED MODE META */}
        {mode === "saved" && savedData && (
          <div className="text-[11px] md:text-xs text-gray-500 mt-3">
            Saved · {dayjs(savedData.savedAt).fromNow()}
          </div>
        )}

        {/* SAVE BUTTON — DEFAULT MODE */}
        {mode === "default" && (
          <button
            onClick={async (e) => {
              e.stopPropagation();

              if (isSaved) {
                // remove bookmark
                await removeBookmark(article.url, token);
              } else {
                // add bookmark
                await addBookmark(article, token);
              }
            }}
            className="
              absolute top-4 right-4 
              bg-white/90 backdrop-blur-sm shadow 
              w-8 h-8 rounded-full 
              flex items-center justify-center
              hover:bg-white 
              transition-all duration-200
              active:scale-90
            "
          >
            {isSaved ? "★" : "☆"}
          </button>
        )}

        {/* REMOVE BUTTON — SAVED MODE */}
        {mode === "saved" && (
          <button
            onClick={onRemove}
            className="
              absolute top-4 right-4 
              bg-white border border-gray-300 
              w-7 h-7 rounded-full 
              text-sm text-gray-700 
              flex items-center justify-center
              hover:bg-gray-100
              transition
            "
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default NewsCard;
