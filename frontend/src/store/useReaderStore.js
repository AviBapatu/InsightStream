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
