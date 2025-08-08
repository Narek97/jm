import { FC, useState } from 'react';

import { WuPopover, WuTooltip } from '@npm-questionpro/wick-ui-lib';

import JourneyMapTagsPopoverContent from './JourneyMapTagsPopoverContent';

import { MapCardTypeEnum } from '@/api/types.ts';

interface IJourneyMapCardNote {
  cardType: MapCardTypeEnum;
  itemId: number | null;
  createTagItemAttrs: {
    columnId: number;
    stepId: number;
    rowId: number;
    cardType?: MapCardTypeEnum;
  };
  attachedTagsCount: number;
  changeActiveMode?: (isActive: boolean) => void;
  onClick?: () => void;
}

const JourneyMapCardTags: FC<IJourneyMapCardNote> = ({
  cardType,
  itemId,
  createTagItemAttrs,
  attachedTagsCount,
  changeActiveMode,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  return (
    <WuTooltip
      className="break-all"
      position={'bottom'}
      positionOffset={10}
      content={'Tag'}>
      {attachedTagsCount ? (
        <div
          className={'absolute w-[6px] h-[6px] rounded-[50px] bg-[#1B87E6] top-[2px] left-[2px]'}
        />
      ) : null}
      <WuPopover
        isOpen={isHovered}
        onOpenChange={(isOpen: boolean) => changeActiveMode?.(isOpen)}
        modal={true}
        Trigger={
          <button
            onClick={e => {
              e.stopPropagation();
              if (onClick) {
                onClick();
              }
            }}
            className={'tage-btn'}
            data-testid="tag-button-test-id"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <span
              className={'wm-tag'}
              style={{
                color: isHovered ? '#1B3380' : '#545E6B',
              }}
            />
          </button>
        }>
        <JourneyMapTagsPopoverContent
          cardType={cardType}
          itemId={itemId}
          attachedTagsCount={attachedTagsCount}
          createTagItemAttrs={createTagItemAttrs}
        />
      </WuPopover>
    </WuTooltip>
  );
};

export default JourneyMapCardTags;
