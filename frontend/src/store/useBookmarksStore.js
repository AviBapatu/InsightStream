import { create } from "zustand";
import api from "../api/api";
import { v4 as uuid } from "uuid";

const API_BASE = "http://localhost:5000";

const lsKey = (userId) => `bookmarks_${userId}`;

export const useBookmarksStore = create((set, get) => ({
  bookmarks: [],
  queued: [],
  loading: false,
  userId: null,
  setUser: (userId) => set({ userId }),

  loadLocal: () => {
    const { userId } = get();
    if (!userId) return;
    try {
      const raw = localStorage.getItem(lsKey(userId));
      const parsed = raw ? JSON.parse(raw) : [];
      set({ bookmarks: parsed });
    } catch (e) {
      console.error("loadLocal bookmarks:", e);
    }
  },

  saveLocal: () => {
    const { userId, bookmarks } = get();
    if (!userId) return;
    try {
      localStorage.setItem(lsKey(userId), JSON.stringify(bookmarks));
    } catch (e) {
      console.error("saveLocal bookmarks:", e);
    }
  },

  syncWithServer: async (token) => {
    const { userId, bookmarks } = get();
    if (!userId) return;

    set({ loading: true });
    try {
      const res = await api.get(`/bookmarks`);
      const serverBookmarks = res.data || [];

      const rawLocal = localStorage.getItem(lsKey(userId));
      const localList = rawLocal ? JSON.parse(rawLocal) : [];

      const map = new Map();
      serverBookmarks.forEach((b) => map.set(b.article.url, b));
      localList.forEach((b) => {
        if (!map.has(b.article.url)) {
          map.set(b.article.url, b);
        }
      });

      const merged = Array.from(map.values());
      set({ bookmarks: merged });
      localStorage.setItem(lsKey(userId), JSON.stringify(merged));

      for (const item of merged) {
        if (!item.id) {
          try {
            const postRes = await api.post(`/bookmarks`, {
              article: item.article,
            });
            const created = postRes.data;

            set((s) => ({
              bookmarks: s.bookmarks.map((b) =>
                b.article.url === created.article.url ? created : b
              ),
            }));

            const updated = get().bookmarks;
            localStorage.setItem(lsKey(userId), JSON.stringify(updated));
          } catch (e) {
            console.warn("sync local-only bookmark failed, queuing:", e);

            get().queueOp({ op: "add", payload: item });
          }
        }
      }

      await get().flushQueue(token);
    } catch (e) {
      console.warn("syncWithServer failed:", e);
    } finally {
      set({ loading: false });
    }
  },

  addBookmark: async (article, token) => {
    const { userId } = get();
    if (!userId) throw new Error("No userId in bookmarks store");

    const exists = get().bookmarks.find((b) => b.article.url === article.url);
    if (exists) return exists;

    const localEntry = {
      id: uuid(),
      userId,
      article,
      savedAt: new Date().toISOString(),
    };

    set((s) => ({ bookmarks: [localEntry, ...s.bookmarks] }));
    get().saveLocal();

    if (!navigator.onLine) {
      get().queueOp({ op: "add", payload: localEntry });
      return localEntry;
    }

    try {
      const res = await api.post(`/bookmarks`, { article });
      const created = res.data;

      set((s) => ({
        bookmarks: s.bookmarks.map((b) =>
          b.article.url === created.article.url ? created : b
        ),
      }));
      get().saveLocal();
      return created;
    } catch (e) {
      console.warn("addBookmark server failed, queueing:", e);

      get().queueOp({ op: "add", payload: localEntry });
      return localEntry;
    }
  },

  removeBookmark: async (bookmarkIdOrUrl, token) => {
    const { userId } = get();
    if (!userId) throw new Error("No userId in bookmarks store");

    const item = get().bookmarks.find(
      (b) => b.id === bookmarkIdOrUrl || b.article.url === bookmarkIdOrUrl
    );
    if (!item) return null;

    set((s) => ({ bookmarks: s.bookmarks.filter((b) => b !== item) }));
    get().saveLocal();

    if (!navigator.onLine) {
      get().queueOp({ op: "del", payload: item });
      return item;
    }

    try {
      if (item.id && !item.id.startsWith("tmp-")) {
        await api.delete(`/bookmarks/${item.id}`);
      } else {
        const serverList = (await api.get(`/bookmarks`)).data || [];
        const serverMatch = serverList.find(
          (b) => b.article.url === item.article.url
        );
        if (serverMatch) {
          await api.delete(`/bookmarks/${serverMatch.id}`);
        }
      }
      return item;
    } catch (e) {
      console.warn("removeBookmark server failed, queueing:", e);
      get().queueOp({ op: "del", payload: item });
      return item;
    }
  },

  queueOp: (op) => {
    set((s) => ({ queued: [...s.queued, op] }));

    const { userId, queued } = get();
    if (userId)
      localStorage.setItem(`${lsKey(userId)}_queue`, JSON.stringify(queued));
  },

  flushQueue: async (token) => {
    const { userId } = get();
    if (!userId) return;
    const rawQueue = localStorage.getItem(`${lsKey(userId)}_queue`);
    const queued = rawQueue ? JSON.parse(rawQueue) : get().queued || [];

    if (!queued.length) return;

    set({ loading: true });
    try {
      const successfulOps = [];
      for (const op of queued) {
        try {
          if (op.op === "add") {
            await api.post(`/bookmarks`, { article: op.payload.article });
            successfulOps.push(op);
          } else if (op.op === "del") {
            const id = op.payload.id;
            if (id) {
              await api.delete(`/bookmarks/${id}`);
              successfulOps.push(op);
            } else {
              const serverList = (await api.get(`/bookmarks`)).data || [];
              const match = serverList.find(
                (b) => b.article.url === op.payload.article.url
              );
              if (match) {
                await api.delete(`/bookmarks/${match.id}`);
                successfulOps.push(op);
              } else {
                // Item not found on server, consider it already deleted
                successfulOps.push(op);
              }
            }
          }
        } catch (e) {
          // If it's a 404, the item is already gone, so we can skip it
          if (e.response?.status === 404) {
            console.log("Item already deleted (404), removing from queue:", op);
            successfulOps.push(op);
          } else if (e.response?.status === 409) {
            // Conflict means item already exists, remove from queue
            console.log("Item already exists (409), removing from queue:", op);
            successfulOps.push(op);
          } else {
            console.warn("queued op failed, will retry later:", op, e.message);
          }
        }
      }

      // Remove successful operations from queue
      const remainingQueue = queued.filter((op) => !successfulOps.includes(op));

      if (remainingQueue.length === 0) {
        localStorage.removeItem(`${lsKey(userId)}_queue`);
        set({ queued: [] });
      } else {
        localStorage.setItem(
          `${lsKey(userId)}_queue`,
          JSON.stringify(remainingQueue)
        );
        set({ queued: remainingQueue });
      }

      await get().syncWithServer(token);
    } catch (e) {
      console.error("flushQueue error", e);
    } finally {
      set({ loading: false });
    }
  },

  loadFromServer: async (token) => {
    const { userId } = get();
    if (!userId) return;
    set({ loading: true });
    try {
      const res = await api.get(`/bookmarks`);
      const serverList = res.data || [];
      set({ bookmarks: serverList });
      localStorage.setItem(lsKey(userId), JSON.stringify(serverList));
    } catch (e) {
      console.warn("loadFromServer failed", e);
    } finally {
      set({ loading: false });
    }
  },

  initForUser: async (userId, token) => {
    set({ userId });

    get().loadLocal();

    if (navigator.onLine) {
      await get().syncWithServer(token);
    } else {
      const rawQueue = localStorage.getItem(`${lsKey(userId)}_queue`);
      const queued = rawQueue ? JSON.parse(rawQueue) : [];
      set({ queued });
    }
  },

  // Utility: Clear the queue manually (for troubleshooting)
  clearQueue: () => {
    const { userId } = get();
    if (!userId) return;
    localStorage.removeItem(`${lsKey(userId)}_queue`);
    set({ queued: [] });
    console.log("✅ Queue cleared for user:", userId);
  },
}));
