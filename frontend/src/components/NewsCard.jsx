import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useIsDesktop } from "../hooks/useIsDesktop";
import { useReaderStore } from "../store/useReaderStore";

import { useAuthStore } from "../store/useAuthStore";
import { useBookmarksStore } from "../store/useBookmarksStore"; 
import { useGuestBookmarksStore } from "../store/useGuestBookmarksStore";

import GuestSaveDialog from "./modals/GuestSaveDialog";

const NewsCard = ({ article, index }) => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const openReader = useReaderStore((s) => s.openReader);

  // Auth state
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  // Permanent bookmark system
  const addBookmark = useBookmarksStore((s) => s.addBookmark);
  const removeBookmark = useBookmarksStore((s) => s.removeBookmark);
  const permanentBookmarks = useBookmarksStore((s) => s.bookmarks);

  // Guest bookmark system
  const guestAdd = useGuestBookmarksStore((s) => s.add);
  const guestRemove = useGuestBookmarksStore((s) => s.remove);
  const guestIsSaved = useGuestBookmarksStore((s) => s.isSaved);
  const guestBookmarks = useGuestBookmarksStore((s) => s.bookmarks);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);

  // Determine saved state
  const isPermanentSaved = !!permanentBookmarks.find(
    (b) => b.article.url === article.url
  );
  const isGuestSaved = guestIsSaved(article.url);

  const isSaved = isPermanentSaved || isGuestSaved;

  // Handle save click
  const handleBookmark = async (e) => {
    e.stopPropagation();

    if (user) {
      // LOGGED-IN: Permanent bookmark
      if (isPermanentSaved) {
        const target = permanentBookmarks.find(
          (b) => b.article.url === article.url
        );
        await removeBookmark(target?.id ?? article.url, token);
      } else {
        await addBookmark(article, token);
      }
      return;
    }

    // NOT LOGGED-IN → Open dialog
    setDialogOpen(true);
  };

  // Guest continues without login
  const guestContinue = () => {
    if (isGuestSaved) {
      guestRemove(article.url);
    } else {
      guestAdd(article);
    }
  };

  const handleClickCard = () => {
    if (isDesktop) {
      openReader(article);
    } else {
      navigate(`/article/${index}`, { state: { article } });
    }
  };

  return (
    <>
      {/* Card */}
      <div
        onClick={handleClickCard}
        className="cursor-pointer rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        {/* Image */}
        <div className="aspect-video bg-gray-200 relative">
          {article?.urlToImage && (
            <img
              src={article.urlToImage}
              className="w-full h-full object-cover"
            />
          )}

          {/* Save Button */}
          <button
            onClick={handleBookmark}
            className={`absolute top-3 right-3 z-10 px-2 py-1 rounded bg-white/80 backdrop-blur-sm text-sm
              ${isSaved ? "text-gold-700 font-medium" : "text-gray-600"}
            `}
          >
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-medium text-lg md:text-xl text-gray-900 leading-snug tracking-tight line-clamp-3">
            {article?.title}
          </h3>

          <div className="text-[11px] md:text-xs text-gray-500 mt-3">
            {article?.source?.name} ·{" "}
            {article?.publishedAt
              ? new Date(article.publishedAt).toLocaleTimeString()
              : ""}
          </div>
        </div>
      </div>

      {/* Guest Save Dialog */}
      <GuestSaveDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onContinue={guestContinue}
      />
    </>
  );
};

export default NewsCard;
