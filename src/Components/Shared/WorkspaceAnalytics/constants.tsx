import { ReactNode } from 'react';

export const WORKSPACE_ANALYTICS_ITEMS = (
  onHandleClick: (type: string) => void,
): Array<{
  name: string;
  key: 'journeyMapCount' | 'personasCount';
  icon: ReactNode;
  onClick: () => void;
}> => [
  {
    key: 'journeyMapCount',
    name: 'Journeys',
    icon: <span className="wm-map" />,
    onClick: () => onHandleClick('Journeys'),
  },
  {
    key: 'personasCount',
    name: 'Personas',
    icon: <span className="wm-person" />,
    onClick: () => onHandleClick('Personas'),
  },
];
