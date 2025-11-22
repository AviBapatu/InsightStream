/**
 * Guest Bookmarks Store (useGuestBookmarksStore)
 *
 * Manages bookmarks for non-authenticated (guest) users.
 * Provides local-only storage without server synchronization.
 *
 * State:
 * - bookmarks: Array of saved articles (stored in localStorage)
 *
 * Actions:
 * - load(): Load bookmarks from localStorage
 * - saveLocal(): Save bookmarks to localStorage
 * - add(article): Add an article to guest bookmarks
 * - remove(idOrUrl): Remove a bookmark by ID or URL
 * - isBookmarked(article): Check if article is bookmarked
 * - clear(): Clear all guest bookmarks
 *
 * Features:
 * - Pure client-side storage (no server sync)
 * - Persists across browser sessions
 * - Automatic deduplication (prevents duplicate bookmarks)
 * - Used when user is not logged in
 *
 * Storage:
 * - localStorage key: 'guest_bookmarks'
 * - Stores full article objects with metadata
 *
 * Note:
 * Guest bookmarks are device-specific and don't sync across devices.
 * When user logs in, they can be optionally migrated to server bookmarks.
 *
 * @example
 * const add = useGuestBookmarksStore((s) => s.add);
 * const bookmarks = useGuestBookmarksStore((s) => s.bookmarks);
 * add(article); // Saves to localStorage
 */

import { create } from "zustand";
import { v4 as uuid } from "uuid";

const LS_KEY = "guest_bookmarks";

export const useGuestBookmarksStore = create((set, get) => ({
  bookmarks: [],

  // Load from localStorage
  load: () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      set({ bookmarks: parsed });
    } catch (e) {
      console.error("Failed to load guest bookmarks", e);
    }
  },

  saveLocal: () => {
    try {
      const { bookmarks } = get();
      localStorage.setItem(LS_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error("Failed to save guest bookmarks", e);
    }
  },

  // Save new bookmark
  add: (article) => {
    const exists = get().bookmarks.find((b) => b.article?.url === article.url);
    if (exists) return exists;

    const entry = {
      id: uuid(),
      article,
      savedAt: new Date().toISOString(),
    };

    set((s) => ({ bookmarks: [entry, ...s.bookmarks] }));
    get().saveLocal();
    return entry;
  },

  // Remove bookmark
  remove: (idOrUrl) => {
    set((s) => ({
      bookmarks: s.bookmarks.filter(
        (b) => b.id !== idOrUrl && b.article.url !== idOrUrl
      ),
    }));
    get().saveLocal();
  },

  // Used in UI to mark icons
  isSaved: (articleUrl) =>
    !!get().bookmarks.find((b) => b.article.url === articleUrl),
}));
