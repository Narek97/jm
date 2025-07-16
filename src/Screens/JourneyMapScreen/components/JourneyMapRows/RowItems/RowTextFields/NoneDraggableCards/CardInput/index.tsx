import { FC, memo, ReactNode, useCallback, useState } from 'react';

import './style.scss';
import { useLocation } from '@tanstack/react-router';

import { MapCardTypeEnum } from '@/api/types.ts';
import MapEditor from '@/Components/Shared/Editors/MapEditor';
import JourneyMapCardTags from '@/Screens/JourneyMapScreen/components/JourneyMapTagsPopover';
import { BoxType } from '@/Screens/JourneyMapScreen/types.ts';

interface ICardInput {
  rowId: number;
  icon: ReactNode;
  headerColor: string;
  bodyColor: string;
  disabled: boolean;
  boxItem: BoxType;
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
  ({ rowId, icon, headerColor, bodyColor, disabled, boxItem, onHandleUpdateBoxElement }) => {
    const location = useLocation();
    const isGuest = location.pathname.includes('/guest');

    const [isActiveMode, setIsActiveMode] = useState(false);

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
                itemId={boxItem.boxTextElement?.id || null}
                changeActiveMode={updateActiveMode}
                attachedTagsCount={boxItem.boxTextElement?.tagsCount || 0}
                createTagItemAttrs={{
                  stepId: boxItem.step?.id || 0,
                  columnId: boxItem.columnId,
                  rowId: rowId,
                  cardType: MapCardTypeEnum.BoxTextElement,
                }}
                onClick={() => {
                  if (!boxItem.boxTextElement?.id) {
                    onHandleUpdateBoxElement({
                      previousText: '',
                      value: '',
                      columnId: boxItem.columnId,
                      stepId: boxItem.step?.id || 0,
                    });
                  }
                }}
              />
            )}
          </div>
        </div>

        <MapEditor
          disabled={disabled}
          itemData={{
            id: boxItem.id!,
            rowId: rowId,
            stepId: boxItem.step?.id || 0,
          }}
          onHandleTextChange={value => {
            onHandleUpdateBoxElement({
              previousText: boxItem.boxTextElement?.text || '',
              value,
              columnId: boxItem.columnId,
              stepId: boxItem.step?.id || 0,
            });
          }}
          initValue={boxItem.boxTextElement?.text || ''}
          isBackCard={false}
        />
      </div>
    );
  },
);

export default CardInput;
