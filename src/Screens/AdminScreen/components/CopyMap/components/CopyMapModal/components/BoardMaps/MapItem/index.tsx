import { FC } from 'react';

import './style.scss';

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
      className={`board-map-item`}
      onClick={() => {
        setCopyMapState({
          template: CopyMapLevelTemplateEnum.ORGS,
          mapId: map?.id,
          boardId: null,
        });
      }}>
      <div className={'board-map-item--content`'}>
        <WuTooltip content={map?.title} showArrow position={'bottom'}>
          <div className={'board-map-item--content--title'}>{map?.title}</div>
        </WuTooltip>
      </div>
    </li>
  );
};

export default MapItem;
