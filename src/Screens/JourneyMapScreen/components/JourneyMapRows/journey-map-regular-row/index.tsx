import React, { FC, memo } from 'react';

import './style.scss';

import { useRecoilValue } from 'recoil';

import CustomLoader from '@/components/molecules/custom-loader/custom-loader';
import ErrorBoundary from '@/components/templates/error-boundary';
import RowNameBlock from '@/containers/journey-map-container/journey-map-rows/row-name-block';
import Divider from '@/containers/journey-map-container/journey-map-rows/row-types/divider';
import Links from '@/containers/journey-map-container/journey-map-rows/row-types/links';
import Metrics from '@/containers/journey-map-container/journey-map-rows/row-types/metrics';
import Outcomes from '@/containers/journey-map-container/journey-map-rows/row-types/outcomes';
import RowImages from '@/containers/journey-map-container/journey-map-rows/row-types/row-images';
import RowMedias from '@/containers/journey-map-container/journey-map-rows/row-types/row-medias';
import RowTextFields from '@/containers/journey-map-container/journey-map-rows/row-types/row-text-fields';
import RowVideos from '@/containers/journey-map-container/journey-map-rows/row-types/row-videos';
import Touchpoints from '@/containers/journey-map-container/journey-map-rows/row-types/touchpoints';
import { MapRowTypeEnum } from '@/gql/types';
import { currentLayerState } from '@/store/atoms/layers.atom';
import { getPageContentByKey } from '@/utils/helpers/get-page-content-by-key';
import { JourneyMapRowTypesEnum } from '@/utils/ts/enums/global-enums';
import { JourneyMapRowType } from '@/utils/ts/types/journey-map/journey-map-types';

interface IJourneyMapRow {
  updateLabel: (data: { rowId: number; previousLabel: string; label: string }) => void;
  dragHandleProps: any;
  rowItem: JourneyMapRowType;
  index: number;
  rowsLength: number;
  disabled?: boolean;
}

const JourneyMapRegularRow: FC<IJourneyMapRow> = memo(
  ({ dragHandleProps, updateLabel, rowItem, index, rowsLength, disabled = false }) => {
    const currentLayer = useRecoilValue(currentLayerState);
    const isLayerModeOn = !currentLayer?.isBase;

    return (
      <div
        className={`journey-map-row ${rowItem.isCollapsed ? 'journey-map-row-collapsed' : ''} ${
          rowItem.isLocked ? 'journey-map-row-locked' : ''
        }`}>
        <div
          onMouseDown={e => e.currentTarget.focus()}
          className={'journey-map-row--name-block'}
          data-testid="journey-map-row-test-id"
          style={{
            maxHeight: `${rowItem.rowFunction === MapRowTypeEnum.Divider ? '2rem' : 'auto'}`,
          }}>
          <RowNameBlock
            rowItem={rowItem}
            index={index}
            updateLabel={updateLabel}
            rowsLength={rowsLength}
            dragHandleProps={dragHandleProps}
            isLayerModeOn={isLayerModeOn}
          />
        </div>

        {rowItem.isLoading ? (
          <div className={'journey-map-row--loading-block'} data-testid="row-loading-test-id">
            {rowItem?.boxes?.map((_, i) => (
              <div className={'journey-map-row--loading'} key={i}>
                <CustomLoader />
              </div>
            ))}
          </div>
        ) : (
          getPageContentByKey({
            content: {
              [JourneyMapRowTypesEnum.IMAGE]: (
                <ErrorBoundary>{<RowImages row={rowItem} disabled={disabled} />}</ErrorBoundary>
              ),
              [JourneyMapRowTypesEnum.VIDEO]: (
                <ErrorBoundary>{<RowVideos row={rowItem} disabled={disabled} />}</ErrorBoundary>
              ),
              [JourneyMapRowTypesEnum.MEDIA]: (
                <ErrorBoundary>{<RowMedias row={rowItem} disabled={disabled} />}</ErrorBoundary>
              ),
              [JourneyMapRowTypesEnum.DIVIDER]: (
                <ErrorBoundary>
                  <Divider row={rowItem} />
                </ErrorBoundary>
              ),
              [JourneyMapRowTypesEnum.PROS]: (
                <ErrorBoundary>
                  <RowTextFields
                    isDraggable={true}
                    type={JourneyMapRowTypesEnum.PROS}
                    width={279}
                    rowIndex={index}
                    row={rowItem}
                    headerColor={'#a1cdb7'}
                    bodyColor={'#b3e4ca'}
                    disabled={disabled}
                  />
                </ErrorBoundary>
              ),
              [JourneyMapRowTypesEnum.CONS]: (
                <ErrorBoundary>
                  <RowTextFields
                    type={JourneyMapRowTypesEnum.CONS}
                    row={rowItem}
                    width={279}
                    rowIndex={index}
                    headerColor={'#e5c1c4'}
                    bodyColor={'#fed7da'}
                    disabled={disabled}
                    isDraggable={true}
                  />
                </ErrorBoundary>
              ),
              [JourneyMapRowTypesEnum.INTERACTIONS]: (
                <ErrorBoundary>
                  <RowTextFields
                    type={JourneyMapRowTypesEnum.INTERACTIONS}
                    row={rowItem}
                    width={279}
                    rowIndex={index}
                    headerColor={'#e9ebf2'}
                    bodyColor={'#f5f7ff'}
                    disabled={disabled}
                    isDraggable={true}
                  />
                </ErrorBoundary>
              ),
              [JourneyMapRowTypesEnum.LIST_ITEM]: (
                <ErrorBoundary>
                  <RowTextFields
                    type={JourneyMapRowTypesEnum.LIST_ITEM}
                    row={rowItem}
                    width={279}
                    rowIndex={index}
                    headerColor={'#e9ebf2'}
                    bodyColor={'#f5f7ff'}
                    disabled={disabled}
                    isDraggable={true}
                  />
                </ErrorBoundary>
              ),
              [JourneyMapRowTypesEnum.INSIGHTS]: (
                <ErrorBoundary>
                  <RowTextFields
                    type={JourneyMapRowTypesEnum.INSIGHTS}
                    row={rowItem}
                    width={280}
                    rowIndex={index}
                    headerColor={'#e9ebf2'}
                    bodyColor={'#f5f7ff'}
                    disabled={disabled}
                    isDraggable={false}
                  />
                </ErrorBoundary>
              ),
              [JourneyMapRowTypesEnum.TEXT]: (
                <ErrorBoundary>
                  <RowTextFields
                    type={JourneyMapRowTypesEnum.TEXT}
                    row={rowItem}
                    width={280}
                    rowIndex={index}
                    headerColor={'#e9ebf2'}
                    bodyColor={'#f5f7ff'}
                    disabled={disabled}
                    isDraggable={false}
                  />
                </ErrorBoundary>
              ),
              [JourneyMapRowTypesEnum.TOUCHPOINTS]: (
                <ErrorBoundary>
                  <Touchpoints width={279} row={rowItem} rowIndex={index} disabled={disabled} />
                </ErrorBoundary>
              ),
              [JourneyMapRowTypesEnum.METRICS]: (
                <ErrorBoundary>
                  <Metrics width={279} row={rowItem} rowIndex={index} disabled={disabled} />
                </ErrorBoundary>
              ),
              [JourneyMapRowTypesEnum.OUTCOMES]: (
                <ErrorBoundary>
                  <Outcomes width={279} row={rowItem} rowIndex={index} disabled={disabled} />
                </ErrorBoundary>
              ),
              [JourneyMapRowTypesEnum.LINKS]: (
                <ErrorBoundary>
                  <Links width={279} row={rowItem} rowIndex={index} disabled={disabled} />
                </ErrorBoundary>
              ),
            },
            key: rowItem?.rowFunction!,
            defaultPage: <></>,
          })
        )}
      </div>
    );
  },
);

export default JourneyMapRegularRow;
