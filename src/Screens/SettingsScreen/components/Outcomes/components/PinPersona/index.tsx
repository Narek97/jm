import { useState } from 'react';

import { WuButton, WuTooltip } from '@npm-questionpro/wick-ui-lib';

import PinPersonaModal from './PinPersonaModal';

import { useOutcomePinBoardsStore } from '@/Store/outcomePinBoards';
import { useOutcomePinnedBoardIdsStore } from '@/Store/outcomePinBoardsIds';

const PinPersona = ({
  outcomeGroupId,
  updatePinnedBoardsList,
}: {
  outcomeGroupId?: number;
  updatePinnedBoardsList: (data: { pinned: number[] }) => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { outcomePinnedBoardIds } = useOutcomePinnedBoardIdsStore();
  const { setSelectedIdList } = useOutcomePinBoardsStore();

  return (
    <div className={'pin-persona'}>
      {' '}
      {isOpen && (
        <PinPersonaModal
          handleClose={() => {
            setIsOpen(false);
          }}
          isOpen={isOpen}
          outcomeGroupId={outcomeGroupId}
          updatePinnedBoardsList={updatePinnedBoardsList}
        />
      )}
      <WuTooltip
        className="wu-tooltip-content"
        content={`Pin`}
        dir="ltr"
        duration={200}
        position="bottom">
        <WuButton
          type="button"
          data-testid="pin-persona-id"
          Icon={<span className="wm-attach-file" />}
          variant="iconOnly"
          onClick={() => {
            setSelectedIdList(outcomePinnedBoardIds[outcomeGroupId || 'new']?.selected ?? []);
            setIsOpen(true);
          }}></WuButton>
      </WuTooltip>
    </div>
  );
};

export default PinPersona;
