import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowBack, IoCheckmarkCircle } from "react-icons/io5";
import { useIsDesktop } from "../hooks/useIsDesktop";

// Keep this list in sync with backend avatarList
const avatarList = [
  "avatar1.png",
  "avatar2.png",
  "avatar3.png",
  "avatar4.png",
  "avatar5.png",
  "avatar6.png",
  "avatar7.png",
  "avatar8.png",
  "avatar9.png",
  "avatar10.png",
];

const AvatarSelectPage = () => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const updateAvatar = useAuthStore((s) => s.updateAvatar);

  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const currentAvatar = user?.avatar || "";
  const hasChanged = selected && selected !== currentAvatar;

  const handleSave = async () => {
    if (!selected || !token || !hasChanged) return;

    try {
      setSaving(true);
      await updateAvatar(selected, token);
      setSuccess(true);
      toast.success("Avatar updated!", {
        position: "top-center",
        autoClose: 1200,
      });

      // Navigate back after short delay
      setTimeout(() => {
        navigate("/profile");
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error("Unable to update avatar. Try again.", {
        position: "top-center",
      });
      setSaving(false);
    }
  };

  const handleAvatarSelect = (avatar) => {
    if (saving) return;
    setSelected(avatar);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* HEADER */}
      <header className="bg-white border-b border-[#E4E4E4] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-[60px] flex items-center">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-[#111] hover:text-[#C59D0F] transition-colors duration-200"
            disabled={saving}
          >
            <IoArrowBack className="text-xl" />
            <span className="text-base font-medium hidden sm:inline">Back</span>
          </button>
          <h1 className="flex-1 text-center text-xl font-semibold tracking-tight text-[#111]">
            Change Avatar
          </h1>
          <div className="w-[60px]" /> {/* Spacer for centered title */}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-32">
        {/* CURRENT AVATAR PREVIEW */}
        <div className="flex flex-col items-center mb-12">
          <motion.div
            className="relative"
            whileHover={isDesktop ? { scale: 1.05 } : {}}
            transition={{ duration: 0.2 }}
          >
            <div
              className="rounded-full overflow-hidden border-4 shadow-md"
              style={{
                width: isDesktop ? "130px" : "110px",
                height: isDesktop ? "130px" : "110px",
                borderColor: "rgba(197, 157, 15, 0.2)",
              }}
            >
              <img
                src={`/avatars/${currentAvatar}`}
                alt="Current avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          <p className="text-sm text-gray-500 mt-3">Current Avatar</p>
        </div>

        {/* AVATAR SELECTION GRID */}
        <div className="mb-8">
          <h2 className="text-base font-medium text-gray-700 mb-4 tracking-tight">
            Choose a new avatar
          </h2>

          <div
            className={`grid gap-4 ${
              isDesktop ? "grid-cols-4" : "grid-cols-3"
            }`}
          >
            {avatarList.map((avatar) => {
              const isSelected = avatar === selected;
              const isCurrent = avatar === currentAvatar;

              return (
                <motion.button
                  key={avatar}
                  onClick={() => handleAvatarSelect(avatar)}
                  disabled={saving}
                  className="relative aspect-square focus:outline-none group"
                  whileTap={{ scale: 0.95 }}
                  animate={
                    isSelected ? { scale: [0.9, 1.05, 1] } : { scale: 1 }
                  }
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`
                      w-full h-full rounded-full overflow-hidden
                      border-2 transition-all duration-200
                      ${
                        isSelected
                          ? "border-[3px] border-[#C59D0F] shadow-lg"
                          : isCurrent
                          ? "border-gray-300"
                          : "border-transparent"
                      }
                      ${
                        !isSelected && !isCurrent && isDesktop
                          ? "group-hover:border-[#C59D0F] group-hover:shadow-md"
                          : ""
                      }
                    `}
                  >
                    <img
                      src={`/avatars/${avatar}`}
                      alt={`Avatar option ${avatar}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* CHECKMARK OVERLAY */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, rotate: 20, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-0 right-0 bg-[#C59D0F] rounded-full p-1 border-2 border-white shadow-md"
                      >
                        <IoCheckmarkCircle className="text-white text-xl" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* DESKTOP SAVE BUTTON */}
        {isDesktop && (
          <div className="flex justify-end mt-8">
            <AnimatePresence>
              {hasChanged && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  disabled={saving || success}
                  onClick={handleSave}
                  className={`
                    px-6 py-2.5 rounded-full font-semibold text-white
                    transition-all duration-200
                    ${
                      saving || success
                        ? "bg-[#C59D0F] opacity-70 cursor-not-allowed"
                        : "bg-[#C59D0F] hover:bg-[#B08F0E] hover:shadow-lg"
                    }
                  `}
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving...
                    </span>
                  ) : success ? (
                    <span className="flex items-center gap-2">
                      <IoCheckmarkCircle className="text-xl" />
                      Saved!
                    </span>
                  ) : (
                    "Save Avatar"
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* MOBILE FLOATING SAVE BUTTON */}
      {!isDesktop && (
        <AnimatePresence>
          {hasChanged && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-6 left-4 right-4 z-20"
            >
              <button
                disabled={saving || success}
                onClick={handleSave}
                className={`
                  w-full py-3.5 rounded-full font-semibold text-white
                  shadow-lg transition-all duration-200
                  ${
                    saving || success
                      ? "bg-[#C59D0F] opacity-70"
                      : "bg-[#C59D0F] active:scale-[0.98]"
                  }
                `}
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </span>
                ) : success ? (
                  <span className="flex items-center justify-center gap-2">
                    <IoCheckmarkCircle className="text-2xl" />
                    Saved!
                  </span>
                ) : (
                  "Save Avatar"
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default AvatarSelectPage;
