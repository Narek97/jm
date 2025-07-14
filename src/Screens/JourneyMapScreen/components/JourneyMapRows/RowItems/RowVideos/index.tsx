import React, { FC } from 'react';

import './style.scss';
import CustomLoader from '@/Components/Shared/CustomLoader';
import ErrorBoundary from '@/Features/ErrorBoundary';
import MergeColumnsButton from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/MergeColumnsBtn';
import VideoItem from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/RowVideos/VideoItem';
import { findPreviousBox } from '@/Screens/JourneyMapScreen/helpers/findPreviousBox.ts';
import { getConnectionDetails } from '@/Screens/JourneyMapScreen/helpers/getConnectionDetails.ts';
import { BoxType, JourneyMapRowType } from '@/Screens/JourneyMapScreen/types.ts';
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
      {row.boxes?.map((boxItem: BoxType, index) => {
        if (boxItem.mergeCount) {
          return (
            <React.Fragment key={boxItem.id + '_' + index}>
              {boxItem.isLoading ? (
                <div className={'journey-map-row--loading'} data-testid="video-row-loading-test-id">
                  <CustomLoader />
                </div>
              ) : (
                <ErrorBoundary>
                  <div
                    className={'row-video-item'}
                    style={{
                      width: `${boxItem.mergeCount * 17.438 + boxItem.mergeCount - 1}px`,
                      minWidth: `279px`,
                    }}>
                    <VideoItem
                      boxItem={boxItem}
                      rowId={row?.id}
                      disabled={disabled}
                      row={row}
                      boxIndex={index}
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
export default RowVideos;
