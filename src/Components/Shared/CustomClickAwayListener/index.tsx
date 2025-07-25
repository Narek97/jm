import React, { useRef, useEffect, ReactElement, cloneElement } from 'react';

// TypeScript interfaces
interface ClickAwayListenerProps {
  children: ReactElement;
  onClickAway: (event: MouseEvent | TouchEvent) => void;
  mouseEvent?: 'onClick' | 'onMouseDown' | 'onMouseUp' | false;
  touchEvent?: 'onTouchStart' | 'onTouchEnd' | false;
  disableReactTree?: boolean;
}

const CustomClickAwayListener: React.FC<ClickAwayListenerProps> = ({
  children,
  onClickAway,
  mouseEvent = 'onClick',
  touchEvent = 'onTouchEnd',
  disableReactTree = false,
}) => {
  const nodeRef = useRef<HTMLElement>(null);
  const activatedRef = useRef(false);
  const syntheticEventRef = useRef(false);

  useEffect(() => {
    // Delay setting up event listeners to avoid immediate triggers
    const timeout = setTimeout(() => {
      activatedRef.current = true;
    }, 0);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const handleClickAway = (event: MouseEvent | TouchEvent) => {
      // Ignore events that happened before the listener was activated
      if (!activatedRef.current) {
        return;
      }

      // Ignore synthetic events (React events that bubbled up)
      if (syntheticEventRef.current) {
        syntheticEventRef.current = false;
        return;
      }

      const node = nodeRef.current;
      if (!node) {
        return;
      }

      // Check if the click was outside the component
      if (node.contains(event.target as Node) || (disableReactTree && node === event.target)) {
        return;
      }

      onClickAway(event);
    };

    const doc = document;

    if (mouseEvent !== false) {
      doc.addEventListener(
        mouseEvent.toLowerCase().slice(2) as keyof DocumentEventMap,
        handleClickAway as EventListener,
      );
    }

    if (touchEvent !== false) {
      doc.addEventListener(
        touchEvent.toLowerCase().slice(2) as keyof DocumentEventMap,
        handleClickAway as EventListener,
      );
    }

    return () => {
      if (mouseEvent !== false) {
        doc.removeEventListener(
          mouseEvent.toLowerCase().slice(2) as keyof DocumentEventMap,
          handleClickAway as EventListener,
        );
      }

      if (touchEvent !== false) {
        doc.removeEventListener(
          touchEvent.toLowerCase().slice(2) as keyof DocumentEventMap,
          handleClickAway as EventListener,
        );
      }
    };
  }, [mouseEvent, touchEvent, onClickAway, disableReactTree]);

  const handleSyntheticEvent = () => {
    syntheticEventRef.current = true;
  };

  // Clone the child element and add ref and synthetic event handlers
  const child = cloneElement(children, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ref: (node: HTMLElement | null) => {
      nodeRef.current = node;

      // Call the original ref if it exists
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { ref } = children;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object' && 'current' in ref) {
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    ...(mouseEvent !== false && {
      [mouseEvent]: (event: React.MouseEvent) => {
        handleSyntheticEvent();
        const originalHandler = (children.props as any)[mouseEvent];
        if (originalHandler) {
          originalHandler(event);
        }
      },
    }),
    ...(touchEvent !== false && {
      [touchEvent]: (event: React.TouchEvent) => {
        handleSyntheticEvent();
        const originalHandler = (children.props as any)[touchEvent];
        if (originalHandler) {
          originalHandler(event);
        }
      },
    }),
  });

  return child;
};

export default CustomClickAwayListener;
