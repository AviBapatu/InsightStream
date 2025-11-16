import { motion, AnimatePresence } from "framer-motion";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

const GuestSaveDialog = ({ open, onClose, onContinue }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdrop}
        >
          <motion.div
            variants={scaleIn}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-[90%] max-w-md bg-white rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Save Without an Account?
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              You’re not logged in. This bookmark will be saved{" "}
              <span className="font-medium text-gray-900">
                only on this device
              </span>{" "}
              and won’t sync across devices. If you clear your browser data or
              switch devices,{" "}
              <span className="font-medium text-gray-900">
                this saved article will be lost.
              </span>
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onContinue();
                  onClose();
                }}
                className="px-4 py-2 bg-gold-600 text-white text-sm rounded-md hover:bg-gold-700 transition"
              >
                Save on this device
              </button>

              <button
                onClick={() => (window.location.href = "/login")}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition"
              >
                Login to save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GuestSaveDialog;
