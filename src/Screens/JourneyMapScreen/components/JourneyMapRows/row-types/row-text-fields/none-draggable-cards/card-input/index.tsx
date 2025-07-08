import React, { FC, memo, ReactNode, useCallback, useState } from 'react';

import './style.scss';

import { usePathname } from 'next/navigation';

import MapEditor from '@/components/organisms/editors/map-editor';
import JourneyMapCardTags from '@/containers/journey-map-container/journey-map-tags-popover';
import { MapCardTypeEnum } from '@/gql/types';
import { BoxItemType } from '@/utils/ts/types/journey-map/journey-map-types';

interface ICardInput {
  rowId: number;
  icon: ReactNode;
  headerColor: string;
  bodyColor: string;
  disabled: boolean;
  rowItem: BoxItemType;
  onHandleUpdateBoxElement: ({
    previousText,
    value,
    columnId,
    stepId,
  }: {
    previousText: string;
    value: string;
    columnId: number;
    stepId: number;
  }) => void;
}

const CardInput: FC<ICardInput> = memo(
  ({ rowId, icon, headerColor, bodyColor, disabled, rowItem, onHandleUpdateBoxElement }) => {
    const [isActiveMode, setIsActiveMode] = useState(false);
    const pathname = usePathname();
    const isGuest = pathname.includes('/guest');

    const updateActiveMode = useCallback((isOpen: boolean) => {
      setIsActiveMode(isOpen);
    }, []);

    return (
      <div
        className={`non-draggable-input map-item ${isActiveMode ? 'active-map-card' : ''}`}
        style={{
          backgroundColor: bodyColor,
        }}>
        <div className={'text-insights--header'} style={{ backgroundColor: headerColor }}>
          <div className={'text-insights--header-icon'}>{icon}</div>
          <div className={'card-header--tag text-insights--header-tag'}>
            {!isGuest && (
              <JourneyMapCardTags
                cardType={MapCardTypeEnum.BoxElement}
                itemId={rowItem.boxTextElement?.id || null}
                changeActiveMode={updateActiveMode}
                attachedTagsCount={rowItem.boxTextElement?.tagsCount || 0}
                createTagItemAttrs={{
                  stepId: rowItem.step.id,
                  columnId: rowItem.columnId!,
                  rowId: rowId,
                  cardType: MapCardTypeEnum.BoxTextElement,
                }}
                onClick={() => {
                  !rowItem.boxTextElement?.id &&
                    onHandleUpdateBoxElement({
                      previousText: '',
                      value: '',
                      columnId: rowItem.columnId!,
                      stepId: rowItem.step.id,
                    });
                }}
              />
            )}
          </div>
        </div>

        <MapEditor
          disabled={disabled}
          itemData={{
            id: rowItem.id!,
            rowId: rowId,
            stepId: rowItem.step.id,
          }}
          onHandleTextChange={value => {
            onHandleUpdateBoxElement({
              previousText: rowItem.boxTextElement?.text || '',
              value,
              columnId: rowItem.columnId!,
              stepId: rowItem.step.id,
            });
          }}
          initValue={rowItem.boxTextElement?.text || ''}
          isBackCard={false}
        />
      </div>
    );
  },
);

export default CardInput;
