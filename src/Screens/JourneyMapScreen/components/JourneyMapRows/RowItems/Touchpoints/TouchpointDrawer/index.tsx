import { FC, useEffect, useState } from 'react';

import './style.scss';

import Drawer from '@mui/material/Drawer';
import { useWuShowToast, WuButton } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { v4 as uuidv4 } from 'uuid';

import {
  CreateTouchPointsMutation,
  useCreateTouchPointsMutation,
} from '@/api/mutations/generated/createTouchPoints.generated.ts';
import {
  GetTouchPointIconsQuery,
  useGetTouchPointIconsQuery,
} from '@/api/queries/generated/getTouchPointIcons.generated.ts';
import CustomTabs from '@/Components/Shared/CustomTabs';
import { TOUCHPOINT_ICONS_LIMIT } from '@/constants/pagination';
import {
  JOURNEY_TOUCHPOINT_SETTINGS_TAB_PANELS,
  JOURNEY_TOUCHPOINT_SETTINGS_TABS,
} from '@/Screens/JourneyMapScreen/constants';
import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { useTouchpointsStore } from '@/store/touchpoints.ts';
import { useUndoRedoStore } from '@/store/undoRedo.ts';
import { ActionsEnum, JourneyMapRowTypesEnum, TouchpointIconsEnum } from '@/types/enum.ts';

interface ITouchpointDrawer {
  rowItemID: number;
  mapId: number;
  setSelectedStepId: number | null;
  selectedColumnId: number | null;
  isOpenDrawer: boolean;
  onHandleToggleTouchpointDrawer: () => void;
}

const TouchpointDrawer: FC<ITouchpointDrawer> = ({
  rowItemID,
  mapId,
  setSelectedStepId,
  selectedColumnId,
  isOpenDrawer,
  onHandleToggleTouchpointDrawer,
}) => {
  const { showToast } = useWuShowToast();

  const queryClient = useQueryClient();
  const location = useLocation();
  const isGuest = location.pathname.includes('/guest');

  const { updateMapByType } = useUpdateMap();

  const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();
  const { selectedJourneyMapPersona } = useJourneyMapStore();
  const {
    selectedTouchpoints,
    selectedCustomTouchpoints,
    setSelectedTouchpoints,
    setSelectedCustomTouchpoints,
    setTouchPointCustomIcons,
  } = useTouchpointsStore();

  const [selectedTab, setSelectedTab] = useState<TouchpointIconsEnum>(TouchpointIconsEnum.ALL);

  const { data: dataTouchPointIcons } = useGetTouchPointIconsQuery<GetTouchPointIconsQuery, Error>(
    {
      getTouchpointIconsInput: {
        limit: TOUCHPOINT_ICONS_LIMIT,
        offset: 0,
        search: '',
      },
    },
    {
      enabled: !isGuest,
    },
  );

  const { mutate: mutateTouchPoints, isPending: isLoadingTouchPoints } =
    useCreateTouchPointsMutation<Error, CreateTouchPointsMutation>({
      onError: error => {
        showToast({
          variant: 'error',
          message: error?.message,
        });
      },
    });

  const onSelectTab = (tabValue: string) => {
    setSelectedTab(tabValue as TouchpointIconsEnum);
  };

  const onHandleDeleteTouchpoint = (uuid?: string) => {
    setSelectedTouchpoints(selectedTouchpoints.filter(el => el.uuid !== uuid));
  };

  const onHandleDeleteCustomTouchpoint = (uuid: string) => {
    setSelectedCustomTouchpoints(selectedCustomTouchpoints.filter(el => el.uuid !== uuid));
  };

  const onHandleClose = () => {
    setSelectedTouchpoints([]);
    setSelectedCustomTouchpoints([]);
    onHandleToggleTouchpointDrawer();
  };

  const onHandleSave = () => {
    const touchPoints = selectedTouchpoints.map(touchpoint => ({
      id: touchpoint.id,
      title: touchpoint.name,
      iconId:
        touchpoint.type === 'NOUN_PROJECT_ICON'
          ? touchpoint.url
          : `${import.meta.env.VITE_SVG_URL}custom-touchpoints/${touchpoint.key}`,
    }));
    const customTouchpoints = selectedCustomTouchpoints.map(touchpoint => ({
      id: touchpoint.id,
      title: touchpoint.name,
      customIconId: touchpoint.id,
    }));

    mutateTouchPoints(
      {
        createTouchPointInput: {
          rowId: rowItemID,
          mapId: mapId,
          stepId: setSelectedStepId || 1,
          columnId: selectedColumnId || 1,
          touchPoints: [...touchPoints, ...customTouchpoints],
          personaId: selectedJourneyMapPersona?.id || null,
        },
      },
      {
        onSuccess: async response => {
          if (response.createTouchPoints.deletedAttachments.length) {
            const result = customTouchpoints
              .filter(item => response.createTouchPoints.deletedAttachments.includes(item.id)) // Filter arr where id is in arr2
              .map((item, index) => `${index + 1}-${item.title}`) // Map the result to format ".title"
              .join(' '); // Join the array into a string

            showToast({
              variant: 'warning',
              message: `The following touch points weren't created as they doesn't exist in the system any more. \n ${result}`,
            });
            await queryClient.invalidateQueries({
              queryKey: ['GetTouchPointIcons'],
            });
          }
          updateMapByType(JourneyMapRowTypesEnum.TOUCHPOINTS, ActionsEnum.CREATE, {
            touchPoints: response.createTouchPoints.createdTouchpoints,
            rowId: rowItemID,
            stepId: setSelectedStepId,
            columnId: selectedColumnId,
            mapID: mapId,
          });
          updateRedoActions([]);
          updateUndoActions([
            ...undoActions,
            {
              id: uuidv4(),
              type: JourneyMapRowTypesEnum.TOUCHPOINTS,
              action: ActionsEnum.DELETE,
              data: {
                touchPoints: response.createTouchPoints.createdTouchpoints,
                rowId: rowItemID,
                stepId: setSelectedStepId,
                columnId: selectedColumnId,
                mapID: mapId,
              },
            },
          ]);
          onHandleClose();
        },
      },
    );
  };

  useEffect(() => {
    if (dataTouchPointIcons) {
      setTouchPointCustomIcons(
        dataTouchPointIcons.getTouchPointIcons.attachments.map(touchPointIcon => ({
          ...touchPointIcon,
          uuid: uuidv4(),
        })),
      );
    }
  }, [dataTouchPointIcons, setTouchPointCustomIcons]);

  return (
    <Drawer
      anchor={'left'}
      open={isOpenDrawer}
      onClose={() => !isLoadingTouchPoints && onHandleClose()}>
      <div data-testid="add-touchpoint-drawer" className={'add-touchpoint-drawer'}>
        {isOpenDrawer && (
          <>
            <div className={'add-touchpoint-drawer--header'}>
              <p
                className={'add-touchpoint-drawer--title'}
                data-testid={'touchpoint-drawer-title-test-id'}>
                Touchpoints
              </p>
              <button
                className={'add-touchpoint-drawer--clos-btn'}
                data-testid={'touchpoint-drawer-close-test-id'}
                onClick={onHandleClose}>
                <span className={'wm-close'} />
              </button>
            </div>
            <div className={'add-touchpoint-drawer--content'}>
              <div className={'add-touchpoint-drawer--tabs'}>
                <CustomTabs
                  orientation={'vertical'}
                  tabValue={selectedTab}
                  setTabValue={onSelectTab}
                  activeColor={'#545E6B'}
                  inactiveColor={'#9B9B9B'}
                  tabsBottomBorderColor={'#FFFFFF'}
                  tabs={JOURNEY_TOUCHPOINT_SETTINGS_TABS(
                    dataTouchPointIcons?.getTouchPointIcons.count || 0,
                  )}
                  tabPanels={JOURNEY_TOUCHPOINT_SETTINGS_TAB_PANELS}
                />
              </div>

              <div className={'add-touchpoint-drawer--selected-touchpoints'}>
                <p className={'add-touchpoint-drawer--selected-touchpoints--title'}>
                  Selected touchpoints
                </p>
                <ul className={'add-touchpoint-drawer--selected-touchpoints--content'}>
                  {!selectedTouchpoints.length && !selectedCustomTouchpoints.length ? (
                    <p className={'add-touchpoint-drawer--selected-touchpoints--nod-data'}>
                      Select touchpoints to view them here.
                    </p>
                  ) : null}
                  {selectedTouchpoints.map(touchpoint => (
                    <li
                      key={touchpoint.id}
                      data-testid={'selected-touchpoint-item-test-id'}
                      className={'add-touchpoint-drawer--selected-touchpoint'}>
                      <img
                        src={
                          touchpoint.type === 'NOUN_PROJECT_ICON'
                            ? touchpoint.url || ''
                            : `${import.meta.env.VITE_SVG_URL}custom-touchpoints/${touchpoint.key}`
                        }
                        alt={touchpoint.name}
                        style={{
                          width: '1rem',
                          height: '1rem',
                        }}
                      />
                      <p className={'add-touchpoint-drawer--selected-touchpoint--name'}>
                        {touchpoint.name}
                      </p>
                      <button
                        aria-label={'delete'}
                        data-testid={'selected-touchpoint-delete-item-btn-test-id'}
                        className={'add-touchpoint-drawer--selected-touchpoint--delete-btn'}
                        onClick={() => onHandleDeleteTouchpoint(touchpoint.uuid)}>
                        <span className={'wm-close'} />
                      </button>
                    </li>
                  ))}
                  {selectedCustomTouchpoints.map(touchpoint => (
                    <li
                      key={touchpoint.id}
                      data-testid={'selected-touchpoint-item-test-id'}
                      className={'add-touchpoint-drawer--selected-touchpoint'}>
                      <img
                        src={
                          touchpoint.type === 'TOUCHPOINT_ICON'
                            ? `${import.meta.env.VITE_AWS_URL}/${touchpoint?.url}/large${touchpoint?.key}`
                            : touchpoint.url
                        }
                        alt={touchpoint.name || 'img'}
                        style={{
                          width: '1rem',
                          height: '1rem',
                        }}
                      />
                      <p className={'add-touchpoint-drawer--selected-touchpoint--name'}>
                        {touchpoint.name}
                      </p>
                      <button
                        aria-label={'delete'}
                        data-testid={'selected-touchpoint-delete-item-btn-test-id'}
                        className={'add-touchpoint-drawer--selected-touchpoint--delete-btn'}
                        onClick={() => onHandleDeleteCustomTouchpoint(touchpoint.uuid)}>
                        <span className={'wm-close'} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={'add-touchpoint-drawer--footer'}>
              <div className={'add-touchpoint-drawer--footer--divider'} />
              <WuButton
                data-testid={'add-touchpoint-btn-test-id'}
                id={'add-touchpoint-btn'}
                onClick={onHandleSave}
                disabled={isLoadingTouchPoints}>
                Save
              </WuButton>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default TouchpointDrawer;
