import { FC } from 'react';

import './style.scss';
import ParentMapItem from '@/Screens/JourniesScreen/components/AtlasView/ParentMapItem';
import { JourneyType } from '@/Screens/JourniesScreen/types.ts';

interface IAtlasView {
  maps: Array<JourneyType>;
  createMap: (parentId: number) => void;
  onHandleDeleteJourney: (journeyMap: JourneyType) => void;
}

const AtlasView: FC<IAtlasView> = ({ maps, createMap, onHandleDeleteJourney }) => {
  const parentMaps = maps?.filter(
    map => map.childMaps?.length || (!map.childMaps?.length && !map?.parentMaps?.length),
  );

  return (
    <div className={'atlas-view--maps'}>
      {parentMaps.map(map => (
        <ParentMapItem
          key={map?.id}
          onHandleDeleteJourney={onHandleDeleteJourney}
          createMap={createMap}
          map={map}
        />
      ))}
    </div>
  );
};

export default AtlasView;
