// hooks/useLayout.js
import { useState, useEffect } from 'react';

export const useLayout = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Set sidebar to closed by default on mobile
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }

    // Add event listener for resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return {
    showSidebar,
    isMobile,
    toggleSidebar
  };
};