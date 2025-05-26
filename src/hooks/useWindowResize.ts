import { useEffect, useState } from 'react';

const useWindowResize = () => {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [height, setHeight] = useState<number>(
    typeof window !== 'undefined' ? window.innerHeight : 0,
  );
  const [maxCardNumber, setIsMaxCardNumber] = useState<number>(4);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      setWidth(newWidth);
      setHeight(newHeight);

      if (newWidth > 1760) {
        setIsMaxCardNumber(4);
      } else if (newWidth > 1505) {
        setIsMaxCardNumber(3);
      } else if (newWidth > 1250) {
        setIsMaxCardNumber(2);
      } else {
        setIsMaxCardNumber(1);
      }
    };

    // Run resize logic once on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { width, height, maxCardNumber };
};

export default useWindowResize;
