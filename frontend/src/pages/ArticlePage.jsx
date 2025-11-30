import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useBookmarksStore } from "../store/useBookmarksStore";
import { useGuestBookmarksStore } from "../store/useGuestBookmarksStore";
import {
  IoArrowBack,
  IoShareSocialOutline,
  IoOpenOutline,
} from "react-icons/io5";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { readingStats } from "../utils/readingStats";

// Utility function for relative time
const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count}${interval.label.charAt(0)} ago`;
    }
  }

  return "just now";
};

// Split long paragraphs for better readability
const formatContent = (text) => {
  if (!text) return [];

  const paragraphs = text.split("\n\n");
  const formatted = [];

  paragraphs.forEach((para) => {
    if (para.trim().length > 600) {
      // Split long paragraphs at sentence boundaries
      const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
      let chunk = "";

      sentences.forEach((sentence) => {
        if ((chunk + sentence).length > 500 && chunk.length > 0) {
          formatted.push(chunk.trim());
          chunk = sentence;
        } else {
          chunk += sentence;
        }
      });

      if (chunk.trim()) {
        formatted.push(chunk.trim());
      }
    } else if (para.trim()) {
      formatted.push(para.trim());
    }
  });

  return formatted;
};

const ArticlePage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const article = state?.article;

  const { user, token } = useAuthStore();
  const {
    addBookmark: addAuthBookmark,
    removeBookmark: removeAuthBookmark,
    bookmarks: authBookmarks,
  } = useBookmarksStore();
  const {
    add: addGuestBookmark,
    remove: removeGuestBookmark,
    isSaved: isGuestSaved,
  } = useGuestBookmarksStore();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(80); // 80% initially
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // For smooth slide-up animation

  const sheetRef = useRef(null);
  const dragHandleRef = useRef(null);

  // Trigger slide-up animation on mount
  useEffect(() => {
    // Small delay to ensure DOM is ready for smooth animation
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsOpen(true);
      }, 50);
    });
  }, []);

  // If user refreshes or comes without state, redirect to home
  if (!article) {
    navigate("/home");
    return null;
  }

  // Track article read
  useEffect(() => {
    if (article?.url) {
      readingStats.trackRead(article.url);
    }
  }, [article]);

  // Check if article is bookmarked
  useEffect(() => {
    if (user) {
      const saved = authBookmarks.some((b) => b.article.url === article.url);
      setIsBookmarked(saved);
    } else {
      setIsBookmarked(isGuestSaved(article.url));
    }
  }, [user, authBookmarks, article.url, isGuestSaved]);

  // Handle bookmark toggle
  const handleBookmarkToggle = async () => {
    setBookmarkLoading(true);

    try {
      if (user) {
        // Authenticated user
        if (isBookmarked) {
          await removeAuthBookmark(article.url, token);
        } else {
          await addAuthBookmark(article, token);
        }
      } else {
        // Guest user
        if (isBookmarked) {
          removeGuestBookmark(article.url);
        } else {
          addGuestBookmark(article);
        }
      }

      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Bookmark toggle error:", error);
    } finally {
      setBookmarkLoading(false);
    }
  };

  // Handle share
  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.description || article.title,
      url: article.url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(article.url);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  // Format content paragraphs
  const contentParagraphs = formatContent(
    article.description || article.content
  );

  // Handle drag start
  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartY(e.type === "touchstart" ? e.touches[0].clientY : e.clientY);
    setCurrentY(e.type === "touchstart" ? e.touches[0].clientY : e.clientY);
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (!isDragging) return;

    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    setCurrentY(clientY);

    const deltaY = clientY - startY;
    const windowHeight = window.innerHeight;
    const newHeight = Math.max(
      20,
      Math.min(100, 80 - (deltaY / windowHeight) * 100)
    );

    setSheetHeight(newHeight);
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const deltaY = currentY - startY;

    // If dragged down more than 100px, close the sheet
    if (deltaY > 100) {
      closeSheet();
    }
    // If dragged up more than 100px, open original site and close sheet
    else if (deltaY < -100) {
      window.open(article.url, "_blank");
      closeSheet();
    }
    // Otherwise snap back to 80%
    else {
      setSheetHeight(80);
    }
  };

  // Smooth close function
  const closeSheet = () => {
    setIsOpen(false);
    setTimeout(() => navigate(-1), 350);
  };

  // Add event listeners
  useEffect(() => {
    const handleMouseMove = (e) => handleDragMove(e);
    const handleMouseUp = () => handleDragEnd();

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleMouseMove);
      document.addEventListener("touchend", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleMouseMove);
        document.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isDragging, startY, currentY]);

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-350 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeSheet}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 flex flex-col overflow-hidden ${
          isDragging ? "" : "transition-all duration-350 ease-out"
        }`}
        style={{
          height: `${sheetHeight}vh`,
          transform: isDragging
            ? `translateY(${Math.max(0, currentY - startY)}px)`
            : isOpen
            ? "translateY(0)"
            : "translateY(100%)",
        }}
      >
        {/* Drag Handle Area */}
        <div
          ref={dragHandleRef}
          className="sticky top-0 z-10 bg-white pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          {/* Drag Indicator */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3" />

          {/* Header with Back Button */}
          <div className="px-4 flex items-center">
            <button
              onClick={closeSheet}
              className="flex items-center justify-center w-11 h-11 -ml-2 text-gray-800 active:scale-95 transition-transform"
              aria-label="Go back"
            >
              <IoArrowBack size={22} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Image */}
          {article.urlToImage && !imageError ? (
            <div className="relative h-60 w-full bg-gray-200">
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            </div>
          ) : (
            <div className="h-60 w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No image available</span>
            </div>
          )}

          {/* Title Block */}
          <div className="px-5 py-4">
            <h1
              className="text-[22px] font-semibold leading-snug text-gray-900"
              style={{ letterSpacing: "-0.5px" }}
            >
              {article.title}
            </h1>
          </div>

          {/* Source & Time Row */}
          <div className="px-5 flex items-center gap-2 text-sm text-gray-500">
            <span>{article.source?.name || "Unknown Source"}</span>
            <span>•</span>
            <span>{getRelativeTime(article.publishedAt)}</span>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-gray-200 mx-5" />

          {/* Article Content Body */}
          <div className="px-5 pb-6">
            {contentParagraphs.length > 0 ? (
              contentParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[16px] leading-[1.7] text-[#222] font-normal mb-4"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-[16px] leading-[1.7] text-gray-500 font-normal mb-4">
                No content available. Please read the full article for more
                details.
              </p>
            )}
          </div>

          {/* Bottom spacing */}
          <div className="h-20" />
        </div>

        {/* Fixed Action Bar at Bottom */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-4 flex items-center justify-center gap-8">
          {/* Bookmark Action */}
          <button
            onClick={handleBookmarkToggle}
            disabled={bookmarkLoading}
            className="flex items-center gap-1.5 text-gray-700 active:scale-90 transition-all"
          >
            {isBookmarked ? (
              <AiFillHeart size={20} className="text-[#B7892E]" />
            ) : (
              <AiOutlineHeart size={20} />
            )}
            <span className="text-sm">{isBookmarked ? "Saved" : "Save"}</span>
          </button>

          {/* Share Action */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-gray-700 active:scale-90 transition-all"
          >
            <IoShareSocialOutline size={20} />
            <span className="text-sm">Share</span>
          </button>

          {/* Open in Browser Action */}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              // Let the link open, then close the sheet
              setTimeout(closeSheet, 100);
            }}
            className="flex items-center gap-1.5 text-gray-700 active:scale-90 transition-all"
          >
            <IoOpenOutline size={20} />
            <span className="text-sm">Open</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;
