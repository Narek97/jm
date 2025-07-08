import React, { FC } from 'react';

import './style.scss';
import CustomLoader from '@/Components/Shared/CustomLoader';
import ErrorBoundary from '@/Features/ErrorBoundary';
import MergeColumnsButton from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/MergeColumnsBtn';
import ImagesItem from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/RowImages/ImageItem';
import { findPreviousBox } from '@/Screens/JourneyMapScreen/helpers/findPreviousBox.ts';
import { getConnectionDetails } from '@/Screens/JourneyMapScreen/helpers/getConnectionDetails.ts';
import { BoxElementType, JourneyMapRowType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { useLayerStore } from '@/store/layers.ts';

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
      {row?.boxes?.map((rowItem: BoxElementType, index) => {
        if (rowItem.mergeCount) {
          return (
            <React.Fragment key={rowItem.id + '_' + index}>
              {rowItem.isLoading ? (
                <div className={'journey-map-row--loading'} data-testid="image-row-loading-test-id">
                  <CustomLoader />
                </div>
              ) : (
                <ErrorBoundary>
                  <div
                    className={'row-images-item'}
                    style={{
                      width: `${rowItem.mergeCount * 279 + rowItem.mergeCount - 1}px`,
                      minWidth: `279px`,
                    }}>
                    <ImagesItem
                      row={row}
                      boxIndex={index}
                      rowItem={rowItem}
                      rowId={row?.id}
                      disabled={disabled}
                    />

                    {index > 0 && row?.boxes && !isLayerModeOn && (
                      <MergeColumnsButton
                        connectionStart={getConnectionDetails(row.boxes[index - 1], journeyMap)}
                        connectionEnd={getConnectionDetails(rowItem, journeyMap)}
                        rowId={row?.id}
                        previousBoxDetails={findPreviousBox(row.boxes, index)}
                        endStepId={rowItem.step?.id || 0}
                        endColumnId={rowItem.columnId}
                        endBoxMergeCount={rowItem.mergeCount}
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
