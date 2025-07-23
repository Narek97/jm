import { FC } from 'react';
import './style.scss';

import { WuTooltip } from '@npm-questionpro/wick-ui-lib';

import PersonaImageBox from '@/Components/Feature/PersonaImageBox';
import AssignPersonaToMapModal from '@/Screens/JourneyMapScreen/components/JourneyMapFooter/AssignPersonaToMapModal';
import { MapSelectedPersonasType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/Store/journeyMap.ts';
import { ImageSizeEnum } from '@/types/enum';

interface IJourneyMapFooter {
  workspaceId?: number;
  mapId: number;
  isGuest: boolean;
}

const JourneyMapFooter: FC<IJourneyMapFooter> = ({ workspaceId, mapId, isGuest }) => {
  const {
    selectedJourneyMapPersona,
    mapAssignedPersonas,
    updateSelectedJourneyMapPersona,
    updateIsOpenSelectedJourneyMapPersonaInfo,
  } = useJourneyMapStore();

  const onHandleSelectJourneyMapFooterItem = (item: MapSelectedPersonasType | null) => {
    updateSelectedJourneyMapPersona(item);
  };

  return (
    <div className={'journey-map-footer'}>
      <WuTooltip position="top" content={'Overview'} showArrow>
        <button
          data-testid="overview-btn-test-id"
          className={`journey-map-footer--overview ${
            selectedJourneyMapPersona ? '' : 'journey-map-footer--selected-item'
          }`}
          onClick={() => {
            updateIsOpenSelectedJourneyMapPersonaInfo(false);
            onHandleSelectJourneyMapFooterItem(null);
          }}>
          <>
            <span
              className={'wm-group'}
              style={{
                color: '#1b87e6',
              }}
            />
          </>
        </button>
      </WuTooltip>

      {mapAssignedPersonas?.map(item => (
        <button
          data-testid={`footer--persona-test-id-${item.id}`}
          onClick={() => onHandleSelectJourneyMapFooterItem(item)}
          className={`journey-map-footer--persona  ${
            selectedJourneyMapPersona?.id === item?.id ? 'journey-map-footer--selected-item' : ''
          }`}
          key={item?.id}>
          <PersonaImageBox
            title={item.name}
            imageItem={{
              color: item?.color || '#B052A7',
              isSelected: true,
              attachment: {
                id: item?.attachment?.id || 0,
                url: item?.attachment?.url || '',
                key: item?.attachment?.key || '',
              },
            }}
            size={ImageSizeEnum.SM}
          />
        </button>
      ))}
      {!isGuest && workspaceId && (
        <AssignPersonaToMapModal workspaceId={workspaceId} mapId={mapId} />
      )}
    </div>
  );
};

export default JourneyMapFooter;
