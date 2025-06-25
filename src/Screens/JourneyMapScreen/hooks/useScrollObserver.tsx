import { useEffect, useState } from 'react';

const useScrollObserver = () => {
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const container = document.querySelector('.journey-map-rows');
      if (container) {
        const hasVerticalScroll = container.scrollHeight > container.clientHeight;
        setIsScrollable(hasVerticalScroll);
      }
    });

    const targetNode = document.body; // or a more specific parent element
    observer.observe(targetNode, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return isScrollable;
};

export default useScrollObserver;
