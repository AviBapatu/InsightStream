import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useAuthStore } from "../store/useAuthStore";
import { useBookmarksStore } from "../store/useBookmarksStore";
import { LuFolderHeart } from "react-icons/lu";
import { IoSearchOutline } from "react-icons/io5";
import { FiFilter, FiUser, FiLogOut } from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import DraggableBottomSheet from "./modals/DraggableBottomSheet";

const Navbar = ({
  searchQuery,
  setSearchQuery,
  onFilterToggle,
  showFilterButton,
}) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const avatarButtonRef = useRef(null);

  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((s) => s.user);
  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const hasSavedArticles = bookmarks.length > 0;
  const logout = useAuthStore((s) => s.logout);

  const goSaved = () => {
    navigate("/saved");
    setMenuOpen(false);
  };

  const goProfile = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  const goLogin = () => navigate("/login");

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking anywhere outside
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown-container")) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        avatarButtonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className="w-full border-b z-40 sticky top-0 backdrop-blur-sm"
        style={{
          backgroundColor: "var(--color-background)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          {/* LEFT — LOGO */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <span
              className="font-semibold text-xl tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              InsightStream
            </span>
          </div>

          {/* MIDDLE — DESKTOP SEARCH BAR */}
          {isDesktop && (
            <div className="flex-1 flex justify-center items-center gap-2 max-w-2xl mx-8">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="
                  w-full px-5 py-2.5 rounded-full
                  border
                  text-sm
                  focus:ring-2 focus:ring-gold-500 focus:border-gold-500 focus:outline-none
                  transition-all duration-200
                  placeholder:text-gray-400
                "
                  style={{
                    backgroundColor: "var(--color-background-secondary)",
                    color: "var(--color-text-primary)",
                    borderColor: "var(--color-border)",
                  }}
                />
                <IoSearchOutline
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none"
                  style={{ color: "var(--color-text-tertiary)" }}
                />
              </div>
              {showFilterButton && (
                <button
                  onClick={onFilterToggle}
                  className="
                  p-2.5 rounded-full 
                  border
                  hover:bg-opacity-80
                  transition-all duration-200
                  active:scale-95
                "
                  style={{
                    backgroundColor: "var(--color-background-secondary)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-secondary)",
                  }}
                  title="Toggle filters"
                >
                  <FiFilter className="text-lg" />
                </button>
              )}
            </div>
          )}

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-4 relative">
            {/* MOBILE SEARCH ICON (moves inside right-side container) */}
            {!isDesktop && (
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="text-xl active:scale-90 transition"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <IoSearchOutline />
              </button>
            )}

            {/* DESKTOP SAVED ICON */}
            {isDesktop && (
              <button
                onClick={goSaved}
                className="
                  p-2.5 rounded-full 
                  border
                  hover:bg-opacity-80
                  transition-all duration-200
                  active:scale-95
                "
                style={{
                  backgroundColor: "var(--color-background-secondary)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-secondary)",
                }}
                title="Saved articles"
              >
                <LuFolderHeart className="text-lg" />
              </button>
            )}

            {/* PROFILE ICON */}
            <div className="relative profile-dropdown-container">
              <button
                ref={avatarButtonRef}
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                    return;
                  }
                  setMenuOpen((p) => !p);
                }}
                className="w-9 h-9 rounded-full overflow-hidden border hover:ring-1 transition-all focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--color-border)",
                  "--tw-ring-color": "var(--color-primary-500)",
                  "--tw-ring-opacity": "0.3",
                }}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-controls="profile-menu"
              >
                <img
                  src={
                    user?.avatar ? `/avatars/${user.avatar}` : "/pfps/pfp1.png"
                  }
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* DESKTOP DROPDOWN MENU */}
              <AnimatePresence>
                {isDesktop && menuOpen && user && (
                  <motion.div
                    id="profile-menu"
                    role="menu"
                    initial={{ opacity: 0, translateY: -6, scale: 0.99 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    exit={{ opacity: 0, translateY: -6, scale: 0.99 }}
                    transition={{
                      duration: 0.14,
                      ease: [0.16, 0.84, 0.24, 1],
                    }}
                    className="
                    absolute right-0 mt-1 w-56
                    border rounded-2xl shadow-lg 
                    z-50 p-2
                  "
                    style={{
                      backgroundColor: "var(--color-background)",
                      borderColor: "var(--color-border)",
                      boxShadow: "0 8px 18px rgba(19, 19, 24, 0.06)",
                    }}
                  >
                    {/* Identity Block */}
                    <div className="flex items-center gap-3 px-3 py-2 mb-1">
                      <div
                        className="w-9 h-9 rounded-full overflow-hidden ring-1"
                        style={{
                          "--tw-ring-color": "var(--color-primary-500)",
                          "--tw-ring-opacity": "0.3",
                        }}
                      >
                        <img
                          src={
                            user?.avatar
                              ? `/avatars/${user.avatar}`
                              : "/pfps/pfp1.png"
                          }
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-sm font-medium truncate"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {user?.name || "User"}
                        </div>
                        <div
                          className="text-xs truncate"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          {user?.email || "email@example.com"}
                        </div>
                      </div>
                    </div>

                    {/* Primary Actions */}
                    <button
                      role="menuitem"
                      onClick={goSaved}
                      className="
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg 
                      text-sm font-medium
                      hover:bg-opacity-80
                      transition-all duration-120
                      active:scale-[0.995]
                      focus:outline-none focus:ring-2
                      relative group
                    "
                      style={{
                        color: "var(--color-text-primary)",
                        "--hover-bg": "var(--color-background-secondary)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--color-background-secondary)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      {hasSavedArticles ? (
                        <AiFillHeart
                          className="text-lg"
                          style={{ color: "var(--color-primary-500)" }}
                        />
                      ) : (
                        <AiOutlineHeart className="text-lg" />
                      )}
                      <span>Saved</span>
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: "var(--color-primary-500)" }}
                      />
                    </button>

                    <button
                      role="menuitem"
                      onClick={goProfile}
                      className="
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg 
                      text-sm font-medium
                      hover:bg-opacity-80
                      transition-all duration-120
                      active:scale-[0.995]
                      focus:outline-none focus:ring-2
                      relative group
                    "
                      style={{
                        color: "var(--color-text-primary)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--color-background-secondary)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <FiUser className="text-lg" />
                      <span>Account</span>
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: "var(--color-primary-500)" }}
                      />
                    </button>

                    {/* Separator */}
                    <div
                      className="h-px my-2"
                      style={{ backgroundColor: "var(--color-border)" }}
                    />

                    {/* Logout */}
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg 
                      text-sm font-medium text-red-600 
                      hover:bg-red-50 
                      transition-all duration-120
                      active:scale-[0.995]
                      focus:outline-none focus:ring-2 focus:ring-red-500/20
                    "
                    >
                      <FiLogOut className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE SEARCH PANEL — DRAGGABLE */}
      {!isDesktop && (
        <DraggableBottomSheet
          isOpen={mobileSearchOpen}
          onClose={() => setMobileSearchOpen(false)}
          maxHeight="auto"
        >
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                autoFocus={mobileSearchOpen}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setMobileSearchOpen(false);
                  }
                }}
                placeholder="Search news..."
                className="
                  w-full px-5 py-4 rounded-2xl 
                  border-2
                  focus:ring-0 focus:outline-none 
                  transition-all duration-200
                  text-base
                  touch-manipulation
                "
                style={{
                  backgroundColor: "var(--color-background)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
              />
              <IoSearchOutline
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none"
                style={{ color: "var(--color-text-tertiary)" }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {showFilterButton && (
                <button
                  onClick={() => {
                    setMobileSearchOpen(false);
                    onFilterToggle();
                  }}
                  className="
                    flex-1 flex items-center justify-center gap-2
                    px-4 py-3.5 rounded-xl
                    border font-medium
                    transition-all duration-200
                    active:scale-95
                    touch-manipulation
                  "
                  style={{
                    backgroundColor: "var(--color-background-secondary)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  <FiFilter className="text-lg" />
                  <span>Filters</span>
                </button>
              )}
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="
                  flex-1 px-6 py-3.5 rounded-xl
                  font-medium
                  active:scale-95
                  transition-all duration-200
                  touch-manipulation
                "
                style={{
                  backgroundColor: "var(--color-primary-600)",
                  color: "white",
                }}
              >
                Search
              </button>
            </div>
          </div>
        </DraggableBottomSheet>
      )}

      {/* MOBILE BOTTOM SHEET MENU */}
      <AnimatePresence>
        {!isDesktop && user && menuOpen && (
          <>
            {/* Backdrop - fades out when dragging up */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 - dragProgress }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-9998"
              onClick={() => setMenuOpen(false)}
            />

            {/* White Foreground Overlay (appears when dragging up) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: dragProgress }}
              className="fixed inset-0 z-9999 pointer-events-none"
              style={{ backgroundColor: "var(--color-background)" }}
            />

            {/* Bottom Sheet */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Account menu"
              initial={{ translateY: "100%", opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              exit={{ translateY: "100%", opacity: 0 }}
              transition={{
                duration: 0.26,
                ease: [0.16, 0.84, 0.24, 1],
              }}
              drag="y"
              dragConstraints={{ top: -100, bottom: 0 }}
              dragElastic={{ top: 0.1, bottom: 0.3 }}
              onDrag={(event, info) => {
                // Calculate opacity for white overlay based on upward drag
                // 0 at rest, 1 at -100px drag
                const progress = Math.min(Math.max(-info.offset.y / 100, 0), 1);
                setDragProgress(progress);
              }}
              onDragEnd={(event, info) => {
                // Reset progress
                setDragProgress(0);

                // If dragged down more than 100px, close the sheet
                if (info.offset.y > 100) {
                  setMenuOpen(false);
                }
                // If dragged up more than 80px, navigate to profile
                else if (info.offset.y < -80) {
                  setMenuOpen(false);
                  navigate("/profile");
                }
              }}
              className="
                mobile-bottom-menu fixed bottom-0 left-0 right-0 
                rounded-t-3xl border-t shadow-xl 
                max-h-[70vh] overflow-y-auto z-10000
                pt-3 pb-safe px-4 touch-none
              "
              style={{
                backgroundColor: "var(--color-background)",
                borderColor: "var(--color-border)",
                boxShadow: "0 8px 18px rgba(19, 19, 24, 0.06)",
              }}
            >
              {/* Handle - Make it more prominent for dragging */}
              <div
                className="w-10 h-1.5 rounded-full mx-auto mb-3 cursor-grab active:cursor-grabbing"
                style={{ backgroundColor: "var(--color-border-secondary)" }}
              />

              {/* Identity Block */}
              <div className="flex items-center gap-4 px-3 py-2 mb-4 pointer-events-none">
                <div
                  className="w-12 h-12 rounded-full overflow-hidden ring-1"
                  style={{
                    "--tw-ring-color": "var(--color-primary-500)",
                    "--tw-ring-opacity": "0.3",
                  }}
                >
                  <img
                    src={
                      user?.avatar
                        ? `/avatars/${user.avatar}`
                        : "/pfps/pfp1.png"
                    }
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-base font-medium truncate"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {user?.name || "User"}
                  </div>
                  <div
                    className="text-xs truncate"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {user?.email || "email@example.com"}
                  </div>
                </div>
              </div>

              {/* Actions List */}
              <div className="space-y-1 pointer-events-auto">
                <button
                  onClick={goSaved}
                  className="
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                    text-base font-medium
                    transition-all active:scale-95
                  "
                  style={{
                    color: "var(--color-text-primary)",
                  }}
                  onTouchStart={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-background-secondary)")
                  }
                  onTouchEnd={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {hasSavedArticles ? (
                    <AiFillHeart
                      className="text-xl"
                      style={{ color: "var(--color-primary-500)" }}
                    />
                  ) : (
                    <AiOutlineHeart className="text-xl" />
                  )}
                  <span>Saved</span>
                </button>

                <button
                  onClick={goProfile}
                  className="
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                    text-base font-medium
                    transition-all active:scale-95
                  "
                  style={{
                    color: "var(--color-text-primary)",
                  }}
                  onTouchStart={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-background-secondary)")
                  }
                  onTouchEnd={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <FiUser className="text-xl" />
                  <span>Account</span>
                </button>
              </div>

              {/* Separator */}
              <div
                className="h-px my-3 pointer-events-none"
                style={{ backgroundColor: "var(--color-border)" }}
              />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                  text-base font-medium text-red-600 
                  hover:bg-red-50 active:bg-red-50 
                  transition-all active:scale-95 pointer-events-auto
                "
              >
                <FiLogOut className="text-xl" />
                <span>Logout</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
