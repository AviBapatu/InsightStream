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
    const exists = get().bookmarks.find(
      (b) => b.article?.url === article.url
    );
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
