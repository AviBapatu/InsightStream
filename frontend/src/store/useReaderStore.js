/**
 * Reader Panel Store (useReaderStore)
 *
 * Manages the state of the article reader panel/modal.
 * Used primarily on desktop to display articles in a side panel or overlay.
 *
 * State:
 * - article: Currently opened article object (null when closed)
 * - isOpen: Boolean indicating if reader panel is visible
 *
 * Actions:
 * - openReader(article): Opens reader panel with specified article
 * - closeReader(): Closes reader panel and clears article
 *
 * Usage:
 * Typically used on desktop view to show article content in a panel
 * without navigating away from the current page. On mobile, navigation
 * to ArticlePage is preferred instead.
 *
 * @example
 * const openReader = useReaderStore((s) => s.openReader);
 * const isOpen = useReaderStore((s) => s.isOpen);
 * openReader(article); // Opens panel with article
 */

import { create } from "zustand";

export const useReaderStore = create((set) => ({
  article: null,
  isOpen: false,

  openReader: (article) =>
    set({
      article,
      isOpen: true,
    }),

  closeReader: () =>
    set({
      article: null,
      isOpen: false,
    }),
}));
