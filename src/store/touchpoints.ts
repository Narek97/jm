import { create } from 'zustand';

import { JourneyMapTouchpointIconsType } from '@/Screens/JourneyMapScreen/types.ts';

interface TouchpointsState {
  selectedTouchpoints: Array<JourneyMapTouchpointIconsType>;
  selectedCustomTouchpoints: Array<PersonaGalleryType>;
  touchPointCustomIcons: Array<JourneyMapTouchpointIconsType>;
  setSelectedTouchpoints: (touchpoints: Array<JourneyMapTouchpointIconsType>) => void;
  setSelectedCustomTouchpoints: (customTouchpoints: Array<PersonaGalleryType>) => void;
  setTouchPointCustomIcons: (customIcons: Array<JourneyMapTouchpointIconsType>) => void;
}

export const useTouchpointsStore = create<TouchpointsState>(set => ({
  selectedTouchpoints: [],
  selectedCustomTouchpoints: [],
  touchPointCustomIcons: [],
  setSelectedTouchpoints: touchpoints => set({ selectedTouchpoints: touchpoints }),
  setSelectedCustomTouchpoints: customTouchpoints =>
    set({ selectedCustomTouchpoints: customTouchpoints }),
  setTouchPointCustomIcons: customIcons => set({ touchPointCustomIcons: customIcons }),
}));
