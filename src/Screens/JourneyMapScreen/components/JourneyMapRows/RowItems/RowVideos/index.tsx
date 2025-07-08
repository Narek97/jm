import React, { FC } from 'react';

import './style.scss';
import CustomLoader from '@/Components/Shared/CustomLoader';
import ErrorBoundary from '@/Features/ErrorBoundary';
import MergeColumnsButton from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/MergeColumnsBtn';
import VideoItem from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/RowVideos/VideoItem';
import { findPreviousBox } from '@/Screens/JourneyMapScreen/helpers/findPreviousBox.ts';
import { getConnectionDetails } from '@/Screens/JourneyMapScreen/helpers/getConnectionDetails.ts';
import { JourneyMapRowType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { useLayerStore } from '@/store/layers.ts';

interface IRowVideos {
  row: JourneyMapRowType;
  disabled: boolean;
}

const RowVideos: FC<IRowVideos> = ({ row, disabled }) => {
  const { journeyMap } = useJourneyMapStore();
  const { currentLayer } = useLayerStore();

  const isLayerModeOn = !currentLayer?.isBase;

  return (
    <div className={'row-videos'} data-testid={`row-videos-${row.id}-test-id`}>
      {row?.boxes?.map((rowItem, index) => {
        if (rowItem.mergeCount) {
          return (
            <React.Fragment key={rowItem.id + '_' + index}>
              {rowItem.isLoading ? (
                <div className={'journey-map-row--loading'} data-testid="video-row-loading-test-id">
                  <CustomLoader />
                </div>
              ) : (
                <ErrorBoundary>
                  <div
                    className={'row-video-item'}
                    style={{
                      width: `${rowItem.mergeCount * 17.438 + rowItem.mergeCount - 1}px`,
                      minWidth: `279px`,
                    }}>
                    <VideoItem
                      rowItem={rowItem}
                      rowId={row?.id}
                      disabled={disabled}
                      row={row}
                      boxIndex={index}
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
export default RowVideos;
