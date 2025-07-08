import React, { FC } from 'react';

import './style.scss';

import { useRecoilValue } from 'recoil';

import CustomLoader from '@/components/molecules/custom-loader/custom-loader';
import ErrorBoundary from '@/components/templates/error-boundary';
import MergeColumnsButton from '@/containers/journey-map-container/journey-map-rows/merge-columns-btn';
import RowMediaItem from '@/containers/journey-map-container/journey-map-rows/row-types/row-medias/row-media-item';
import { journeyMapState } from '@/store/atoms/journeyMap.atom';
import { currentLayerState } from '@/store/atoms/layers.atom';
import { findPreviousBox, getConnectionDetails } from '@/utils/helpers/general';
import { JourneyMapRowType } from '@/utils/ts/types/journey-map/journey-map-types';

interface IRowMedias {
  row: JourneyMapRowType;
  disabled: boolean;
}

const RowMedias: FC<IRowMedias> = ({ row, disabled }) => {
  const journeyMap = useRecoilValue(journeyMapState);
  const currentLayer = useRecoilValue(currentLayerState);
  const isLayerModeOn = !currentLayer?.isBase;

  return (
    <div className={'row-medias'} data-testid={`row-medias-${row.id}-test-id`}>
      {row?.boxes?.map((rowItem, index) => {
        if (!!rowItem.mergeCount) {
          return (
            <React.Fragment key={rowItem.id + '_' + index}>
              {rowItem.isLoading ? (
                <div className={'journey-map-row--loading'} data-testid="media-row-loading-test-id">
                  <CustomLoader />
                </div>
              ) : (
                <ErrorBoundary>
                  <div
                    className={'row-media-item'}
                    style={{
                      width: `${rowItem.mergeCount * 279 + rowItem.mergeCount - 1}px`,
                      minWidth: `279px`,
                    }}>
                    <RowMediaItem
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
export default RowMedias;
