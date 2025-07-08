import React, { FC } from 'react';

import './style.scss';

import { useRecoilValue } from 'recoil';

import CustomLoader from '@/components/molecules/custom-loader/custom-loader';
import ErrorBoundary from '@/components/templates/error-boundary';
import MergeColumnsButton from '@/containers/journey-map-container/journey-map-rows/merge-columns-btn';
import RowVideoItem from '@/containers/journey-map-container/journey-map-rows/row-types/row-videos/row-video-item';
import { journeyMapState } from '@/store/atoms/journeyMap.atom';
import { currentLayerState } from '@/store/atoms/layers.atom';
import { findPreviousBox, getConnectionDetails } from '@/utils/helpers/general';
import { JourneyMapRowType } from '@/utils/ts/types/journey-map/journey-map-types';

interface IRowVideos {
  row: JourneyMapRowType;
  disabled: boolean;
}

const RowVideos: FC<IRowVideos> = ({ row, disabled }) => {
  const journeyMap = useRecoilValue(journeyMapState);
  const currentLayer = useRecoilValue(currentLayerState);
  const isLayerModeOn = !currentLayer?.isBase;

  return (
    <div className={'row-videos'} data-testid={`row-videos-${row.id}-test-id`}>
      {row?.boxes?.map((rowItem, index) => {
        if (!!rowItem.mergeCount) {
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
                    <RowVideoItem
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
                        endStepId={rowItem?.step?.id!}
                        endColumnId={rowItem?.columnId!}
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
