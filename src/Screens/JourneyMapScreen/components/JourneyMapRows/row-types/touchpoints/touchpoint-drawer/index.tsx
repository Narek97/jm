import React, { FC, useState } from 'react';

import './style.scss';

import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation';

import Drawer from '@mui/material/Drawer';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import CustomButton from '@/components/atoms/custom-button/custom-button';
import CustomTabs from '@/components/atoms/custom-tabs/custom-tabs';
import { useUpdateMap } from '@/containers/journey-map-container/hooks/useUpdateMap';
import {
  CreateTouchPointsMutation,
  useCreateTouchPointsMutation,
} from '@/gql/mutations/generated/createTouchPoints.generated';
import {
  GetTouchPointIconsQuery,
  useGetTouchPointIconsQuery,
} from '@/gql/queries/generated/getTouchPointIcons.generated';
import CloseIcon from '@/public/base-icons/close.svg';
import DeleteIcon from '@/public/operations/xdelete.svg';
import { selectedJourneyMapPersona } from '@/store/atoms/journeyMap.atom';
import {
  selectedCustomTouchpointsState,
  selectedTouchpointsState,
} from '@/store/atoms/selectedTouchpoints.atom';
import { touchPointCustomIconsState } from '@/store/atoms/touchPointCustomIcons.atom';
import { redoActionsState, undoActionsState } from '@/store/atoms/undoRedo.atom';
import { TOUCHPOINT_ICONS_LIMIT } from '@/utils/constants/pagination';
import {
  JOURNEY_TOUCHPOINT_SETTINGS_TAB_PANELS,
  JOURNEY_TOUCHPOINT_SETTINGS_TABS,
} from '@/utils/constants/tabs';
import {
  ActionsEnum,
  JourneyMapRowTypesEnum,
  TouchpointIconsEnum,
} from '@/utils/ts/enums/global-enums';
import { JourneyMapTouchpointIconsType } from '@/utils/ts/types/journey-map/journey-map-types';

interface ITouchpointDrawer {
  rowItemID: number;
  setSelectedStepId: number | null;
  selectedColumnId: number | null;
  isOpenDrawer: boolean;
  onHandleToggleTouchpointDrawer: () => void;
}

const TouchpointDrawer: FC<ITouchpointDrawer> = ({
  rowItemID,
  setSelectedStepId,
  selectedColumnId,
  isOpenDrawer,
  onHandleToggleTouchpointDrawer,
}) => {
  const { mapID } = useParams();
  const { updateMapByType } = useUpdateMap();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const isGuest = pathname.includes('/guest');

  const { showToast } = useWuShowToast();
  const setUndoActions = useSetRecoilState(undoActionsState);
  const setRedoActions = useSetRecoilState(redoActionsState);
  const [selectedTouchpoints, setSelectedTouchpoints] = useRecoilState(selectedTouchpointsState);
  const [selectedCustomTouchpoints, setSelectedCustomTouchpoints] = useRecoilState(
    selectedCustomTouchpointsState,
  );
  const setTouchPointCustomIcons = useSetRecoilState(touchPointCustomIconsState);
  const selectedPerson = useRecoilValue(selectedJourneyMapPersona);

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
      onSuccess: response => {
        setTouchPointCustomIcons(
          response.getTouchPointIcons.attachments.map(touchPointIcon => ({
            ...touchPointIcon,
            uuid: uuidv4(),
          })) as Array<JourneyMapTouchpointIconsType>,
        );
      },
      enabled: !isGuest,
    },
  );

  const { mutate: mutateTouchPoints, isLoading: isLoadingTouchPoints } =
    useCreateTouchPointsMutation<CreateTouchPointsMutation, Error>();

  const onSelectTab = (tabValue: string) => {
    setSelectedTab(tabValue as TouchpointIconsEnum);
  };

  const onHandleDeleteTouchpoint = (uuid?: string) => {
    setSelectedTouchpoints(prev => prev.filter(el => el.uuid !== uuid));
  };

  const onHandleDeleteCustomTouchpoint = (uuid: string) => {
    setSelectedCustomTouchpoints(prev => prev.filter(el => el.uuid !== uuid));
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
          : `${process.env.NEXT_PUBLIC_SVG_URL}custom-touchpoints/${touchpoint.key}`,
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
          mapId: +mapID!,
          stepId: setSelectedStepId || 1,
          columnId: selectedColumnId || 1,
          touchPoints: [...touchPoints, ...customTouchpoints],
          personaId: selectedPerson?.id || null,
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
            mapID: +mapID!,
          });
          setRedoActions([]);
          setUndoActions(undoPrev => [
            ...undoPrev,
            {
              id: uuidv4(),
              type: JourneyMapRowTypesEnum.TOUCHPOINTS,
              action: ActionsEnum.DELETE,
              data: {
                touchPoints: response.createTouchPoints.createdTouchpoints,
                rowId: rowItemID,
                stepId: setSelectedStepId,
                columnId: selectedColumnId,
                mapID: +mapID!,
              },
            },
          ]);
          onHandleClose();
        },
      },
    );
  };

  return (
    <Drawer
      anchor={'left'}
      open={isOpenDrawer}
      onClose={() => !isLoadingTouchPoints && onHandleClose()}>
      <div data-testId="add-touchpoint-drawer" className={'add-touchpoint-drawer'}>
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
                <CloseIcon />
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
                      <Image
                        src={
                          touchpoint.type === 'NOUN_PROJECT_ICON'
                            ? touchpoint.url || ''
                            : `${process.env.NEXT_PUBLIC_SVG_URL}custom-touchpoints/${touchpoint.key}`
                        }
                        alt={touchpoint.name}
                        width={100}
                        height={100}
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
                        <DeleteIcon fill={'#545e6b'} />
                      </button>
                    </li>
                  ))}
                  {selectedCustomTouchpoints.map(touchpoint => (
                    <li
                      key={touchpoint.id}
                      data-testid={'selected-touchpoint-item-test-id'}
                      className={'add-touchpoint-drawer--selected-touchpoint'}>
                      <Image
                        src={
                          touchpoint.type === 'TOUCHPOINT_ICON'
                            ? `${process.env.NEXT_PUBLIC_AWS_URL}/${touchpoint?.url}/large${touchpoint?.key}`
                            : touchpoint.url
                        }
                        alt={touchpoint.name || 'img'}
                        width={100}
                        height={100}
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
                        onClick={() => onHandleDeleteCustomTouchpoint(touchpoint?.uuid!)}>
                        <DeleteIcon fill={'#545e6b'} height={10} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={'add-touchpoint-drawer--footer'}>
              <div className={'add-touchpoint-drawer--footer--divider'} />
              <CustomButton
                data-testid={'add-touchpoint-btn-test-id'}
                id={'add-touchpoint-btn'}
                startIcon={false}
                onClick={onHandleSave}
                isLoading={isLoadingTouchPoints}
                disabled={isLoadingTouchPoints}
                sxStyles={{
                  width: '6.5rem',
                }}>
                Save
              </CustomButton>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default TouchpointDrawer;
