import { FC } from 'react';

import './style.scss';

import '@cyntler/react-doc-viewer/dist/index.css';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

import BaseWuModal from '@/Components/Shared/BaseWuModal';

interface IMediaViewModal {
  isOpen: boolean;
  url: string;
  handleClose: () => void;
}

const MediaViewModal: FC<IMediaViewModal> = ({ isOpen, url, handleClose }) => {
  return (
    <BaseWuModal
      headerTitle={''}
      modalSize={'md'}
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={true}>
      <div className={'media-view'}>
        <DocViewer
          config={{}}
          documents={[
            { uri: `${import.meta.env.VITE_AWS_URL}/${url}`, fileType: url.split('.').at(-1) },
          ]}
          pluginRenderers={DocViewerRenderers}
        />
      </div>
    </BaseWuModal>
  );
};

export default MediaViewModal;
