import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDesktop = useIsDesktop();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const goSaved = () => navigate("/saved");
  const goLogin = () => navigate("/login");

  return (
    <header className="w-full bg-white border-b border-gold-700 relative">
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
          <div className="flex-1 flex justify-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="
                w-72 px-4 py-2 rounded-full
                border border-gray-200
                bg-white
                focus:ring-2 focus:ring-gold-500 focus:border-gold-500
                transition-all duration-200
              "
            />
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className="flex items-center space-x-4">
          {/* DESKTOP SAVED ICON */}
          {isDesktop && (
            <button
              onClick={goSaved}
              className="text-gray-700 hover:text-gray-900 transition"
            >
              ★
            </button>
          )}

          {/* PROFILE ICON */}
          <div
            className="w-8 h-8 rounded-full bg-gray-300 cursor-pointer"
            onClick={() => {
              if (!isDesktop) {
                navigate("/profile");
                return;
              }

              if (!user) {
                navigate("/login");
                return;
              }

              setMenuOpen((p) => !p);
            }}
          ></div>
        </div>
      </div>

      {/* PROFILE MENU (DESKTOP) */}
      {isDesktop && menuOpen && user && (
        <div className="absolute right-4 top-16 bg-white border border-gray-200 shadow-lg rounded-xl py-2 w-40">
          <button
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => {
              navigate("/saved");
              setMenuOpen(false);
            }}
          >
            Saved Articles
          </button>

          <button
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* MOBILE SEARCH EXPANDED */}
      {!isDesktop && mobileSearchOpen && (
        <div className="px-4 py-3 flex items-center space-x-3 border-t border-gray-200 bg-white">
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="text-gray-700 text-lg"
          >
            ←
          </button>

          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news..."
            className="
              flex-1 px-4 py-2 rounded-full
              border border-gray-200
              focus:ring-2 focus:ring-gold-500 focus:border-gold-500
              transition-all duration-200
            "
          />
        </div>
      )}
    </header>
  );
};

export default Navbar;
