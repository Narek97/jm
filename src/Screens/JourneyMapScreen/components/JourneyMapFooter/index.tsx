import { FC, useCallback, useState } from 'react';
import './style.scss';

import { Tooltip } from '@mui/material';

import PersonaImageBox from '@/Components/Feature/PersonaImageBox';
import AssignPersonaToMapModal from '@/Screens/JourneyMapScreen/components/JourneyMapFooter/AssignPersonaToMapModal';
import { MapSelectedPersonasType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
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

  const [isOpenSelectedPersonasModal, setIsOpenSelectedPersonasModal] = useState<boolean>(false);

  const onHandleSelectJourneyMapFooterItem = (item: MapSelectedPersonasType | null) => {
    updateSelectedJourneyMapPersona(item);
  };

  const handleToggleAssignPersonaModal = useCallback(
    () => setIsOpenSelectedPersonasModal((prevState: boolean) => !prevState),
    [],
  );

  return (
    <div className={'journey-map-footer'}>
      <Tooltip placement="top" title={'Overview'} arrow>
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
      </Tooltip>

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
        <>
          {/*<WuModal*/}
          {/*  open={isOpenSelectedPersonasModal}*/}
          {/*  onOpenChange={setIsOpenSelectedPersonasModal}*/}
          {/*  Trigger={*/}
          {/*    <Tooltip placement="top" title={'Add new persona'} arrow>*/}
          {/*      <button*/}
          {/*        data-testid="add-btn-id"*/}
          {/*        disabled={false}*/}
          {/*        onClick={handleToggleAssignPersonaModal}*/}
          {/*        className={'journey-map-footer--add-new-persona-btn'}>*/}
          {/*        <span*/}
          {/*          className={'wm-person-add'}*/}
          {/*          style={{*/}
          {/*            color: '#1b87e6',*/}
          {/*          }}*/}
          {/*        />*/}
          {/*      </button>*/}
          {/*    </Tooltip>*/}
          {/*  }*/}
          {/*>*/}
          <AssignPersonaToMapModal
            isOpen={isOpenSelectedPersonasModal}
            workspaceId={workspaceId}
            mapId={mapId}
            handleClose={handleToggleAssignPersonaModal}
          />
          {/*</WuModal>*/}
        </>
      )}
    </div>
  );
};

export default JourneyMapFooter;
