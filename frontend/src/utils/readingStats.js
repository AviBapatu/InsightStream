// Reading stats utility for tracking article reads

const READING_STATS_KEY = "insight_stream_reading_stats";

export const readingStats = {
  // Track that an article was read
  trackRead: (articleUrl) => {
    try {
      const stats = readingStats.getStats();

      // Add to read articles if not already present
      if (!stats.readArticles.includes(articleUrl)) {
        stats.readArticles.push(articleUrl);
        stats.totalReads = stats.readArticles.length;
        stats.lastRead = new Date().toISOString();

        localStorage.setItem(READING_STATS_KEY, JSON.stringify(stats));
      }
    } catch (error) {
      console.error("Error tracking read:", error);
    }
  },

  // Get reading statistics
  getStats: () => {
    try {
      const raw = localStorage.getItem(READING_STATS_KEY);
      if (!raw) {
        return {
          totalReads: 0,
          readArticles: [],
          lastRead: null,
        };
      }
      return JSON.parse(raw);
    } catch (error) {
      console.error("Error getting stats:", error);
      return {
        totalReads: 0,
        readArticles: [],
        lastRead: null,
      };
    }
  },

  // Get total read count
  getReadCount: () => {
    const stats = readingStats.getStats();
    return stats.totalReads || 0;
  },

  // Clear all reading stats
  clearStats: () => {
    try {
      localStorage.removeItem(READING_STATS_KEY);
    } catch (error) {
      console.error("Error clearing stats:", error);
    }
  },

  // Check if an article has been read
  hasRead: (articleUrl) => {
    const stats = readingStats.getStats();
    return stats.readArticles.includes(articleUrl);
  },
};
