import './style.scss';
import { FC } from 'react';

import { WuButton } from '@npm-questionpro/wick-ui-lib';

interface ILayersModalEmptyState {
  addLayer: () => void;
}

const LayersModalEmptyState: FC<ILayersModalEmptyState> = ({ addLayer }) => {
  return (
    <div className={'layers-modal-empty-state-container'} data-testid="empty-data-test-id">
      <div className={'layers-modal-empty-state-container--title'}>
        There are no Layers created yet
      </div>
      <div className={'layers-modal-empty-state-container--message'}>
        Create your first layer and look for the exact data you are looking for
      </div>
      <WuButton className={'add-new-layer'} Icon={<span className="wm-add" />} onClick={addLayer}>
        Add Layer
      </WuButton>
    </div>
  );
};

export default LayersModalEmptyState;
