import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DraggableBottomSheet = ({
  isOpen,
  onClose,
  children,
  maxHeight = "85vh",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const sheetRef = useRef(null);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Prevent scrolling
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // Restore scrolling
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";

        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Handle drag start
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
    setCurrentY(clientY);
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (!isDragging) return;

    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    setCurrentY(clientY);

    const deltaY = clientY - startY;
    // Only allow dragging down (positive deltaY)
    setDragOffset(Math.max(0, deltaY));
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const deltaY = currentY - startY;

    // If dragged down more than 100px, close the sheet
    if (deltaY > 100) {
      onClose();
    }

    // Reset offset
    setDragOffset(0);
    setStartY(0);
    setCurrentY(0);
  };

  // Add event listeners for drag
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => handleDragMove(e);
    const handleMouseUp = () => handleDragEnd();
    const handleTouchMove = (e) => handleDragMove(e);
    const handleTouchEnd = () => handleDragEnd();

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, startY, currentY]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ translateY: "100%" }}
            animate={{ translateY: 0 }}
            exit={{ translateY: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            style={{
              transform: isDragging ? `translateY(${dragOffset}px)` : undefined,
              maxHeight: maxHeight,
            }}
            className="
              fixed bottom-0 left-0 right-0 
              bg-white rounded-t-3xl 
              border-t border-gray-200
              shadow-2xl 
              z-9999
              overflow-hidden
              flex flex-col
            "
          >
            {/* Drag Handle Area */}
            <div
              className="sticky top-0 z-10 bg-white pt-3 pb-2 cursor-grab active:cursor-grabbing shrink-0"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              {/* Drag Indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto"
              />
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto px-6 pb-8"
            >
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DraggableBottomSheet;
