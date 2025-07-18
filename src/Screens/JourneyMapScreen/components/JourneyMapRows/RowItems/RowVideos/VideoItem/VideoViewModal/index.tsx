import { FC } from 'react';

import './style.scss';

import { WuModal } from '@npm-questionpro/wick-ui-lib';

interface IVideoViewModal {
  url: string;
  isOpen: boolean;
  handleClose: () => void;
}

const VideoViewModal: FC<IVideoViewModal> = ({ isOpen, url, handleClose }) => {
  const fileExtension = url.split('.').pop()?.toLowerCase();
  const isAudioOnly = fileExtension === 'mp3';

  return (
    <WuModal
      // modalSize={'custom'}
      open={isOpen}
      onOpenChange={handleClose}>
      <div className={'video-view'}>
        {isAudioOnly && (
          <div className={'video-view--mp3-block'}>
            {/*todo icon*/}
            MP3
          </div>
        )}
        <video controls>
          <source src={`${import.meta.env.VITE_AWS_URL}/${url}`} />
          Your browser does not support the video tag.
        </video>
      </div>
    </WuModal>
  );
};

export default VideoViewModal;
