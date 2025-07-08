import { ChangeEvent, FC } from 'react';

import './style.scss';
import { BoxElementType } from '@/Screens/JourneyMapScreen/types.ts';
import { FileTypeEnum } from '@/types/enum.ts';

interface IRowFileUploader {
  rowItem: BoxElementType;
  index: number;
  accept: string;
  type: FileTypeEnum;
  addItem: (e: ChangeEvent<HTMLInputElement>, stepId: number, type: FileTypeEnum) => void;
}

const RowFileUploader: FC<IRowFileUploader> = ({ rowItem, index, accept, type, addItem }) => {
  return (
    <div
      className={`map-row-file-uploader ${
        rowItem?.boxElements.length ? '' : 'map-row-file-uploader--firs-card'
      }`}>
      <label
        htmlFor={
          rowItem.id
            ? type + rowItem.id?.toString() + rowItem.step?.id
            : `file+${index}+${type}+${rowItem.step?.id}`
        }
        className={`map-row-file-uploader--add-image-label ${
          rowItem?.boxElements.length ? '' : 'map-row-file-uploader--add-image-first-label'
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
            rowItem.id
              ? type + rowItem.id?.toString() + rowItem.step?.id
              : `file+${index}+${type}+${rowItem.step?.id}`
          }
          type="file"
          accept={accept}
          onChange={e => addItem(e, rowItem.step?.id || 0, type)}
        />
      </label>
    </div>
  );
};

export default RowFileUploader;
