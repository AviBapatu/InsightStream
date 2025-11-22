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
    <div
      className="w-full border-b"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
      }}
    >
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
                    ? "px-5 py-2 font-medium rounded-full border transition-all duration-200 ease-out active:scale-95 whitespace-nowrap text-sm"
                    : "px-5 py-2 rounded-full transition-all duration-200 whitespace-nowrap text-sm font-medium"
                }
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--color-primary-50)",
                        color: "var(--color-primary-700)",
                        borderColor: "var(--color-primary-200)",
                      }
                    : {
                        color: "var(--color-text-secondary)",
                        backgroundColor: "transparent",
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--color-text-primary)";
                    e.currentTarget.style.backgroundColor =
                      "var(--color-background-secondary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--color-text-secondary)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
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
