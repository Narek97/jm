import { useEffect, useState } from 'react';

const useCardLayout = () => {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [height, setHeight] = useState<number>(
    typeof window !== 'undefined' ? window.innerHeight : 0,
  );
  const [maxCardNumber, setMaxCardNumber] = useState<number>(4);
  const sidebarClosedWidth = 48;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sidebar = document.querySelector('.sidebar-content') as HTMLElement;
    const updateCardNumber = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const sidebarWidth = sidebar?.offsetWidth || sidebarClosedWidth;
      const availableWidth = newWidth - sidebarWidth;

      setWidth(newWidth);
      setHeight(newHeight);

      if (availableWidth > 1760) {
        setMaxCardNumber(4);
      } else if (availableWidth > 1360) {
        setMaxCardNumber(3);
      } else if (availableWidth > 1120) {
        setMaxCardNumber(2);
      } else {
        setMaxCardNumber(1);
      }
    };

    updateCardNumber();

    window.addEventListener('resize', updateCardNumber);

    const observer = new ResizeObserver(updateCardNumber);
    if (sidebar) observer.observe(sidebar);

    return () => {
      window.removeEventListener('resize', updateCardNumber);
      observer.disconnect();
    };
  }, []);

  return { width, height, maxCardNumber };
};

export default useCardLayout;
