import { FC, memo, useCallback, useMemo, useState } from 'react';

import './style.scss';

import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { WuTooltip } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

import {
  DeleteMapRowMutation,
  useDeleteMapRowMutation,
} from '@/api/mutations/generated/deleteMapRow.generated';
import { MapRowTypeEnum } from '@/api/types';
import HappyIcon from '@/Assets/public/emotions/happy.svg';
import ConsIcon from '@/Assets/public/mapRow/cons.svg';
import DividerIcon from '@/Assets/public/mapRow/divider.svg';
import ImageIcon from '@/Assets/public/mapRow/image.svg';
import InsightsIcon from '@/Assets/public/mapRow/insights.svg';
import InteractionIcon from '@/Assets/public/mapRow/interaction.svg';
import LinkIcon from '@/Assets/public/mapRow/link.svg';
import ListIcon from '@/Assets/public/mapRow/list.svg';
import MediaIcon from '@/Assets/public/mapRow/media.svg';
import MetricsIcon from '@/Assets/public/mapRow/metrics.svg';
import ProsIcon from '@/Assets/public/mapRow/pros.svg';
import TextIcon from '@/Assets/public/mapRow/text.svg';
import TouchpointIcon from '@/Assets/public/mapRow/touchpoint.svg';
import VideoIcon from '@/Assets/public/mapRow/video.svg';
import CustomInput from '@/Components/Shared/CustomInput';
import CustomLongMenu from '@/Components/Shared/CustomLongMenu';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import RowActionsDrawer from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/RowNameBlock/RowActionsDrawer';
import { JOURNEY_MAP_COLUM_ROW_OPTIONS } from '@/Screens/JourneyMapScreen/constants.tsx';
import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap';
import { useUpdatesStagesAndLanes } from '@/Screens/JourneyMapScreen/hooks/useUpdatesStagesAndLanes';
import { JourneyMapRowType } from '@/Screens/JourneyMapScreen/types';
import { useJourneyMapStore } from '@/Store/journeyMap';
import { useUndoRedoStore } from '@/Store/undoRedo.ts';
import {
  ActionsEnum,
  JourneyMapRowActionEnum,
  JourneyMapRowTypesEnum,
  MenuViewTypeEnum,
} from '@/types/enum';
import { getPageContentByKey } from '@/utils/getPageContentByKey.ts';

interface IRowNameBlock {
  updateLabel: (data: { rowId: number; previousLabel: string; label: string }) => void;
  rowItem: JourneyMapRowType;
  index: number;
  rowsLength: number;
  disabled?: boolean;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
  isLayerModeOn: boolean;
}

const RowNameBlock: FC<IRowNameBlock> = memo(
  ({ updateLabel, rowItem, index, rowsLength, disabled, dragHandleProps, isLayerModeOn }) => {
    const { updateMapByType } = useUpdateMap();
    const queryClient = useQueryClient();

    const { updateLanes } = useUpdatesStagesAndLanes();

    const { mapOutcomeGroups, updateMapOutcomeGroups } = useJourneyMapStore();
    const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();
    const [isFocused, setIsFocused] = useState(false);

    const [labelValue, setLabelValue] = useState<string>(rowItem?.label || '');

    const onHandleUpdateJourneyMap = useCallback(async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['GetJourneyMapRows.infinite'] }),
        queryClient.invalidateQueries({ queryKey: ['GetJourneyMap'] }),
      ]);
    }, [queryClient]);

    const { mutate: mutateDeleteRow } = useDeleteMapRowMutation<Error, DeleteMapRowMutation>({
      onSuccess: async () => {
        updateRedoActions([]);
        updateUndoActions([
          ...undoActions,
          {
            id: uuidv4(),
            type: JourneyMapRowActionEnum.ROW,
            action: ActionsEnum.CREATE,
            data: {
              index,
              rowItem,
            },
          },
        ]);
        updateLanes(
          {
            id: rowItem?.id,
            label: rowItem?.label,
          },
          ActionsEnum.DELETE,
        );

        await onHandleUpdateJourneyMap();
      },
    });

    const onHandleDelete = useCallback(() => {
      if (rowItem.rowFunction === MapRowTypeEnum.Outcomes && rowItem.outcomeGroup) {
        updateMapOutcomeGroups([...mapOutcomeGroups, rowItem.outcomeGroup]);
      }
      mutateDeleteRow({
        id: rowItem.id,
      });
    }, [
      mapOutcomeGroups,
      mutateDeleteRow,
      rowItem.id,
      rowItem.outcomeGroup,
      rowItem.rowFunction,
      updateMapOutcomeGroups,
    ]);

    const onHandleLock = useCallback(() => {
      const data = {
        rowId: rowItem.id,
        isLocked: !rowItem.isLocked,
      };
      updateMapByType(JourneyMapRowActionEnum.ROW_DISABLE, ActionsEnum.UPDATE, data);
      updateRedoActions([]);
      updateUndoActions([
        ...undoActions,
        {
          id: uuidv4(),
          type: JourneyMapRowActionEnum.ROW_DISABLE,
          action: ActionsEnum.UPDATE,
          data,
        },
      ]);
    }, [
      rowItem.id,
      rowItem.isLocked,
      undoActions,
      updateMapByType,
      updateRedoActions,
      updateUndoActions,
    ]);

    const onHandleCollapse = useCallback(() => {
      const data = {
        rowId: rowItem.id,
        isCollapsed: !rowItem.isCollapsed,
      };
      updateMapByType(JourneyMapRowActionEnum.ROW_COLLAPSE, ActionsEnum.UPDATE, data);
      updateRedoActions([]);
      updateUndoActions([
        ...undoActions,
        {
          id: uuidv4(),
          type: JourneyMapRowActionEnum.ROW_COLLAPSE,
          action: ActionsEnum.UPDATE,
          data,
        },
      ]);
    }, [
      rowItem.id,
      rowItem.isCollapsed,
      undoActions,
      updateMapByType,
      updateRedoActions,
      updateUndoActions,
    ]);

    const rowOptions = useMemo(() => {
      return JOURNEY_MAP_COLUM_ROW_OPTIONS({
        isDisabled: rowItem.isLocked,
        onHandleDelete,
        onHandleLock,
      });
    }, [onHandleDelete, onHandleLock, rowItem.isLocked]);

    return (
      <>
        {rowItem.isLoading ? (
          <div className={'journey-map-row-name--loading'} data-testid="row-item-loading-test-id">
            <WuBaseLoader />
          </div>
        ) : (
          <>
            <div
              className={`journey-map-row-name--header ${isLayerModeOn ? 'layer-show-mode' : ''}`}>
              {getPageContentByKey({
                content: {
                  [JourneyMapRowTypesEnum.IMAGE]: (
                    <span className={'row-icon'}>
                      <img className={'w-1/2'} src={ImageIcon} alt="IMAGE" />
                    </span>
                  ),
                  [JourneyMapRowTypesEnum.VIDEO]: (
                    <span className={'row-icon'}>
                      <img className={'w-1/2'} src={VideoIcon} alt="Video" />
                    </span>
                  ),
                  [JourneyMapRowTypesEnum.MEDIA]: (
                    <span className={'row-icon'}>
                      <img className={'w-1/2'} src={MediaIcon} alt="Media" />
                    </span>
                  ),
                  [JourneyMapRowTypesEnum.DIVIDER]: (
                    <span className={'row-icon'}>
                      <img className={'w-1/2'} src={DividerIcon} alt="Divider" />
                    </span>
                  ),
                  [JourneyMapRowTypesEnum.PROS]: (
                    <span className={'row-icon'}>
                      <img className={'w-1/2'} src={ProsIcon} alt="Pros" />
                    </span>
                  ),
                  [JourneyMapRowTypesEnum.CONS]: (
                    <span className={'row-icon'}>
                      <img className={'w-1/2'} src={ConsIcon} alt="Cons" />
                    </span>
                  ),
                  [JourneyMapRowTypesEnum.INTERACTIONS]: (
                    <span className={'row-icon'}>
                      <img className={'w-1/2'} src={InteractionIcon} alt="Interaction" />
                    </span>
                  ),
                  [JourneyMapRowTypesEnum.LIST_ITEM]: (
                    <span className={'row-icon'}>
                      <img className={'w-1/2'} src={ListIcon} alt="List" />
                    </span>
                  ),
                  [JourneyMapRowTypesEnum.INSIGHTS]: (
                    <span className={'row-icon'}>
                      <img className={'w-1/2'} src={InsightsIcon} alt="Insights" />
                    </span>
                  ),
                  [JourneyMapRowTypesEnum.TEXT]: (
                    <span className={'row-icon'}>
                      <img className={'w-1/2'} src={TextIcon} alt="Text" />
                    </span>
                  ),
                  [JourneyMapRowTypesEnum.TOUCHPOINTS]: (
                    <span className={'row-icon'}>
                      <img className={'w-1/2'} src={TouchpointIcon} alt="Touchpoint" />
                    </span>
                  ),
                  [JourneyMapRowTypesEnum.METRICS]: (
                    <span className={'row-icon'}>
                      <img className={'w-1/2'} src={MetricsIcon} alt="Metrics" />
                    </span>
                  ),
                  [JourneyMapRowTypesEnum.OUTCOMES]: (
                    <span className={'row-icon'}>
                      <img
                        className={'w-1/2'}
                        src={rowItem?.outcomeGroup?.icon || ''}
                        alt="Outcome Group"
                      />
                    </span>
                  ),
                  [JourneyMapRowTypesEnum.LINKS]: (
                    <span className={'row-icon'}>
                      <img className={'w-1/2'} src={LinkIcon} alt="Link" />
                    </span>
                  ),
                  [JourneyMapRowTypesEnum.SENTIMENT]: (
                    <span className={'row-icon'}>
                      <img className={'w-1/2'} src={HappyIcon} alt="Happy" />
                    </span>
                  ),
                },
                key: rowItem?.rowFunction || '',
                defaultPage: <></>,
              })}
              {!isLayerModeOn ? (
                <div {...dragHandleProps} className={'journey-map-row-name--drag-area'}>
                  {!rowItem.isLocked && (
                    <span
                      className={'wm-drag-indicator'}
                      style={{
                        color: '#545E6B',
                      }}
                    />
                  )}
                </div>
              ) : (
                <div {...dragHandleProps} />
              )}
              {/*todo*/}
              <WuTooltip
                content={labelValue}
                showArrow
                position="top"
                // componentsProps={{
                //   tooltip: {
                //     sx: {
                //       maxWidth: '11rem',
                //     },
                //   },
                // }}
              >
                <div>
                  <CustomInput
                    sxStyles={{
                      width: '4.8rem',
                      background: 'transparent',
                      '& .MuiInputBase-root': {
                        padding: 0,
                        border: 'none',
                        '& fieldset': {
                          border: 'none',
                        },
                        overflow: 'hidden',
                      },
                      '&:hover': {
                        '& .MuiInput-underline::before': {
                          borderBottom: `1px solid #00000033 !important`,
                        },
                      },
                      '& .MuiInput-underline:after': {
                        borderBottom: `1px solid  #1b87e6`,
                      },
                      '& .MuiInputBase-input': {
                        textAlign: 'center',
                        textOverflow: isFocused ? 'unset' : 'ellipsis',
                        overflow: isFocused ? 'visible' : 'hidden',
                        display: isFocused ? 'block' : '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        whiteSpace: isFocused ? 'nowrap' : 'normal',
                        wordBreak: 'break-word',
                      },
                    }}
                    id={(rowItem.rowFunction?.toLowerCase() || 'row-input') + '-input'}
                    value={labelValue}
                    disabled={disabled || rowItem?.isDisabled}
                    onBlur={() => setIsFocused(false)}
                    onFocus={() => setIsFocused(true)}
                    onChange={e => {
                      setLabelValue(e.target.value);
                      updateLabel({
                        rowId: rowItem?.id,
                        previousLabel: rowItem.label || '',
                        label: e.target.value,
                      });
                    }}
                    onKeyDown={event => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        (event.target as HTMLElement).blur();
                      }
                    }}
                    multiline
                    maxRows={2}
                    variant="outlined"
                    padding={0}
                  />
                </div>
              </WuTooltip>

              <div className="journey-map-row-name--collapse-and-options">
                <div className={'journey-map-row-name--collapse-and-options--menu'}>
                  <CustomLongMenu
                    type={MenuViewTypeEnum.VERTICAL}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    item={rowItem}
                    options={rowOptions}
                    disabled={disabled}
                    sxStyles={{
                      display: 'inline-block',
                      background: 'transparent',
                    }}
                  />
                </div>
                {rowItem.isLocked ? (
                  <button
                    onClick={() => onHandleLock()}
                    className={'journey-map-row-name--lock-unlock'}>
                    {/*todo*/}
                    {/*<LockIcon className={'lock'} fill={'#545e6b'} />*/}
                    {/*<UnlockIcon className={'unlock'} />*/}

                    <span
                      className={'unlock wm-lock-open'}
                      style={{
                        color: '#545E6B',
                      }}
                    />

                    <span
                      className={'lock wm-lock'}
                      style={{
                        color: '#545E6B',
                      }}
                    />
                  </button>
                ) : (
                  <>
                    {rowItem.rowFunction === MapRowTypeEnum.Divider ? null : (
                      <WuTooltip
                        position="top"
                        content={rowItem.isCollapsed ? 'Uncollapse' : 'Collapse'}
                        showArrow>
                        <button
                          aria-label={'arrow'}
                          data-testid={'collapse-btn-test-id'}
                          className={`journey-map-row-name--collapse-and-options--collapse-btn ${
                            rowItem.isCollapsed
                              ? 'journey-map-row-name--collapse-and-options--collapse-open-btn'
                              : 'journey-map-row-name--collapse-and-options--collapse-close-btn'
                          }`}
                          onClick={onHandleCollapse}>
                          <span className={'wm-arrow-drop-down'} />
                        </button>
                      </WuTooltip>
                    )}
                  </>
                )}
              </div>
            </div>
            {!isLayerModeOn && (
              <>
                {index > 1 && <RowActionsDrawer index={index} />}
                {index === rowsLength && (
                  <div className={'last-long-menu'}>
                    <RowActionsDrawer index={index + 1} />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </>
    );
  },
);

export default RowNameBlock;
