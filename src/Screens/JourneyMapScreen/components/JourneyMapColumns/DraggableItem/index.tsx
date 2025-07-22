import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import { WuTooltip } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

import {
  CreateJourneyMapColumnMutation,
  useCreateJourneyMapColumnMutation,
} from '@/api/mutations/generated/createJourneyMapColumn.generated.ts';
import {
  DeleteMapColumnMutation,
  useDeleteMapColumnMutation,
} from '@/api/mutations/generated/deleteMapColumn.generated.ts';
import CustomInput from '@/Components/Shared/CustomInput';
import CustomLongMenu from '@/Components/Shared/CustomLongMenu';
import StepColumnDrag from '@/Components/Shared/StepColumnDrag';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { debounced800 } from '@/Hooks/useDebounce.ts';
import {
  JOURNEY_MAP_COLUM_OPTIONS,
  JOURNEY_MAP_LOADING_COLUMN,
  JOURNEY_MAP_LOADING_ROW,
} from '@/Screens/JourneyMapScreen/constants';
import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap';
import { useUpdatesStagesAndLanes } from '@/Screens/JourneyMapScreen/hooks/useUpdatesStagesAndLanes.tsx';
import { JourneyMapColumnType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/Store/journeyMap.ts';
import { useLayerStore } from '@/Store/layers.ts';
import { useUndoRedoStore } from '@/Store/undoRedo.ts';
import { ActionsEnum, JourneyMapRowActionEnum, MenuViewTypeEnum } from '@/types/enum.ts';
import { getTextColorBasedOnBackground } from '@/utils/getTextColorBasedOnBackground.ts';
import { lightenColor } from '@/utils/lightenColor.ts';

interface ChildRef {
  createNewColumn: () => void;
}

interface IDraggableItem {
  index: number;
  column: JourneyMapColumnType;
  mapId: number;
  dragHandleProps?: any;
  isDraggable: boolean;
  length?: number;
  parentType?: 'columns' | 'steps';
  hasMergeItems: boolean;
  canAddNewItem: boolean;
}

const DraggableItem = forwardRef<ChildRef, IDraggableItem>((props, ref) => {
  const {
    index,
    column,
    mapId,
    dragHandleProps,
    isDraggable,
    length,
    parentType,
    hasMergeItems,
    canAddNewItem,
  } = props;

  const queryClient = useQueryClient();

  const { updateMapByType } = useUpdateMap();
  const { updateStages } = useUpdatesStagesAndLanes();

  const { journeyMap, updateJourneyMap } = useJourneyMapStore();
  const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();
  const { currentLayer } = useLayerStore();

  const isLayerModeOn = !currentLayer?.isBase;

  const [labelValue, setLabelValue] = useState<string>(column.label || '');
  const [columnColor, setColumnColor] = useState<string>(column?.bgColor || '#D9DFF2');
  const [isActiveInput, setIsActiveInput] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const columnItemRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);

  const onHandleUpdateJourneyMap = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['GetJourneyMap'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['GetJourneyMapRows.infinite'],
      }),
    ]);
  };

  const { mutate: createColumn, isPending: isLoadingCreateColumn } =
    useCreateJourneyMapColumnMutation<Error, CreateJourneyMapColumnMutation>({
      onSuccess: async response => {
        updateStages(
          {
            id: response.createJourneyMapColumn?.id,
            label: response.createJourneyMapColumn?.label,
            index: response.createJourneyMapColumn?.index,
          },
          ActionsEnum.CREATE,
        );
        updateRedoActions([]);
        updateUndoActions([
          ...undoActions,
          {
            id: uuidv4(),
            type: JourneyMapRowActionEnum.COLUMN,
            action: ActionsEnum.DELETE,
            data: {
              column: response.createJourneyMapColumn,
            },
          },
        ]);
        await onHandleUpdateJourneyMap();
      },
      onError: async () => {
        await onHandleUpdateJourneyMap();
      },
    });

  const { mutate: mutateDeleteMapColum } = useDeleteMapColumnMutation<
    DeleteMapColumnMutation,
    Error
  >({
    onSuccess: () => {
      updateRedoActions([]);
      updateUndoActions([
        ...undoActions,
        {
          id: uuidv4(),
          type: JourneyMapRowActionEnum.COLUMN,
          action: ActionsEnum.CREATE,
          data: {
            column,
          },
        },
      ]);

      const newRows = journeyMap.rows.map(r => {
        return {
          ...r,
          rowWithPersonas: r.rowWithPersonas.map(rowWithPersonasItem => {
            return {
              ...rowWithPersonasItem,
              personaStates: rowWithPersonasItem.personaStates?.filter(
                item => item.columnId !== column.id,
              ),
            };
          }),
          boxes: r.boxes?.filter(box => box.columnId !== column.id),
        };
      });

      const newColumns = journeyMap.columns.filter(el => el.id !== column.id);

      updateJourneyMap({
        rows: newRows,
        columns: newColumns,
      });

      updateStages(
        {
          id: column.id,
          label: column.label,
        },
        ActionsEnum.DELETE,
      );
    },
  });

  const onHandleDelete = useCallback(() => {
    mutateDeleteMapColum({
      id: column.id,
    });
  }, [column.id, mutateDeleteMapColum]);

  const onHandleChangeColor = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const columnBox = document.getElementById(`column-box-${column?.id}`);
      const bgColor = e.target.value;
      if (columnItemRef && columnItemRef.current) {
        columnItemRef.current.style.backgroundColor = bgColor;
      }
      if (inputRef && inputRef.current) {
        inputRef.current.style.color = getTextColorBasedOnBackground(bgColor);
      }
      if (columnBox) {
        columnBox.style.borderRight = `1px solid ${lightenColor(e.target.value, -4)}`;
        columnBox.style.borderBottom = `1px solid ${lightenColor(e.target.value, -4)}`;
      }
      debounced800(() => {
        const data = {
          columnId: column.id,
          bgColor: bgColor,
          previousBgColor: columnColor,
        };
        updateMapByType(JourneyMapRowActionEnum.COLUMN_BG_COLOR, ActionsEnum.UPDATE, data);
        updateRedoActions([]);
        updateUndoActions([
          ...undoActions,
          {
            id: uuidv4(),
            type: JourneyMapRowActionEnum.COLUMN_BG_COLOR,
            action: ActionsEnum.UPDATE,
            data,
          },
        ]);
      });
    },
    [column.id, columnColor, undoActions, updateMapByType, updateRedoActions, updateUndoActions],
  );

  const onHandleChangeLabel = useCallback(
    (value: string) => {
      setLabelValue(value);
      debounced800(() => {
        const updateLabelValue = value.trim() || 'Untitled';
        const data = {
          columnId: column.id,
          label: updateLabelValue,
          previousLabel: labelValue,
        };
        setLabelValue(updateLabelValue);
        updateMapByType(JourneyMapRowActionEnum.COLUMN_LABEL, ActionsEnum.UPDATE, data);
        updateRedoActions([]);
        updateUndoActions([
          ...undoActions,
          {
            id: uuidv4(),
            type: JourneyMapRowActionEnum.COLUMN_LABEL,
            action: ActionsEnum.UPDATE,
            data,
          },
        ]);
      });
    },
    [column.id, labelValue, undoActions, updateMapByType, updateRedoActions, updateUndoActions],
  );

  const options = useMemo(() => {
    return JOURNEY_MAP_COLUM_OPTIONS({
      onHandleDelete,
      onHandleChangeColor,
      isDeleteDisable: !!(length && length <= 3) || hasMergeItems,
      color: columnColor,
    });
  }, [columnColor, hasMergeItems, length, onHandleChangeColor, onHandleDelete]);

  const onHandleCreateJourneyMapColumn = (position?: number) => {
    const columnPosition = typeof position === 'number' ? position : index;
    const columns = journeyMap.columns;
    const rows = journeyMap.rows;
    let columnIndex = 0;

    journeyMap.columns.forEach((c, i) => {
      if (i < columnPosition) {
        columnIndex += c.size;
      }
    });

    rows.map(row => ({
      ...row,
      boxes: row.boxes?.splice(columnIndex, 0, JOURNEY_MAP_LOADING_ROW),
    }));
    columns.splice(columnPosition, 0, JOURNEY_MAP_LOADING_COLUMN);

    updateJourneyMap({
      rows,
      columns,
    });

    createColumn({
      createColumnInput: {
        index: columnPosition + 1,
        size: 1,
        mapId,
        label: 'Untitled',
        headerColor: 'white',
      },
    });
  };

  const onClickInput = () => {
    setIsActiveInput(prev => !prev);
  };

  useImperativeHandle(ref, () => ({
    createNewColumn() {
      onHandleCreateJourneyMapColumn(0);
    },
  }));

  useEffect(() => {
    if (column?.label) {
      setLabelValue(column?.label);
    }
  }, [column?.label]);

  useEffect(() => {
    if (column.bgColor) {
      setColumnColor(column.bgColor);
    }
  }, [column?.bgColor]);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.stopPropagation();
      const map = document.querySelector('.journey-map-rows') as HTMLElement;
      if (!isActiveInput) {
        const scrollAmount = e.deltaY || e.deltaX; // Increase for faster scrolling
        const start = map.scrollLeft;
        let startTime: number | null = null;
        const smoothScroll = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          // Adjust scroll position for continuous smooth scrolling
          const scrollStep = scrollAmount * (elapsed / 70); // Adjust the division factor for smoother or faster scroll
          map.scrollLeft = start + scrollStep;
          // Continue scrolling until the target is reached
          if (elapsed < 300) {
            requestAnimationFrame(smoothScroll);
          }
        };
        requestAnimationFrame(smoothScroll);
        e.preventDefault();
      }
    };
    const inputElement = inputRef.current!;
    if (inputElement) {
      inputElement.addEventListener('wheel', handleScroll, { passive: false });
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('wheel', handleScroll);
      }
    };
  }, [isActiveInput]);

  return (
    <>
      {column.isLoading ? (
        <div className={'column-draggable-item--loading'}>
          <div {...dragHandleProps} />
          <WuBaseLoader />
        </div>
      ) : (
        <div
          ref={columnItemRef}
          style={{ backgroundColor: columnColor, userSelect: 'none' }}
          className={'column-draggable-item'}
          data-testid={`column-draggable-item-${column.id}-test-id`}>
          {isDraggable && !hasMergeItems && !isLayerModeOn ? (
            <StepColumnDrag
              columnColor={column?.bgColor || '#D9DFF2'}
              dragHandleProps={dragHandleProps}
            />
          ) : (
            <span {...dragHandleProps} />
          )}
          <div className={'column-draggable-item--menu'}>
            {parentType === 'columns' && !isLayerModeOn && (
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
                item={column}
                buttonColor={columnColor}
                options={options}
                disabled={column?.isDisabled}
                sxStyles={{
                  display: 'inline-block',
                  background: 'transparent',
                }}
              />
            )}
          </div>
          <div
            style={{ userSelect: 'none', overflow: 'hidden' }}
            className="column-draggable-item--input-block"
            ref={sectionRef}>
            <WuTooltip className={'wu-tooltip-content'} content={labelValue} position="top">
              <CustomInput
                inputRef={inputRef}
                id={String(column.id)}
                sxStyles={{
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: `5px dotted red`,
                    },
                  },
                  background: 'transparent',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: `5px solid green`,
                  },
                  '& .MuiInputBase-input': {
                    maxHeight: '25px !important',
                    padding: '0 10px',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    letterSpacing: '0.5px',
                    textAlign: 'center',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    wordBreak: 'break-word',
                    color: getTextColorBasedOnBackground(columnColor),
                    ...(isFocused
                      ? {
                          textOverflow: 'unset',
                          overflow: 'visible',
                          display: 'block',
                          whiteSpace: 'nowrap',
                        }
                      : {
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          whiteSpace: 'normal',
                        }),
                  },
                }}
                inputType="secondary"
                placeholder="text..."
                value={labelValue}
                disabled={column?.isDisabled}
                onBlur={() => {
                  onClickInput();
                  setIsFocused(false);
                }}
                onFocus={() => {
                  onClickInput();
                  setIsFocused(true);
                }}
                onChange={e => {
                  onHandleChangeLabel(e.target.value);
                }}
                onKeyDown={event => {
                  if (event.keyCode === 13) {
                    event.preventDefault();
                    (event.target as HTMLElement).blur();
                  }
                }}
                multiline
                maxRows={2}
                readOnly={!isActiveInput}
              />
            </WuTooltip>
            <div className="resize" />
          </div>
          {canAddNewItem && !isLayerModeOn && (
            <div className={'journey-map-column--new-column-button-block'}>
              <button
                aria-label={'plus'}
                className={'journey-map-column--new-column-button-block--button'}
                data-testid="add-column-btn-test-id"
                disabled={column?.isDisabled || isLoadingCreateColumn}
                onClick={() => onHandleCreateJourneyMapColumn()}>
                <span className={'wm-add'} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
});

export default DraggableItem;
