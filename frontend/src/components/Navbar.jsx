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

const Navbar = ({
  searchQuery,
  setSearchQuery,
  onFilterToggle,
  showFilterButton,
}) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
      <header className="w-full bg-white/95 border-b border-gray-100 z-40 sticky top-0 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          {/* LEFT — LOGO */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <span className="font-semibold text-xl tracking-tight">
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
                  border border-gray-200
                  bg-gray-50/50
                  text-sm
                  focus:ring-2 focus:ring-gold-500 focus:border-gold-500 focus:outline-none
                  focus:bg-white
                  transition-all duration-200
                  placeholder:text-gray-400
                "
                />
                <IoSearchOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
              </div>
              {showFilterButton && (
                <button
                  onClick={onFilterToggle}
                  className="
                  p-2.5 rounded-full 
                  border border-gray-200
                  bg-gray-50/50
                  hover:bg-gray-100 
                  text-gray-700 hover:text-gold-700 
                  transition-all duration-200
                  active:scale-95
                "
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
                className="text-xl text-gray-700 active:scale-90 transition"
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
                  border border-gray-200
                  bg-gray-50/50
                  hover:bg-gray-100 
                  text-gray-700 hover:text-gold-700 
                  transition-all duration-200
                  active:scale-95
                "
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
                className="w-9 h-9 rounded-full overflow-hidden border border-gray-300 hover:ring-1 hover:ring-gold-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-gold-500/40"
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
                    absolute right-0 mt-1 w-56 bg-white 
                    border border-gray-100 rounded-2xl shadow-lg 
                    z-50 p-2
                  "
                    style={{
                      boxShadow: "0 8px 18px rgba(19, 19, 24, 0.06)",
                    }}
                  >
                    {/* Identity Block */}
                    <div className="flex items-center gap-3 px-3 py-2 mb-1">
                      <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-gold-500/30">
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
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {user?.name || "User"}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
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
                      text-sm font-medium text-gray-800 
                      hover:bg-gold-50 hover:text-gold-700 
                      transition-all duration-120
                      active:scale-[0.995]
                      focus:outline-none focus:ring-2 focus:ring-gold-500/20
                      relative group
                    "
                    >
                      {hasSavedArticles ? (
                        <AiFillHeart className="text-lg text-gold-500" />
                      ) : (
                        <AiOutlineHeart className="text-lg" />
                      )}
                      <span>Saved</span>
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gold-500 rounded-r opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <button
                      role="menuitem"
                      onClick={goProfile}
                      className="
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg 
                      text-sm font-medium text-gray-800 
                      hover:bg-gold-50 hover:text-gold-700 
                      transition-all duration-120
                      active:scale-[0.995]
                      focus:outline-none focus:ring-2 focus:ring-gold-500/20
                      relative group
                    "
                    >
                      <FiUser className="text-lg" />
                      <span>Account</span>
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gold-500 rounded-r opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    {/* Separator */}
                    <div className="h-px bg-gray-100 my-2" />

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

      {/* MOBILE SEARCH PANEL — SLIDE FROM BOTTOM */}
      <AnimatePresence>
        {!isDesktop && mobileSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-9998"
              onClick={() => setMobileSearchOpen(false)}
            />

            {/* Search Panel */}
            <motion.div
              initial={{ translateY: "100%", opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              exit={{ translateY: "100%", opacity: 0 }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              className="
                fixed bottom-0 left-0 right-0 
                bg-white rounded-t-3xl 
                border-t border-gray-200
                shadow-2xl 
                z-9999
                p-6 pb-8
              "
            >
              {/* Handle */}
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    autoFocus={mobileSearchOpen}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search news..."
                    className="
                      w-full px-5 py-3.5 rounded-2xl 
                      border-2 border-gray-200 
                      focus:ring-0 focus:border-gold-500 focus:outline-none 
                      transition-all duration-200
                      text-base
                      placeholder:text-gray-400
                    "
                  />
                  <IoSearchOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
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
                        px-4 py-3 rounded-xl
                        border border-gray-200
                        bg-gray-50
                        text-gray-700 font-medium
                        active:bg-gray-100
                        transition-all duration-200
                        active:scale-95
                      "
                    >
                      <FiFilter className="text-lg" />
                      <span>Filters</span>
                    </button>
                  )}
                  <button
                    onClick={() => setMobileSearchOpen(false)}
                    className="
                      flex-1 px-6 py-3 rounded-xl
                      bg-gold-600 text-white font-medium
                      hover:bg-gold-700
                      active:scale-95
                      transition-all duration-200
                    "
                  >
                    Search
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM SHEET MENU */}
      <AnimatePresence>
        {!isDesktop && user && menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-9998"
              onClick={() => setMenuOpen(false)}
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
              className="
                mobile-bottom-menu fixed bottom-0 left-0 right-0 
                bg-white rounded-t-3xl border-t border-gray-100 shadow-xl 
                max-h-[70vh] overflow-y-auto z-9999
                pt-3 pb-safe px-4
              "
              style={{
                boxShadow: "0 8px 18px rgba(19, 19, 24, 0.06)",
              }}
            >
              {/* Handle */}
              <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-3" />

              {/* Identity Block */}
              <div className="flex items-center gap-4 px-3 py-2 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-gold-500/30">
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
                  <div className="text-base font-medium text-gray-900 truncate">
                    {user?.name || "User"}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {user?.email || "email@example.com"}
                  </div>
                </div>
              </div>

              {/* Actions List */}
              <div className="space-y-1">
                <button
                  onClick={goSaved}
                  className="
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                    text-base font-medium text-gray-800 
                    hover:bg-gold-50 active:bg-gold-50 
                    transition-all active:scale-95
                  "
                >
                  {hasSavedArticles ? (
                    <AiFillHeart className="text-xl text-gold-500" />
                  ) : (
                    <AiOutlineHeart className="text-xl" />
                  )}
                  <span>Saved</span>
                </button>

                <button
                  onClick={goProfile}
                  className="
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                    text-base font-medium text-gray-800 
                    hover:bg-gold-50 active:bg-gold-50 
                    transition-all active:scale-95
                  "
                >
                  <FiUser className="text-xl" />
                  <span>Account</span>
                </button>
              </div>

              {/* Separator */}
              <div className="h-px bg-gray-100 my-3" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                  text-base font-medium text-red-600 
                  hover:bg-red-50 active:bg-red-50 
                  transition-all active:scale-95
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
