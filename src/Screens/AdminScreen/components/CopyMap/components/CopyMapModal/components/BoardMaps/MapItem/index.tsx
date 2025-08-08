import { FC } from 'react';

import { WuTooltip } from '@npm-questionpro/wick-ui-lib';

import { JourneysForCopyType } from '../types';

import { useCopyMapStore } from '@/Store/copyMap.ts';
import { CopyMapLevelTemplateEnum } from '@/types/enum.ts';

interface IBoardItem {
  map: JourneysForCopyType;
}

const MapItem: FC<IBoardItem> = ({ map }) => {
  const { setCopyMapState } = useCopyMapStore();
  return (
    <li
      data-testid={`map-item-test-id-${map?.id}`}
      className={`selectable-item`}
      onClick={() => {
        setCopyMapState({
          template: CopyMapLevelTemplateEnum.ORGS,
          mapId: map?.id,
          boardId: null,
        });
      }}>
      <div className={'pl-2 break-all'}>
        <WuTooltip content={map?.title} showArrow position={'bottom'}>
          <div className={'text-[var(--primary)] font-medium text-base truncate max-w-full'}>{map?.title}</div>
        </WuTooltip>
      </div>
    </li>
  );
};

export default MapItem;
