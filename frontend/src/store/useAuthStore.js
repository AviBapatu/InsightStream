import { create } from "zustand";
import api from "../api/api";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,

  validateToken: () => {
    const token = localStorage.getItem("token");
    if (!token) return set({ token: null, user: null });

    try {
      const decoded = jwtDecode(token);
      const expired = decoded.exp * 1000 < Date.now();

      if (expired) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: null });
        return;
      }

      const savedUser = JSON.parse(localStorage.getItem("user") || "null");
      set({ token, user: savedUser });
    } catch (e) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ token: null, user: null });
    }
  },

  signup: async (name, email, password) => {
    set({ loading: true });

    try {
      const res = await api.post("/signup", { name, email, password });
      const { token } = res.data;

      // decode so we get the id
      const decoded = jwtDecode(token);

      const user = {
        id: decoded.id,
        name: res.data.name,
        email: res.data.email,
        avatar: res.data.avatar,
        language: res.data.language || "en",
        country: res.data.country || "us",
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ token, user, loading: false });
      return true;
    } catch (e) {
      set({ loading: false });
      throw e.response?.data || { message: "Signup failed" };
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await api.post("/login", { email, password });
      const { token } = res.data;

      const decoded = jwtDecode(token);

      const user = {
        id: decoded.id,
        name: res.data.name,
        email: res.data.email,
        avatar: res.data.avatar,
        language: res.data.language || "en",
        country: res.data.country || "us",
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ token, user, loading: false });
      return true;
    } catch (e) {
      set({ loading: false });
      throw e.response?.data || { message: "Login failed" };
    }
  },

  updateAvatar: async (avatar, token) => {
    const user = get().user;
    if (!user) return;

    try {
      const res = await api.patch(
        `/users/${user.id}/avatar`,
        { avatar },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedUser = { ...user, avatar: res.data.avatar };

      set({ user: updatedUser });
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return true;
    } catch (err) {
      console.error("Avatar update error:", err);
      throw err.response?.data || { message: "Avatar update failed" };
    }
  },

  updateProfile: async (updates) => {
    const user = get().user;
    const token = get().token;
    if (!user || !token) throw new Error("Not authenticated");

    try {
      const res = await api.patch(`/users/${user.id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = { ...user, ...res.data };
      set({ user: updatedUser });
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return true;
    } catch (err) {
      console.error("Profile update error:", err);
      throw err.response?.data || { message: "Profile update failed" };
    }
  },

  deleteAccount: async () => {
    const user = get().user;
    const token = get().token;
    if (!user || !token) throw new Error("Not authenticated");

    try {
      await api.delete(`/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear all user data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem(`bookmarks_${user.id}`);

      set({ user: null, token: null });
      return true;
    } catch (err) {
      console.error("Account deletion error:", err);
      throw err.response?.data || { message: "Account deletion failed" };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },
}));
