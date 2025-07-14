import React, { FC } from 'react';

import './style.scss';
import MergeColumnsButton from '../../components/MergeColumnsBtn';

import CustomLoader from '@/Components/Shared/CustomLoader';
import ErrorBoundary from '@/Features/ErrorBoundary';
import RowMediaItem from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/RowMedias/RowMediaItem';
import { findPreviousBox } from '@/Screens/JourneyMapScreen/helpers/findPreviousBox.ts';
import { getConnectionDetails } from '@/Screens/JourneyMapScreen/helpers/getConnectionDetails.ts';
import { BoxType, JourneyMapRowType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { useLayerStore } from '@/store/layers.ts';

interface IRowMedias {
  row: JourneyMapRowType;
  disabled: boolean;
}

const RowMedias: FC<IRowMedias> = ({ row, disabled }) => {
  const { journeyMap } = useJourneyMapStore();
  const { currentLayer } = useLayerStore();

  const isLayerModeOn = !currentLayer?.isBase;

  return (
    <div className={'row-medias'} data-testid={`row-medias-${row.id}-test-id`}>
      {row.boxes?.map((boxItem: BoxType, index) => {
        if (boxItem.mergeCount) {
          return (
            <React.Fragment key={boxItem.id + '_' + index}>
              {boxItem.isLoading ? (
                <div className={'journey-map-row--loading'} data-testid="media-row-loading-test-id">
                  <CustomLoader />
                </div>
              ) : (
                <ErrorBoundary>
                  <div
                    className={'row-media-item'}
                    style={{
                      width: `${boxItem.mergeCount * 279 + boxItem.mergeCount - 1}px`,
                      minWidth: `279px`,
                    }}>
                    <RowMediaItem
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
export default RowMedias;
