/**
 * ProfilePage Component
 *
 * User profile and settings management page. Allows users to:
 * - View and update personal information (name, avatar)
 * - Configure preferences (language, country)
 * - View reading statistics (saved articles, read count)
 * - Customize theme settings
 * - Manage account (logout, delete account)
 *
 * This component uses the new modular component library for consistent
 * styling and better maintainability.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { useBookmarksStore } from "../store/useBookmarksStore";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { readingStats } from "../utils/readingStats";
import ThemeSelector from "../components/theme/ThemeSelector";
import { AiOutlineHeart } from "react-icons/ai";

// Import new modular components
import {
  PageContainer,
  Card,
  Button,
  Input,
  FormField,
  FormSection,
  StatCard,
  Avatar,
  Modal,
  Toast,
  Badge,
} from "../components/common";

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
  // Zustand store hooks
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);
  const bookmarks = useBookmarksStore((s) => s.bookmarks);

  // Navigation and device detection
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  // Personal Info State
  const [displayName, setDisplayName] = useState("");
  const [nameChanged, setNameChanged] = useState(false);
  const [nameSaving, setNameSaving] = useState(false);
  const [nameError, setNameError] = useState("");

  // Preferences State
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedCountry, setSelectedCountry] = useState("us");
  const [prefsChanged, setPrefsChanged] = useState(false);
  const [prefsSaving, setPrefsSaving] = useState(false);

  // Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  // Stats
  const [readCount, setReadCount] = useState(0);

  // Initialize state from user data
  useEffect(() => {
    if (user) {
      setDisplayName(user.name || "");
      setSelectedLanguage(user.language || "en");
      setSelectedCountry(user.country || "us");
    }
    setReadCount(readingStats.getReadCount());
  }, [user]);

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type: type === "success" ? "success" : "error" });
  };

  // Handle name change input
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setDisplayName(newName);
    setNameChanged(newName !== user?.name);
    setNameError("");
  };

  // Save updated name
  const handleSaveName = async () => {
    if (!displayName.trim()) {
      setNameError("Name cannot be empty");
      return;
    }

    if (!nameChanged) return;

    setNameSaving(true);
    try {
      await updateProfile({ name: displayName.trim() });
      showToast("Name updated successfully!", "success");
      setNameChanged(false);
    } catch (error) {
      showToast(error.message || "Failed to update name", "error");
    } finally {
      setNameSaving(false);
    }
  };

  // Handle language selection
  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode);
    setPrefsChanged(
      langCode !== user?.language || selectedCountry !== user?.country
    );
  };

  // Handle country selection
  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setPrefsChanged(
      selectedLanguage !== user?.language || countryCode !== user?.country
    );
  };

  // Save preferences (language and country)
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

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      navigate("/signup");
    } catch (error) {
      showToast(error.message || "Failed to delete account", "error");
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <>
        <Navbar />
        <PageContainer maxWidth="md">
          <Card padding="lg" shadow className="text-center mt-12">
            <h1
              className="text-2xl font-semibold mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              You're not logged in
            </h1>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Login to manage your saved articles across devices.
            </p>
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Card>
        </PageContainer>
      </>
    );
  }

  // Get selected language and country names for display
  const selectedLang = LANGUAGES.find((l) => l.code === selectedLanguage);
  const selectedCtry = COUNTRIES.find((c) => c.code === selectedCountry);

  return (
    <>
      <Navbar />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.type}
          duration={3000}
          position="top-right"
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Container with theme-aware background */}
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <PageContainer maxWidth="2xl" className="py-8 lg:py-12">
          {/* Profile Header */}
          <Card padding="lg" shadow className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <Avatar
                src={user.avatar ? `/avatars/${user.avatar}` : null}
                name={user.name}
                size="2xl"
                showBorder
              />
            </div>

            <h1
              className="text-2xl lg:text-3xl font-bold mb-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              {user.name}
            </h1>

            <p
              className="text-sm mb-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {user.email}
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/profile/avatar")}
            >
              Change Avatar
            </Button>
          </Card>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <StatCard
              value={bookmarks.length}
              label="Saved Articles"
              icon={<AiOutlineHeart className="w-6 h-6" />}
              iconColor="var(--color-danger-500)"
              onClick={() => navigate("/saved")}
            />
            <StatCard
              value={readCount}
              label="Articles Read"
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              }
              iconColor="var(--color-primary-500)"
            />
          </div>

          {/* Two Column Layout for Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Personal Information */}
              <Card padding="lg" shadow>
                <FormSection
                  title="Personal Information"
                  description="Update your display name and avatar"
                >
                  <FormField label="Display Name" error={nameError} required>
                    <Input
                      type="text"
                      value={displayName}
                      onChange={handleNameChange}
                      placeholder="Enter your name"
                      error={nameError}
                    />
                  </FormField>

                  {nameChanged && (
                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDisplayName(user.name);
                          setNameChanged(false);
                          setNameError("");
                        }}
                        fullWidth
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSaveName}
                        isLoading={nameSaving}
                        disabled={nameSaving}
                        fullWidth
                      >
                        Save Name
                      </Button>
                    </div>
                  )}
                </FormSection>
              </Card>

              {/* Preferences */}
              <Card padding="lg" shadow>
                <FormSection
                  title="Preferences"
                  description="Customize your news feed preferences"
                >
                  {/* Language Selection */}
                  <FormField label="Preferred Language">
                    <div
                      className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-lg"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageSelect(lang.code)}
                          className="flex items-center gap-2 p-2 rounded-lg transition-colors text-left"
                          style={{
                            backgroundColor:
                              selectedLanguage === lang.code
                                ? "var(--color-primary-100)"
                                : "transparent",
                            color:
                              selectedLanguage === lang.code
                                ? "var(--color-primary-700)"
                                : "var(--color-text-primary)",
                          }}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span className="text-sm font-medium">
                            {lang.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </FormField>

                  {/* Country Selection */}
                  <FormField label="Preferred Country">
                    <div
                      className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-lg"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      {COUNTRIES.map((country) => (
                        <button
                          key={country.code}
                          onClick={() => handleCountrySelect(country.code)}
                          className="flex items-center gap-2 p-2 rounded-lg transition-colors text-left"
                          style={{
                            backgroundColor:
                              selectedCountry === country.code
                                ? "var(--color-primary-100)"
                                : "transparent",
                            color:
                              selectedCountry === country.code
                                ? "var(--color-primary-700)"
                                : "var(--color-text-primary)",
                          }}
                        >
                          <span className="text-xl">{country.flag}</span>
                          <span className="text-sm font-medium">
                            {country.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </FormField>

                  {prefsChanged && (
                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedLanguage(user.language || "en");
                          setSelectedCountry(user.country || "us");
                          setPrefsChanged(false);
                        }}
                        fullWidth
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSavePreferences}
                        isLoading={prefsSaving}
                        disabled={prefsSaving}
                        fullWidth
                      >
                        Save Preferences
                      </Button>
                    </div>
                  )}
                </FormSection>
              </Card>

              {/* Danger Zone */}
              <Card padding="lg" shadow>
                <FormSection
                  title="Danger Zone"
                  description="Irreversible actions"
                >
                  <div className="space-y-3">
                    <Button variant="outline" fullWidth onClick={handleLogout}>
                      Logout
                    </Button>

                    <Button
                      variant="danger"
                      fullWidth
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      Delete Account
                    </Button>
                  </div>
                </FormSection>
              </Card>
            </div>

            {/* Right Column */}
            <div>
              {/* Theme Customization */}
              <Card padding="lg" shadow>
                <FormSection
                  title="Theme Customization"
                  description="Personalize your reading experience"
                >
                  <ThemeSelector />
                </FormSection>
              </Card>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => !deleting && setDeleteModalOpen(false)}
        title="Delete Account"
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              isLoading={deleting}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </Button>
          </>
        }
      >
        <p style={{ color: "var(--color-text-primary)" }}>
          Are you sure you want to delete your account? This action cannot be
          undone. All your saved articles and preferences will be permanently
          lost.
        </p>
      </Modal>
    </>
  );
};

export default ProfilePage;
