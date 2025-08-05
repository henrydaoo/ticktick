import { useEffect, useState } from 'react';

export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState<boolean>(!document.hidden);
  const [hasBeenVisible, setHasBeenVisible] = useState<boolean>(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsVisible(visible);
      
      // Once the page has been visible, mark it as such
      if (visible && !hasBeenVisible) {
        setHasBeenVisible(true);
      }
    };

    // Add event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Check initial state
    handleVisibilityChange();

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasBeenVisible]);

  return { isVisible, hasBeenVisible };
};
