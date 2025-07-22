import React, { FC } from 'react';

import './style.scss';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import ErrorBoundary from '@/Features/ErrorBoundary';
import MergeColumnsButton from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/MergeColumnsBtn';
import ImagesItem from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/RowImages/ImageItem';
import { findPreviousBox } from '@/Screens/JourneyMapScreen/helpers/findPreviousBox.ts';
import { getConnectionDetails } from '@/Screens/JourneyMapScreen/helpers/getConnectionDetails.ts';
import { BoxType, JourneyMapRowType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/Store/journeyMap.ts';
import { useLayerStore } from '@/Store/layers.ts';

interface IRowImages {
  row: JourneyMapRowType;
  disabled: boolean;
}

const RowImages: FC<IRowImages> = ({ row, disabled }) => {
  const { journeyMap } = useJourneyMapStore();
  const { currentLayer } = useLayerStore();

  const isLayerModeOn = !currentLayer?.isBase;

  return (
    <div className={'row-images'} data-testid={`row-images-${row.id}-test-id`}>
      {row?.boxes?.map((boxItem: BoxType, index) => {
        if (boxItem.mergeCount) {
          return (
            <React.Fragment key={boxItem.id + '_' + index}>
              {boxItem.isLoading ? (
                <div className={'journey-map-row--loading'} data-testid="image-row-loading-test-id">
                  <WuBaseLoader />
                </div>
              ) : (
                <ErrorBoundary>
                  <div
                    className={'row-images-item'}
                    style={{
                      width: `${boxItem.mergeCount * 279 + boxItem.mergeCount - 1}px`,
                      minWidth: `279px`,
                    }}>
                    <ImagesItem
                      row={row}
                      boxIndex={index}
                      boxItem={boxItem}
                      rowId={row?.id}
                      disabled={disabled}
                    />

                    {index > 0 && row?.boxes && !isLayerModeOn && (
                      <MergeColumnsButton
                        connectionStart={getConnectionDetails(row.boxes[index - 1], journeyMap)}
                        connectionEnd={getConnectionDetails(boxItem, journeyMap)}
                        rowId={row?.id}
                        previousBoxDetails={findPreviousBox(row.boxes, index)}
                        endStepId={boxItem.step?.id || 0}
                        endColumnId={boxItem.columnId}
                        endBoxMergeCount={boxItem.mergeCount}
                      />
                    )}
                  </div>
                </ErrorBoundary>
              )}
            </React.Fragment>
          );
        }
      })}
    </div>
  );
};

export default RowImages;
