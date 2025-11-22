import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { useBookmarksStore } from "../store/useBookmarksStore";
import { useNavigate } from "react-router-dom";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { readingStats } from "../utils/readingStats";
import DeleteAccountModal from "../components/modals/DeleteAccountModal";
import BottomSheet from "../components/modals/BottomSheet";
import CustomDropdown from "../components/ui/CustomDropdown";
import ThemeSelector from "../components/theme/ThemeSelector";
import { AiOutlineHeart } from "react-icons/ai";

// Language options for NewsAPI
const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
];

// Country options for NewsAPI
const COUNTRIES = [
  { code: "us", name: "United States", flag: "🇺🇸" },
  { code: "in", name: "India", flag: "🇮🇳" },
  { code: "gb", name: "United Kingdom", flag: "🇬🇧" },
  { code: "ca", name: "Canada", flag: "🇨🇦" },
  { code: "au", name: "Australia", flag: "🇦🇺" },
  { code: "fr", name: "France", flag: "🇫🇷" },
  { code: "de", name: "Germany", flag: "🇩🇪" },
  { code: "jp", name: "Japan", flag: "🇯🇵" },
  { code: "cn", name: "China", flag: "🇨🇳" },
  { code: "br", name: "Brazil", flag: "🇧🇷" },
  { code: "mx", name: "Mexico", flag: "🇲🇽" },
  { code: "es", name: "Spain", flag: "🇪🇸" },
  { code: "it", name: "Italy", flag: "🇮🇹" },
  { code: "ru", name: "Russia", flag: "🇷🇺" },
  { code: "ae", name: "UAE", flag: "🇦🇪" },
];

const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);
  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  // Personal Info State
  const [displayName, setDisplayName] = useState("");
  const [nameChanged, setNameChanged] = useState(false);
  const [nameSaving, setNameSaving] = useState(false);

  // Preferences State
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedCountry, setSelectedCountry] = useState("us");
  const [prefsChanged, setPrefsChanged] = useState(false);
  const [prefsSaving, setPrefsSaving] = useState(false);

  // Modal/Sheet States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [languageSheetOpen, setLanguageSheetOpen] = useState(false);
  const [countrySheetOpen, setCountrySheetOpen] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  // Stats
  const [readCount, setReadCount] = useState(0);

  useEffect(() => {
    if (user) {
      setDisplayName(user.name || "");
      setSelectedLanguage(user.language || "en");
      setSelectedCountry(user.country || "us");
    }
    setReadCount(readingStats.getReadCount());
  }, [user]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setDisplayName(newName);
    setNameChanged(newName !== user?.name);
  };

  const handleSaveName = async () => {
    if (!nameChanged || !displayName.trim()) return;

    setNameSaving(true);
    try {
      await updateProfile({ name: displayName.trim() });
      showToast("Name updated successfully!", "success");
      setNameChanged(false);
      setTimeout(() => setNameChanged(false), 1200);
    } catch (error) {
      showToast(error.message || "Failed to update name", "error");
    } finally {
      setNameSaving(false);
    }
  };

  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode);
    setPrefsChanged(
      langCode !== user?.language || selectedCountry !== user?.country
    );
    setLanguageSheetOpen(false);
  };

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setPrefsChanged(
      selectedLanguage !== user?.language || countryCode !== user?.country
    );
    setCountrySheetOpen(false);
  };

  const handleSavePreferences = async () => {
    if (!prefsChanged) return;

    setPrefsSaving(true);
    try {
      await updateProfile({
        language: selectedLanguage,
        country: selectedCountry,
      });
      showToast("Preferences saved successfully!", "success");
      setPrefsChanged(false);
    } catch (error) {
      showToast(error.message || "Failed to save preferences", "error");
    } finally {
      setPrefsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      navigate("/signup");
    } catch (error) {
      showToast(error.message || "Failed to delete account", "error");
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto px-4 mt-12 text-center">
          <h1
            className="text-2xl font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            You're not logged in
          </h1>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Login to manage your saved articles across devices.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 w-full py-3 text-white rounded-xl font-medium"
            style={{ backgroundColor: "var(--color-primary-600)" }}
          >
            Login
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {/* Page background wrapper */}
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top duration-300">
            <div
              className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
                toast.type === "success"
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {toast.type === "success" ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div
                className="w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 shadow-lg"
                style={{ borderColor: "var(--color-primary-600)" }}
              >
                {user.avatar ? (
                  <img
                    src={`/avatars/${user.avatar}`}
                    className="w-full h-full object-cover"
                    alt="avatar"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-gold-400 to-gold-600" />
                )}
              </div>
            </div>
            <h1
              className="text-2xl lg:text-3xl font-bold mb-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              {user.name}
            </h1>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {user.email}
            </p>
            <button
              onClick={() => navigate("/profile/avatar")}
              className="mt-3 px-5 py-1.5 border-2 rounded-full font-medium transition-all text-sm"
              style={{
                borderColor: "var(--color-primary-600)",
                color: "var(--color-primary-700)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--color-primary-50)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Change Avatar
            </button>
          </div>

          {/* Stats Section */}
          <div className="mb-6">
            <div
              className={`grid ${
                isDesktop ? "grid-cols-2" : "grid-cols-1"
              } gap-4`}
            >
              {/* Bookmarks Stat */}
              <div
                className="rounded-xl border p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                style={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className="text-3xl font-bold mb-1 tracking-tight"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {bookmarks.length}
                    </div>
                    <div
                      className="font-medium group-hover:text-gold-700 transition-colors text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Articles Saved
                    </div>
                  </div>
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--color-primary-100)" }}
                  >
                    <AiOutlineHeart
                      className="w-5 h-5"
                      style={{ color: "var(--color-primary-700)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Reading Stat */}
              <div
                className="rounded-xl border p-5 shadow-sm hover:shadow-lg transition-all group relative"
                style={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className="text-3xl font-bold mb-1 tracking-tight"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {readCount}
                    </div>
                    <div
                      className="font-medium group-hover:text-gold-700 transition-colors text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Articles Read
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                </div>
                {!isDesktop && (
                  <div
                    className="mt-2 text-xs"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    Based on this device's reading history
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Two Column Layout for Desktop */}
          <div
            className={`${isDesktop ? "grid grid-cols-2 gap-6" : "space-y-6"}`}
          >
            {/* Left Column */}
            <div className="space-y-6">
              {/* Personal Info Section */}
              <section>
                <h2
                  className="text-lg font-semibold mb-3"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Personal Information
                </h2>
                <div
                  className="rounded-xl border p-5"
                  style={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div className="space-y-3">
                    <label
                      className="block text-sm font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Display Name
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={displayName}
                        onChange={handleNameChange}
                        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: "var(--color-card)",
                          borderColor: "var(--color-border)",
                          color: "var(--color-text-primary)",
                        }}
                        placeholder="Your name"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor =
                            "var(--color-primary-600)";
                          e.currentTarget.style.boxShadow =
                            "0 0 0 2px var(--color-primary-100)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            "var(--color-border)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                      {isDesktop && nameChanged && (
                        <button
                          onClick={handleSaveName}
                          disabled={nameSaving}
                          className="px-5 py-2 text-white rounded-full font-medium transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
                          style={{
                            backgroundColor: "var(--color-primary-700)",
                          }}
                          onMouseEnter={(e) =>
                            !nameSaving &&
                            (e.currentTarget.style.backgroundColor =
                              "var(--color-primary-800)")
                          }
                          onMouseLeave={(e) =>
                            !nameSaving &&
                            (e.currentTarget.style.backgroundColor =
                              "var(--color-primary-700)")
                          }
                        >
                          {nameSaving ? (
                            <>
                              <svg
                                className="animate-spin h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Saving...
                            </>
                          ) : (
                            "Save"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Mobile FAB for Name Save */}
              {!isDesktop && nameChanged && (
                <button
                  onClick={handleSaveName}
                  disabled={nameSaving}
                  className="fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-lg transition-all disabled:opacity-50 flex items-center justify-center z-40 animate-in slide-in-from-bottom duration-300"
                  style={{ backgroundColor: "var(--color-primary-700)" }}
                  onMouseEnter={(e) =>
                    !nameSaving &&
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-primary-800)")
                  }
                  onMouseLeave={(e) =>
                    !nameSaving &&
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-primary-700)")
                  }
                >
                  {nameSaving ? (
                    <svg
                      className="animate-spin h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              )}

              {/* Preferences Section */}
              <section>
                <h2
                  className="text-lg font-semibold mb-3"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Preferences
                </h2>
                <div
                  className="rounded-xl border p-5 space-y-4"
                  style={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  {/* Language Preference */}
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Language
                    </label>
                    <div>
                      {isDesktop ? (
                        <CustomDropdown
                          value={selectedLanguage}
                          options={LANGUAGES}
                          onChange={(langCode) => {
                            setSelectedLanguage(langCode);
                            setPrefsChanged(
                              langCode !== user?.language ||
                                selectedCountry !== user?.country
                            );
                          }}
                          placeholder="Select language"
                          className="w-full"
                        />
                      ) : (
                        <button
                          onClick={() => setLanguageSheetOpen(true)}
                          className="w-full px-4 py-3 border rounded-lg flex items-center justify-between transition-all"
                          style={{
                            backgroundColor: "var(--color-card)",
                            borderColor: "var(--color-border)",
                            color: "var(--color-text-primary)",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "var(--color-background-secondary)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "var(--color-card)")
                          }
                        >
                          <span className="flex items-center gap-2">
                            <span>
                              {
                                LANGUAGES.find(
                                  (l) => l.code === selectedLanguage
                                )?.flag
                              }
                            </span>
                            <span>
                              {
                                LANGUAGES.find(
                                  (l) => l.code === selectedLanguage
                                )?.name
                              }
                            </span>
                          </span>
                          <svg
                            className="w-5 h-5"
                            style={{ color: "var(--color-text-tertiary)" }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Country Preference */}
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Country/Region
                    </label>
                    <div>
                      {isDesktop ? (
                        <CustomDropdown
                          value={selectedCountry}
                          options={COUNTRIES}
                          onChange={(countryCode) => {
                            setSelectedCountry(countryCode);
                            setPrefsChanged(
                              selectedLanguage !== user?.language ||
                                countryCode !== user?.country
                            );
                          }}
                          placeholder="Select country"
                          className="w-full"
                        />
                      ) : (
                        <button
                          onClick={() => setCountrySheetOpen(true)}
                          className="w-full px-4 py-3 border rounded-lg flex items-center justify-between transition-all"
                          style={{
                            backgroundColor: "var(--color-card)",
                            borderColor: "var(--color-border)",
                            color: "var(--color-text-primary)",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "var(--color-background-secondary)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "var(--color-card)")
                          }
                        >
                          <span className="flex items-center gap-2">
                            <span>
                              {
                                COUNTRIES.find(
                                  (c) => c.code === selectedCountry
                                )?.flag
                              }
                            </span>
                            <span>
                              {
                                COUNTRIES.find(
                                  (c) => c.code === selectedCountry
                                )?.name
                              }
                            </span>
                          </span>
                          <svg
                            className="w-5 h-5"
                            style={{ color: "var(--color-text-tertiary)" }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Save Preferences Button (Desktop) */}
                  {isDesktop && prefsChanged && (
                    <div
                      className="flex justify-end pt-3"
                      style={{ borderTop: "1px solid var(--color-border)" }}
                    >
                      <button
                        onClick={handleSavePreferences}
                        disabled={prefsSaving}
                        className="px-5 py-2 text-white rounded-full font-medium transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
                        style={{ backgroundColor: "var(--color-primary-700)" }}
                        onMouseEnter={(e) =>
                          !prefsSaving &&
                          (e.currentTarget.style.backgroundColor =
                            "var(--color-primary-800)")
                        }
                        onMouseLeave={(e) =>
                          !prefsSaving &&
                          (e.currentTarget.style.backgroundColor =
                            "var(--color-primary-700)")
                        }
                      >
                        {prefsSaving ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Saving...
                          </>
                        ) : (
                          "Save Preferences"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* Danger Zone */}
              <section>
                <h2 className="text-lg font-semibold text-red-600 mb-3">
                  Danger Zone
                </h2>
                <div
                  className="rounded-xl border-2 border-red-200 p-5"
                  style={{ backgroundColor: "var(--color-card)" }}
                >
                  <div className="mb-3">
                    <h3
                      className="text-base font-semibold mb-1"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Delete Account
                    </h3>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="px-5 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-all text-sm"
                  >
                    Delete Account
                  </button>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Theme Customization Section */}
              <section>
                <h2
                  className="text-lg font-semibold mb-3"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Theme Customization
                </h2>
                <div
                  className="rounded-xl border p-5"
                  style={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <ThemeSelector />
                </div>
              </section>
            </div>
          </div>

          {/* Logout Section - Full Width Below Columns */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-8 py-2.5 border-2 rounded-full font-medium transition-all text-sm"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-secondary)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--color-background-secondary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Logout
            </button>
          </div>

          {/* Mobile FAB for Name Save */}
          {!isDesktop && nameChanged && (
            <button
              onClick={handleSaveName}
              disabled={nameSaving}
              className="fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-lg transition-all disabled:opacity-50 flex items-center justify-center z-40 animate-in slide-in-from-bottom duration-300"
              style={{ backgroundColor: "var(--color-primary-700)" }}
              onMouseEnter={(e) =>
                !nameSaving &&
                (e.currentTarget.style.backgroundColor =
                  "var(--color-primary-800)")
              }
              onMouseLeave={(e) =>
                !nameSaving &&
                (e.currentTarget.style.backgroundColor =
                  "var(--color-primary-700)")
              }
            >
              {nameSaving ? (
                <svg
                  className="animate-spin h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          )}

          {/* Mobile FAB for Preferences Save */}
          {!isDesktop && prefsChanged && !nameChanged && (
            <button
              onClick={handleSavePreferences}
              disabled={prefsSaving}
              className="fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-lg transition-all disabled:opacity-50 flex items-center justify-center z-40 animate-in slide-in-from-bottom duration-300"
              style={{ backgroundColor: "var(--color-primary-700)" }}
              onMouseEnter={(e) =>
                !prefsSaving &&
                (e.currentTarget.style.backgroundColor =
                  "var(--color-primary-800)")
              }
              onMouseLeave={(e) =>
                !prefsSaving &&
                (e.currentTarget.style.backgroundColor =
                  "var(--color-primary-700)")
              }
            >
              {prefsSaving ? (
                <svg
                  className="animate-spin h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Delete Account Modal */}
        <DeleteAccountModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteAccount}
          loading={deleting}
        />

        {/* Language Bottom Sheet (Mobile) */}
        <BottomSheet
          isOpen={languageSheetOpen}
          onClose={() => setLanguageSheetOpen(false)}
          title="Select Language"
        >
          <div style={{ borderTop: "1px solid var(--color-border)" }}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full px-6 py-4 flex items-center justify-between transition-all`}
                style={{
                  backgroundColor:
                    selectedLanguage === lang.code
                      ? "var(--color-primary-50)"
                      : "transparent",
                  borderBottom: "1px solid var(--color-border)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    selectedLanguage === lang.code
                      ? "var(--color-primary-50)"
                      : "var(--color-background-secondary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    selectedLanguage === lang.code
                      ? "var(--color-primary-50)"
                      : "transparent")
                }
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {lang.name}
                  </span>
                </span>
                {selectedLanguage === lang.code && (
                  <div
                    className="w-1 h-8 rounded-full"
                    style={{ backgroundColor: "var(--color-primary-600)" }}
                  />
                )}
              </button>
            ))}
          </div>
        </BottomSheet>

        {/* Country Bottom Sheet (Mobile) */}
        <BottomSheet
          isOpen={countrySheetOpen}
          onClose={() => setCountrySheetOpen(false)}
          title="Select Country"
        >
          <div style={{ borderTop: "1px solid var(--color-border)" }}>
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountrySelect(country.code)}
                className={`w-full px-6 py-4 flex items-center justify-between transition-all`}
                style={{
                  backgroundColor:
                    selectedCountry === country.code
                      ? "var(--color-primary-50)"
                      : "transparent",
                  borderBottom: "1px solid var(--color-border)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    selectedCountry === country.code
                      ? "var(--color-primary-50)"
                      : "var(--color-background-secondary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    selectedCountry === country.code
                      ? "var(--color-primary-50)"
                      : "transparent")
                }
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {country.name}
                  </span>
                </span>
                {selectedCountry === country.code && (
                  <div
                    className="w-1 h-8 rounded-full"
                    style={{ backgroundColor: "var(--color-primary-600)" }}
                  />
                )}
              </button>
            ))}
          </div>
        </BottomSheet>
      </div>{" "}
      {/* End background wrapper */}
    </>
  );
};

export default ProfilePage;
