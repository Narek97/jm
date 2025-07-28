import { ChangeEvent, FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import './style.scss';

import {
  useWuShowToast,
  WuButton,
  WuMenu,
  WuMenuItem,
  WuTooltip,
} from '@npm-questionpro/wick-ui-lib';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';

import { useUndoRedo } from '../../hooks/useUndoRedo';

import $apiClient from '@/api/axios.ts';
import {
  UpdateJourneyMapMutation,
  useUpdateJourneyMapMutation,
} from '@/api/mutations/generated/updateJourneyMap.generated';
import {
  GetMapDetailsQuery,
  useGetMapDetailsQuery,
} from '@/api/queries/generated/getMapDetails.generated';
import {
  GetParentMapChildrenQuery,
  useGetParentMapChildrenQuery,
} from '@/api/queries/generated/getParentMapChildren.generated';
import PersonaImageBox from '@/Components/Feature/PersonaImageBox';
import BaseWuInput from '@/Components/Shared/BaseWuInput';
import BaseWuMenu from '@/Components/Shared/BaseWuMenu';
import CustomDrawer from '@/Components/Shared/CustomDrawer';
import { querySlateTime } from '@/Constants';
import ErrorBoundary from '@/Features/ErrorBoundary';
import { debounced400 } from '@/Hooks/useDebounce';
import { useSetQueryDataByKey } from '@/Hooks/useQueryKey.ts';
import ConvertChildModal from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/ConvertChildModal';
import HistoryDrawer from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/JourneyMapHistoryDrawer';
import JourneyMapLayersModal from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/JourneyMapLayersModal';
import VersionDrawer from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/JourneyMapVersionDrawer';
import { MAP_HEADER_OPTIONS } from '@/Screens/JourneyMapScreen/constants.tsx';
import { useSelectLayerForMap } from '@/Screens/JourneyMapScreen/hooks/useSelectLayerForMap.tsx';
import { LayerType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/Store/journeyMap.ts';
import { useLayerStore } from '@/Store/layers.ts';
import { useUserStore } from '@/Store/user.ts';
import { ImageSizeEnum } from '@/types/enum.ts';
import { isDateFormat } from '@/utils/isDateFormat.ts';

interface IJourneyMapHeader {
  title: string;
  isGuest: boolean;
  boardId: number;
  mapId: number;
  changeMapFullLoadingState: () => void;
}

const JourneyMapHeader: FC<IJourneyMapHeader> = memo(
  ({ title, isGuest, boardId, mapId, changeMapFullLoadingState }) => {
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();
    const { showToast } = useWuShowToast();
    const { handleUndo, handleRedo } = useUndoRedo();
    const { selectLayerForJourneyMap } = useSelectLayerForMap();

    const { user } = useUserStore();
    const {
      journeyMapVersion,
      defaultJourneyMap,
      selectedJourneyMapPersona,
      updateJourneyMap,
      updateJourneyMapVersion,
      updateIsOpenSelectedJourneyMapPersonaInfo,
    } = useJourneyMapStore();
    const { layers, currentLayer } = useLayerStore();

    const navigate = useNavigate();

    const [titleValue, setTitleValue] = useState<string>(title);
    const [isOpenLayersModal, setIsOpenLayersModal] = useState<boolean>(false);
    const [isOpenHistoryDrawer, setIsOpenHistoryDrawer] = useState<boolean>(false);
    const [isOpenConvertChildModal, setIsOpenConvertChildModal] = useState<boolean>(false);
    const [isOpenVersionDrawer, setIsOpenVersionDrawer] = useState<boolean>(false);

    const setJourneyMapQuery = useSetQueryDataByKey('GetJourneyMap');

    const headerRef = useRef<HTMLDivElement>(null);

    const { mutate: mutateUpdateJourneyMap } = useUpdateJourneyMapMutation<
      UpdateJourneyMapMutation,
      Error
    >();

    const { data: mapDetailsData } = useGetMapDetailsQuery<GetMapDetailsQuery, Error>(
      {
        mapId,
      },
      {
        enabled: !!mapId && !isGuest,
      },
    );

    const { data: childData } = useGetParentMapChildrenQuery<GetParentMapChildrenQuery, Error>(
      {
        parentMapId: mapId,
      },
      {
        staleTime: querySlateTime,
        enabled: !!mapId && !isGuest,
      },
    );

    const onHandleUpdateTitle = (e: ChangeEvent<HTMLInputElement>) => {
      setTitleValue(e.target.value);
      const newTitle = e.target.value;

      debounced400(() => {
        mutateUpdateJourneyMap(
          {
            updateJourneyMapInput: {
              mapId,
              title: newTitle,
            },
          },
          {
            onSuccess: () => {
              setJourneyMapQuery((oldData: any) => {
                if (oldData) {
                  return {
                    getJourneyMap: {
                      ...oldData.getJourneyMap,
                      map: {
                        ...oldData.getJourneyMap.map,
                        title: newTitle,
                      },
                    },
                  };
                }
              });
            },
          },
        );
        setTitleValue(newTitle);
      });
    };

    const onHandleCopyPageUrl = useCallback(async () => {
      await navigator.clipboard?.writeText(
        `${import.meta.env.VITE_APP_URL}/guest/board/${boardId}/journey-map/${mapId}`,
      );
      showToast({
        variant: 'success',
        message: 'The page URL was copied successfully.',
      });
    }, [boardId, mapId, showToast]);

    const onHandleOpenDebugTable = useCallback(() => {
      navigate({
        to: `${mapId}/debug`,
      }).then();
    }, [mapId, navigate]);

    const onHandleToggleHistoryDrawer = useCallback(() => {
      setIsOpenHistoryDrawer(prev => !prev);
    }, []);

    const onHandleToggleConvertChildModal = useCallback(() => {
      setIsOpenConvertChildModal(prev => !prev);
    }, []);

    const onHandleToggleVersionDrawer = useCallback(() => {
      setIsOpenVersionDrawer(prev => !prev);
    }, []);

    const onHandleDownloadPdf = useCallback(async () => {
      showToast({
        variant: 'info',
        message: 'Download is in progress. It may take a few seconds.',
        duration: 2000,
      });
      const url = `${import.meta.env.VITE_QP_API}}/pdf/map/${mapId}`;
      try {
        await $apiClient.get(url);
      } catch (error) {
        console.error(error);
      }
    }, [mapId, showToast]);

    const toggleLayersModal = () => {
      setIsOpenLayersModal(prev => !prev);
    };

    const openLayer = useCallback(
      (item: LayerType, isBase: boolean) => {
        if (item.id !== currentLayer.id) {
          selectLayerForJourneyMap(item, isBase);
          changeMapFullLoadingState();
        }
      },
      [changeMapFullLoadingState, currentLayer.id, selectLayerForJourneyMap],
    );

    const onHandleBackCurrentVersion = () => {
      if (defaultJourneyMap) {
        updateJourneyMap(defaultJourneyMap);
        updateJourneyMapVersion(null);
      }
    };

    const onHandleNavigateParentMap = useCallback(
      (mapId?: number) => {
        navigate({
          to: `/board/${boardId}/journey-map/${mapId || mapDetailsData?.getMapDetails?.parentMap?.id}`,
        }).then();
      },
      [boardId, mapDetailsData?.getMapDetails?.parentMap?.id, navigate],
    );

    const options = useMemo(() => {
      return MAP_HEADER_OPTIONS({
        isDebugMode: user?.debugMode || false,
        isSingle:
          !mapDetailsData?.getMapDetails?.isParentMap && !mapDetailsData?.getMapDetails?.isChildMap,
        onHandleCopyPageUrl,
        onHandleOpenDebugTable,
        onHandleToggleVersionDrawer,
        onHandleToggleHistoryDrawer,
        onHandleToggleConvertChildModal,
        onHandleDownloadPdf,
      });
    }, [
      mapDetailsData?.getMapDetails?.isChildMap,
      mapDetailsData?.getMapDetails?.isParentMap,
      onHandleCopyPageUrl,
      onHandleDownloadPdf,
      onHandleOpenDebugTable,
      onHandleToggleConvertChildModal,
      onHandleToggleHistoryDrawer,
      onHandleToggleVersionDrawer,
      user?.debugMode,
    ]);

    const layersOptions = useMemo(() => {
      return (
        layers?.map((layerItem, index) => ({
          id: layerItem.id,
          name: layerItem.name,
          value: layerItem.id,
          onClick: () => openLayer(layerItem, index === 0),
        })) || []
      );
    }, [layers, openLayer]);

    const topOptions = useMemo(() => {
      return [
        {
          id: 'manage-layers',
          name: 'Manage layers',
          onClick: toggleLayersModal,
        },
      ];
    }, []);

    useEffect(() => {
      setTitleValue(title.trim() || 'Untitled');
    }, [title]);

    return (
      <div
        className={'journey-map-header'}
        id={'journey-map-header'}
        ref={headerRef}
        style={{ pointerEvents: isGuest ? 'none' : 'inherit' }}>
        {isOpenLayersModal && (
          <JourneyMapLayersModal
            mapId={mapId}
            isOpenLayersModal={isOpenLayersModal}
            closeLayersModal={toggleLayersModal}
          />
        )}
        {isOpenConvertChildModal && (
          <ConvertChildModal
            mapId={mapId}
            boardId={boardId}
            isOpenLayersModal={isOpenConvertChildModal}
            closeLayersModal={onHandleToggleConvertChildModal}
          />
        )}
        <ErrorBoundary>
          <CustomDrawer
            anchor={'right'}
            data-testid="drawer-test-id"
            open={isOpenHistoryDrawer}
            onClose={onHandleToggleHistoryDrawer}>
            <HistoryDrawer mapID={mapId} onHandleClose={onHandleToggleHistoryDrawer} />
          </CustomDrawer>
        </ErrorBoundary>

        <ErrorBoundary>
          <CustomDrawer
            anchor={'right'}
            data-testid="version-drawer-test-id"
            open={isOpenVersionDrawer}
            onClose={onHandleToggleVersionDrawer}>
            <VersionDrawer mapID={mapId} onHandleClose={onHandleToggleVersionDrawer} />
          </CustomDrawer>
        </ErrorBoundary>

        <div className={'journey-map-header--top-block'}>
          <div className={'journey-map-header--left-block'}>
            {selectedJourneyMapPersona && (
              <button
                onClick={() => updateIsOpenSelectedJourneyMapPersonaInfo(true)}
                aria-label={'Persona'}>
                <PersonaImageBox
                  title={''}
                  size={ImageSizeEnum.SM}
                  imageItem={{
                    color: selectedJourneyMapPersona.color || '',
                    attachment: {
                      id: selectedJourneyMapPersona.attachment?.id || 0,
                      url: selectedJourneyMapPersona.attachment?.url || '',
                      key: selectedJourneyMapPersona.attachment?.key || '',
                      croppedArea: selectedJourneyMapPersona?.croppedArea,
                    },
                  }}
                />
              </button>
            )}

            <>
              <div>
                {mapDetailsData?.getMapDetails?.isChildMap && (
                  <WuTooltip
                    className={'wu-tooltip-content'}
                    content={'Go to ' + mapDetailsData?.getMapDetails?.parentMap?.title}
                    position="bottom">
                    <WuButton
                      className={'child-parent-map-icon'}
                      onClick={() => onHandleNavigateParentMap()}
                      Icon={<span className="wc-level-child" />}
                      variant="iconOnly"
                    />
                  </WuTooltip>
                )}

                {mapDetailsData?.getMapDetails?.isParentMap && (
                  <WuMenu
                    Trigger={
                      <WuButton
                        className={'child-parent-map-icon'}
                        Icon={<span className="wc-level-parent" />}
                        variant="iconOnly"
                      />
                    }>
                    {childData?.getParentMapChildren.map(child => (
                      <WuMenuItem
                        key={child.id}
                        onSelect={() => {
                          onHandleNavigateParentMap(child.id);
                        }}>
                        {child.title}
                      </WuMenuItem>
                    ))}
                  </WuMenu>
                )}
              </div>
              {journeyMapVersion ? (
                <div className="journey-map-header--go-back-block">
                  <button onClick={onHandleBackCurrentVersion}>
                    <span className={'wm-arrow-back'} />
                  </button>
                  <p className="journey-map-header--title">
                    {isDateFormat(journeyMapVersion.versionName, 'MMMM D, h:mm A')
                      ? dayjs(journeyMapVersion.versionName).format('MMMM D, h:mm A')
                      : journeyMapVersion.versionName}
                  </p>
                </div>
              ) : (
                <BaseWuInput
                  className={'border-[none] bg-transparent'}
                  value={titleValue}
                  data-testid="journey-map-test-id"
                  id={'map-title'}
                  onChange={onHandleUpdateTitle}
                  onKeyDown={event => {
                    if (event.keyCode === 13) {
                      event.preventDefault();
                      (event.target as HTMLElement).blur();
                    }
                  }}
                />
              )}
            </>
          </div>
          <div className="journey-map-header--right-block">
            <div className="journey-map-header--right-block--operations">
              {!isGuest && (
                <>
                  <div className={'map-layers'}>
                    <BaseWuMenu
                      options={layersOptions}
                      topOptions={topOptions}
                      name={'Base layers'}
                    />
                  </div>
                  {journeyMapVersion ? null : (
                    <>
                      <WuTooltip
                        className="wu-tooltip-content"
                        content={`Undo`}
                        dir="ltr"
                        duration={200}
                        position="bottom">
                        <WuButton
                          onClick={handleUndo}
                          disabled={!!(isFetching || isMutating)}
                          Icon={
                            <span data-testid={'undo-map-btn'} className="wm-undo wu-tooltip-btn" />
                          }
                          variant="iconOnly"
                        />
                      </WuTooltip>

                      <WuTooltip
                        className="wu-tooltip-content"
                        content={`Redo`}
                        dir="ltr"
                        duration={200}
                        position="bottom">
                        <WuButton
                          disabled={!!(isFetching || isMutating)}
                          onClick={handleRedo}
                          Icon={
                            <span data-testid={'redo-map-btn'} className="wm-redo wu-tooltip-btn" />
                          }
                          variant="iconOnly"
                        />
                      </WuTooltip>
                    </>
                  )}
                  <BaseWuMenu options={options} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default JourneyMapHeader;
