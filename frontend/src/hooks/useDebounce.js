/**
 * useDebounce Hook
 *
 * Delays updating a value until after a specified delay has passed since
 * the last time the value changed. Useful for preventing excessive API calls
 * or expensive operations during rapid user input (like search typing).
 *
 * How it works:
 * 1. User types in input field
 * 2. Value changes rapidly with each keystroke
 * 3. Hook waits for user to stop typing (delay period)
 * 4. Only then returns the final value
 *
 * Benefits:
 * - Reduces API calls (wait for user to finish typing)
 * - Improves performance (fewer re-renders and computations)
 * - Better UX (avoids flickering search results)
 *
 * @param {any} value - The value to debounce (usually from an input field)
 * @param {number} delay - Delay in milliseconds (default: 400ms)
 * @returns {any} - The debounced value (updates after delay)
 *
 * @example
 * // Search input with debounced API calls
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     // Only calls API after user stops typing for 500ms
 *     fetchSearchResults(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 *
 * return (
 *   <input
 *     value={searchTerm}
 *     onChange={(e) => setSearchTerm(e.target.value)}
 *     placeholder="Type to search..."
 *   />
 * );
 */

import { useState, useEffect } from "react";

export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
};
