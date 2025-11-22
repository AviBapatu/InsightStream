/**
 * Reading Statistics Utility (readingStats)
 *
 * Tracks user's article reading activity using localStorage.
 * Provides methods to record article reads, retrieve statistics,
 * and check reading history.
 *
 * Features:
 * - Tracks unique article reads by URL
 * - Stores total read count
 * - Records last read timestamp
 * - Prevents duplicate counting
 * - Persists across sessions
 *
 * Storage:
 * - localStorage key: 'insight_stream_reading_stats'
 * - Stores: { totalReads, readArticles[], lastRead }
 *
 * Methods:
 * - trackRead(articleUrl): Record an article as read
 * - getStats(): Get full statistics object
 * - getReadCount(): Get total number of articles read
 * - hasRead(articleUrl): Check if article was already read
 * - clearStats(): Reset all reading statistics
 *
 * Use Cases:
 * - Display reading statistics on profile page
 * - Mark articles as "already read" in UI
 * - Track user engagement with content
 * - Generate reading insights/analytics
 *
 * @example
 * import { readingStats } from './utils/readingStats';
 *
 * // Track when user reads an article
 * readingStats.trackRead(article.url);
 *
 * // Get total read count for display
 * const count = readingStats.getReadCount(); // e.g., 42
 *
 * // Check if user already read an article
 * if (readingStats.hasRead(article.url)) {
 *   console.log('Already read');
 * }
 *
 * // Get full statistics
 * const stats = readingStats.getStats();
 * console.log(stats.totalReads); // 42
 * console.log(stats.lastRead);   // "2025-11-22T10:30:00.000Z"
 */

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
