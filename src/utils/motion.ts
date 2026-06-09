/**
 * requestAnimationFrame (rAF) Scroll Sync Utility
 * Prevents scroll-lag and layout thrashing by grouping updates in the render loop.
 * Works optimally with high-refresh rate displays (90Hz, 120Hz, 144Hz).
 */

type ScrollCallback = (scrollY: number) => void;

/**
 * Initializes a rAF-throttled scroll listener.
 * Returns a cleanup function to remove the listener.
 * 
 * @param callback function to run on scroll
 */
export function initRAFScroll(callback: ScrollCallback): () => void {
  if (typeof window === "undefined") return () => {};

  let ticking = false;
  let lastKnownScroll = 0;

  const handleScroll = () => {
    lastKnownScroll = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback(lastKnownScroll);
        ticking = false;
      });

      ticking = true;
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}

/**
 * Throttle utility using requestAnimationFrame for arbitrary high-frequency callbacks (e.g. resize, pointermove)
 */
export function rafThrottle<T extends (...args: any[]) => void>(fn: T): (...args: Parameters<T>) => void {
  let ticking = false;

  return (...args: Parameters<T>) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        fn(...args);
        ticking = false;
      });
      ticking = true;
    }
  };
}
