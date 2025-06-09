import { FC } from 'react';

import './style.scss';
import ParentMapItem from './ParentMapItem';

interface IAtlasView {
  boardId: number;
  maps: Array<JourneyMapCardType>;
  createMap: (parentId: number) => void;
  onHandleDeleteJourney: (journeyMap: { id: number; parentId: number }) => void;
}

const AtlasView: FC<IAtlasView> = ({ boardId, maps, createMap, onHandleDeleteJourney }) => {
  const parentMaps = maps?.filter(
    map => map.childMaps?.length || (!map.childMaps?.length && !map?.parentMaps?.length),
  );

  return (
    <div className={'atlas-view--maps'}>
      {parentMaps.map(map => (
        <ParentMapItem
          key={map?.id}
          boardId={boardId}
          map={map}
          onHandleDeleteJourney={onHandleDeleteJourney}
          createMap={createMap}
        />
      ))}
    </div>
  );
};

export default AtlasView;
