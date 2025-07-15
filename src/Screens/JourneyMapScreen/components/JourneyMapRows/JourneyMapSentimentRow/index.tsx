import { FC, useCallback, useMemo, useState } from 'react';

import './style.scss';

import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { useParams } from '@tanstack/react-router';

import { EMOTION_TYPES, EMOTION_VALUES } from './constants';
import { SentimentBoxType } from './types';
import JourneyMapSelectedPersonas from '../components/JourneyMapSelectedPersonas';

import {
  DisablePersonaForRowMutation,
  useDisablePersonaForRowMutation,
} from '@/api/mutations/generated/disablePersonaForRow.generated.ts';
import CustomLoader from '@/Components/Shared/CustomLoader';
import RowNameBlock from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/RowNameBlock';
import Sentiment from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/Sentiment';
import { BoxType, JourneyMapRowType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { useLayerStore } from '@/store/layers.ts';
import { ObjectKeysType } from '@/types';
import { SelectedPersonasViewModeEnum } from '@/types/enum.ts';

interface IJourneyMapSentimentRow {
  dragHandleProps: DraggableProvidedDragHandleProps | null;
  rowItem: JourneyMapRowType;
  index: number;
  rowsLength: number;
  disabled: boolean;
  updateLabel: (data: { rowId: number; previousLabel: string; label: string }) => void;
}

const JourneyMapSentimentRow: FC<IJourneyMapSentimentRow> = ({
  dragHandleProps,
  updateLabel,
  rowItem,
  index,
  rowsLength,
  disabled,
}) => {
  const { mapId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/board/$boardId/journey-map/$mapId/',
  });

  const { journeyMap, isDragging, updateJourneyMap } = useJourneyMapStore();
  const { currentLayer } = useLayerStore();

  const isLayerModeOn = !currentLayer?.isBase;

  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const { mutate: toggleDisablePersona } = useDisablePersonaForRowMutation<
    Error,
    DisablePersonaForRowMutation
  >();

  const toggleSelectAverage = () => {
    const isDisabled = !rowItem.isPersonaAverageDisabled;
    toggleDisablePersona({
      disablePersonaInput: {
        rowId: rowItem.id,
        disableAverage: isDisabled,
      },
    });

    // todo check if this is working correctly
    const currentRowIndex = journeyMap.rows.findIndex(row => row?.id === rowItem?.id);
    if (currentRowIndex !== -1) {
      const updatedJourneyMap = {
        ...journeyMap,
        rows: journeyMap.rows.map((row, index) =>
          index === currentRowIndex ? { ...row, isPersonaAverageDisabled: isDisabled } : row,
        ),
      };
      updateJourneyMap(updatedJourneyMap);
    }
  };

  const handleSelectJourneyMapFooter = useCallback(
    (id: number) => {
      // todo check if this is working correctly
      const currentRow = journeyMap.rows.find(row => row?.id === rowItem?.id);
      const personaToUpdate = currentRow?.rowWithPersonas.find(itm => itm?.id === id);
      if (personaToUpdate) {
        const newDisabledState = !personaToUpdate.isDisabledForThisRow;

        const journeyMapCopy = structuredClone(journeyMap);
        const rowCopy = journeyMapCopy.rows.find(row => row?.id === rowItem?.id);
        const personaCopy = rowCopy?.rowWithPersonas.find(itm => itm?.id === id);

        if (personaCopy) {
          personaCopy.isDisabledForThisRow = newDisabledState;

          toggleDisablePersona({
            disablePersonaInput: {
              rowId: rowItem.id,
              disablePersonaForRowInput: {
                id,
                disable: newDisabledState,
              },
            },
          });

          updateJourneyMap(journeyMapCopy);
        }
      }
    },
    [journeyMap, rowItem.id, toggleDisablePersona, updateJourneyMap],
  );

  const sentimentData = useMemo(() => {
    setLoadingIndex(null);
    const newData: SentimentBoxType[] = [];
    rowItem.boxes?.forEach((box: BoxType, boxIndex) => {
      const averageDetails: ObjectKeysType = {};
      if (box.isLoading) {
        setLoadingIndex(boxIndex);
      }
      const currentItem: any = {};
      EMOTION_TYPES.forEach(emotion => {
        currentItem[emotion] = [];
      });
      rowItem?.rowWithPersonas?.forEach(personaItem => {
        const emotion =
          (personaItem?.personaStates && personaItem?.personaStates[boxIndex]?.state) || 'NEUTRAL'; // HAPPY // VERY HAPPY // SAD
        averageDetails[personaItem.id] = !personaItem.isDisabledForThisRow
          ? EMOTION_VALUES[emotion]
          : 1;
        if (!personaItem?.isDisabledForThisRow) {
          currentItem[emotion] = [
            ...(currentItem[emotion] || {}),
            {
              ...(personaItem.personaStates ? personaItem.personaStates[boxIndex] : {}),
              stepId: box?.step?.id,
              personaId: personaItem?.id,
              // todo
              // isDraggable: !personaItem?.isDisabledForSocket,
              // isDisabled: personaItem?.isDisabledForSocket,
              color: personaItem.color,
              text: personaItem?.name + ', ' + personaItem?.type?.toLowerCase(),
            },
          ];
        }
      });
      currentItem.id = box?.step?.id;
      currentItem.average = box.average;
      currentItem.averageDetails = averageDetails;
      newData.push(currentItem);
    });
    return newData;
  }, [rowItem?.boxes, rowItem?.rowWithPersonas]);

  return (
    <div
      className={`journey-map-sentiment ${
        rowItem.isCollapsed ? 'journey-map-sentiment-collapsed' : ''
      } ${rowItem.isLocked ? 'journey-map-sentiment-locked' : ''}`}>
      <div
        onMouseDown={e => e.currentTarget.focus()}
        className={`journey-map-sentiment--item ${isLayerModeOn ? 'layer-show-mode' : ''}`}
        data-testid="journey-map-sentiment-test-id">
        <RowNameBlock
          rowItem={rowItem}
          index={index}
          updateLabel={updateLabel}
          rowsLength={rowsLength}
          dragHandleProps={dragHandleProps}
          isLayerModeOn={isLayerModeOn}
        />

        {!isDragging && !rowItem.isCollapsed && (
          <div className={'journey-map-sentiment--personas-block map-item'}>
            <button
              disabled={disabled}
              className={`journey-map-sentiment--personas-block--glob ${
                rowItem?.isPersonaAverageDisabled ? 'disabled-mode' : ''
              }`}
              data-testid="journey-map-sentiment-overview-test-id"
              onClick={toggleSelectAverage}
              aria-label={'Overview'}>
              <span
                className={'wm-group'}
                style={{
                  color: '#1b87e6',
                }}
              />
            </button>

            <JourneyMapSelectedPersonas
              viewMode={SelectedPersonasViewModeEnum.SENTIMENT}
              personas={rowItem?.rowWithPersonas}
              mapId={+mapId}
              showFullItems={true}
              showActives={true}
              disabled={disabled}
              updatePersonas={handleSelectJourneyMapFooter}
            />
          </div>
        )}

        <div
          {...dragHandleProps}
          className={'journey-map--drag-area journey-map--sentiment-drag-area'}
        />
      </div>

      {rowItem.isLoading ? (
        <div className={'journey-map-row--loading-block'}>
          {rowItem?.boxes?.map((_, skeletonIndex) => (
            <div className={'journey-map-row--loading'} key={'skeleton_' + skeletonIndex}>
              <CustomLoader />
            </div>
          ))}
        </div>
      ) : (
        <div className={'journey-map-sentiment--konva-block map-item'}>
          {loadingIndex !== null && (
            <div
              className={'journey-map-sentiment--loading'}
              style={{ left: loadingIndex * 279 + loadingIndex }}>
              <div className={'journey-map-row--loading'}>
                <CustomLoader />
              </div>
            </div>
          )}
          <Sentiment
            sentimentData={sentimentData}
            width={279}
            personasCount={rowItem.rowWithPersonas.filter(itm => !itm.isDisabledForThisRow).length}
            columnsCount={rowItem.boxes?.length || 0}
            rowId={rowItem?.id}
            isAverageActive={!rowItem.isPersonaAverageDisabled}
            disabled={disabled || isLayerModeOn}
            rowIndex={index}
            isCollapsed={rowItem.isCollapsed}
          />
        </div>
      )}
    </div>
  );
};

export default JourneyMapSentimentRow;
