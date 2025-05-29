import { ReactNode } from 'react';
import './style.scss';

import LinearProgress from '@mui/material/LinearProgress';

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
          <LinearProgress variant="determinate" value={uploadProgress} />
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
