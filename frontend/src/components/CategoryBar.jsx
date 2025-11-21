import { useState } from "react";

const categories = [
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
  "Health",
  "Science",
  "General",
];

const CategoryBar = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* Scrollable Row */}
        <div className="flex gap-2 md:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide h-14 items-center lg:justify-center">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={
                  isActive
                    ? "px-5 py-2 bg-gold-50 text-gold-700 font-medium rounded-full border border-gold-200 transition-all duration-200 ease-out active:scale-95 whitespace-nowrap text-sm"
                    : "px-5 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all duration-200 whitespace-nowrap text-sm font-medium"
                }
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryBar;
