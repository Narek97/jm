import React, { useState, useRef, useEffect, ReactNode, ReactElement } from 'react';

// TypeScript interfaces
interface TabProps {
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  index?: number;
  active?: boolean;
  onClick?: () => void;
  variant?: 'standard' | 'fullWidth' | 'scrollable';
  orientation?: 'horizontal' | 'vertical';
}

interface TabPanelProps {
  children: ReactNode;
  active?: boolean;
}

interface CustomTabsProps {
  children: ReactNode;
  defaultValue?: number;
  onChange?: (index: number) => void;
  variant?: 'standard' | 'fullWidth' | 'scrollable';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const CustomTabs: React.FC<CustomTabsProps> = ({
  children,
  defaultValue = 0,
  onChange,
  variant = 'standard',
  orientation = 'horizontal',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<number>(defaultValue);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const tabsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    updateIndicator();
  }, [activeTab, orientation]);

  const updateIndicator = () => {
    const activeTabElement = tabsRef.current[activeTab];
    if (activeTabElement) {
      if (orientation === 'vertical') {
        setIndicatorStyle({
          height: activeTabElement.offsetHeight,
          top: activeTabElement.offsetTop,
          width: '3px',
        });
      } else {
        setIndicatorStyle({
          width: activeTabElement.offsetWidth,
          left: activeTabElement.offsetLeft,
          height: '2px',
        });
      }
    }
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    onChange?.(index);
  };

  const tabItems: ReactElement[] = [];
  const tabPanels: ReactElement[] = [];

  React.Children.forEach(children, (child, index) => {
    if (React.isValidElement(child)) {
      if (child.type === Tab) {
        tabItems.push(
          React.cloneElement(child as ReactElement<TabProps>, {
            key: index,
            index,
            active: activeTab === index,
            onClick: () => handleTabClick(index),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ref: (el: HTMLDivElement | null) => (tabsRef.current[index] = el),
            variant,
            orientation,
          }),
        );
      } else if (child.type === TabPanel) {
        tabPanels.push(
          React.cloneElement(child as ReactElement<TabPanelProps>, {
            key: index,
            active: (child.props as TabPanelProps).active,
          }),
        );
      }
    }
  });

  const getTabsContainerClasses = () => {
    const base = 'relative flex';
    const orientationClasses =
      orientation === 'vertical' ? 'flex-col border-r border-gray-200' : 'border-b border-gray-200';
    const variantClasses = {
      standard: '',
      fullWidth: orientation === 'horizontal' ? 'w-full' : '',
      scrollable: orientation === 'horizontal' ? 'overflow-x-auto' : 'overflow-y-auto',
    };

    return `${base} ${orientationClasses} ${variantClasses[variant]}`;
  };

  const getIndicatorClasses = () => {
    const base = 'absolute bg-blue-500 transition-all duration-300 ease-out';
    return orientation === 'vertical' ? `${base} left-0 w-0.5` : `${base} bottom-0 h-0.5`;
  };

  const getLayoutClasses = () => {
    return orientation === 'vertical' ? 'flex gap-6' : 'w-full';
  };

  const getContentClasses = () => {
    return orientation === 'vertical' ? 'flex-1' : 'mt-4';
  };
  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      <div className={getTabsContainerClasses()}>
        <div className={`flex relative ${orientation === 'vertical' ? 'flex-col' : ''}`}>
          {tabItems}
          <div className={getIndicatorClasses()} style={indicatorStyle} />
        </div>
      </div>
      <div className={getContentClasses()}>{tabPanels}</div>
    </div>
  );
};

export const Tab = React.forwardRef<HTMLDivElement, TabProps>(
  (
    { children, active, onClick, disabled, icon, variant = 'standard', orientation = 'horizontal' },
    ref,
  ) => {
    const getBaseClasses = () => {
      const base =
        'px-6 py-3 font-medium text-sm transition-all duration-200 cursor-pointer relative flex items-center gap-2 min-w-fit whitespace-nowrap';
      const orientationClasses = orientation === 'vertical' ? 'justify-start w-full' : '';
      return `${base} ${orientationClasses}`;
    };

    const activeClasses = active
      ? 'text-[#1b87e6]'
      : 'text-[#878f99] hover:text-[#545e6b] hover:bg-gray-50';

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    const getVariantClasses = () => {
      if (orientation === 'vertical') return '';

      const variantClasses = {
        standard: '',
        fullWidth: 'flex-1 justify-center',
        scrollable: 'flex-shrink-0',
      };
      return variantClasses[variant];
    };

    return (
      <div
        ref={ref}
        className={`${getBaseClasses()} ${activeClasses} ${disabledClasses} ${getVariantClasses()}`}
        onClick={!disabled ? onClick : undefined}
        role="tab"
        aria-selected={active}
        tabIndex={disabled ? -1 : 0}>
        {icon && <span className="text-lg">{icon}</span>}
        {children}
      </div>
    );
  },
);

Tab.displayName = 'Tab';

export const TabPanel: React.FC<TabPanelProps> = ({ children, active }) => {
  if (!active) return null;

  return (
    <div role="tabpanel" className="animate-in fade-in duration-200">
      {children}
    </div>
  );
};
