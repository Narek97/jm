import { FC } from 'react';

import './style.scss';

import { Tooltip } from '@mui/material';

import { JourneysForCopyType } from '../types';

import { useCopyMapStore } from '@/store/copyMap.ts';
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
        <Tooltip title={map?.title} arrow placement={'bottom'}>
          <div className={'board-map-item--content--title'}>{map?.title}</div>
        </Tooltip>
      </div>
    </li>
  );
};

export default MapItem;
