import { ChangeEvent, FC } from 'react';

import './style.scss';
import { BoxType } from '@/Screens/JourneyMapScreen/types.ts';
import { FileTypeEnum } from '@/types/enum.ts';

interface IRowFileUploader {
  boxItem: BoxType;
  index: number;
  accept: string;
  type: FileTypeEnum;
  addItem: (e: ChangeEvent<HTMLInputElement>, stepId: number, type: FileTypeEnum) => void;
}

const RowFileUploader: FC<IRowFileUploader> = ({ boxItem, index, accept, type, addItem }) => {
  return (
    <div
      className={`map-row-file-uploader ${
        boxItem?.boxElements.length ? '' : 'map-row-file-uploader--firs-card'
      }`}>
      <label
        htmlFor={
          boxItem.id
            ? type + boxItem.id?.toString() + boxItem.step?.id
            : `file+${index}+${type}+${boxItem.step?.id}`
        }
        className={`map-row-file-uploader--add-image-label ${
          boxItem?.boxElements.length ? '' : 'map-row-file-uploader--add-image-first-label'
        }`}>
        <span
          className={'wm-add'}
          style={{
            color: '#1B87E6',
          }}
        />
        <input
          className={'image-upload-input'}
          id={
            boxItem.id
              ? type + boxItem.id?.toString() + boxItem.step?.id
              : `file+${index}+${type}+${boxItem.step?.id}`
          }
          type="file"
          accept={accept}
          onChange={e => addItem(e, boxItem.step?.id || 0, type)}
        />
      </label>
    </div>
  );
};

export default RowFileUploader;
