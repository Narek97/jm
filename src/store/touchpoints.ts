import { create } from 'zustand';

import { JourneyMapTouchpointIconsType } from '@/Screens/JourneyMapScreen/types.ts';
import { AttachmentType } from '@/types';

interface TouchpointsState {
  selectedTouchpoints: Array<JourneyMapTouchpointIconsType>;
  selectedCustomTouchpoints: Array<AttachmentType>;
  touchPointCustomIcons: Array<JourneyMapTouchpointIconsType>;
  setSelectedTouchpoints: (touchpoints: Array<JourneyMapTouchpointIconsType>) => void;
  setSelectedCustomTouchpoints: (customTouchpoints: Array<AttachmentType>) => void;
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
