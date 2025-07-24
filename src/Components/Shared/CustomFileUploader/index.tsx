import { ReactNode } from 'react';
import './style.scss';

import { Circle } from 'rc-progress';

const CustomFileUploader = ({
  uploadProgress,
  content,
  icon,
  showText = true,
}: {
  uploadProgress: number;
  content?: ReactNode;
  icon?: ReactNode;
  showText?: boolean;
}) => {
  return (
    <div className={'custom-file-uploader'} data-testid={'custom-file-uploader'}>
      {uploadProgress ? (
        <div
          className={'custom-file-uploader-progress'}
          data-testid={'custom-file-uploader-progress-test-id'}>
          <div className={'custom-file-uploader-progress-percentage'}>{uploadProgress}%</div>
          <Circle percent={uploadProgress} strokeWidth={4} strokeColor="#D3D3D3" />
        </div>
      ) : (
        <>
          {content ? (
            content
          ) : (
            <>
              {icon || <span className={'wm-image'} />}
              {showText && <p className={'upload-text'}>Add picture</p>}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CustomFileUploader;
