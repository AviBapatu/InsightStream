/**
 * useIsDesktop Hook
 *
 * Detects if the user is on a desktop/large screen device (≥1024px width).
 * Returns a boolean that updates when the window is resized across the
 * desktop breakpoint. Useful for responsive behavior and conditional rendering.
 *
 * Breakpoint:
 * - Desktop (true): Screen width >= 1024px
 * - Mobile/Tablet (false): Screen width < 1024px
 *
 * Features:
 * - Automatically updates on window resize
 * - Uses native matchMedia API for performance
 * - Cleans up event listeners on unmount
 *
 * Use Cases:
 * - Show different layouts for mobile vs desktop
 * - Open article in panel (desktop) vs navigate to page (mobile)
 * - Enable/disable certain features based on screen size
 * - Optimize rendering for device type
 *
 * @returns {boolean} - true if desktop (≥1024px), false otherwise
 *
 * @example
 * // Show different components based on screen size
 * const isDesktop = useIsDesktop();
 *
 * return (
 *   <div>
 *     {isDesktop ? (
 *       <DesktopSidebar />
 *     ) : (
 *       <MobileMenu />
 *     )}
 *   </div>
 * );
 *
 * @example
 * // Conditional article opening behavior
 * const isDesktop = useIsDesktop();
 * const openReader = useReaderStore((s) => s.openReader);
 *
 * const handleArticleClick = (article) => {
 *   if (isDesktop) {
 *     openReader(article); // Show in panel
 *   } else {
 *     navigate(`/article/${id}`); // Navigate to page
 *   }
 * };
 */

import { useState, useEffect } from "react";

export const useIsDesktop = () => {
  const query = window.matchMedia("(min-width: 1024px)");
  const [isDesktop, setIsDesktop] = useState(query.matches);

  useEffect(() => {
    const listener = (e) => setIsDesktop(e.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return isDesktop;
};
