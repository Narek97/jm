import { ChangeEvent } from 'react';

import { BoxElementType } from '@/Screens/JourneyMapScreen/types.ts';
import { MenuOptionsType } from '@/types';
import { FileTypeEnum } from '@/types/enum';

const MAP_HEADER_OPTIONS = ({
  isDebugMode,
  isSingle,
  onHandleCopyPageUrl,
  onHandleOpenDebugTable,
  onHandleToggleVersionDrawer,
  onHandleToggleHistoryDrawer,
  onHandleToggleConvertChildModal,
  onHandleDownloadPdf,
}: {
  isDebugMode: boolean;
  isSingle: boolean;
  onHandleCopyPageUrl: () => void;
  onHandleOpenDebugTable: () => void;
  onHandleToggleHistoryDrawer: () => void;
  onHandleToggleVersionDrawer: () => void;
  onHandleToggleConvertChildModal: () => void;
  onHandleDownloadPdf: () => void;
}): Array<MenuOptionsType> => {
  const options = [
    {
      icon: <span className={'wm-share-windows'} />,
      name: 'Share map',
      onClick: onHandleCopyPageUrl,
    },
    {
      icon: <span className={'wm-history'} />,
      name: 'History map',
      onClick: onHandleToggleHistoryDrawer,
    },
    {
      icon: <span className={'wm-layers'} />,
      name: 'Version',
      onClick: onHandleToggleVersionDrawer,
    },
    {
      icon: <span className="wm-download" />,
      name: 'Download pdf',
      onClick: onHandleDownloadPdf,
    },
  ];

  if (isDebugMode) {
    options.unshift({
      icon: <span className="wm-bug-report" />,
      name: 'Debug map',
      onClick: onHandleOpenDebugTable,
    });
  }
  if (isSingle) {
    options.push({
      icon: <span className="wc-level-child" />,
      name: 'Convert to child map',
      onClick: onHandleToggleConvertChildModal,
    });
  }

  return options;
};

const JOURNEY_MAP_COLUM_OPTIONS = ({
  onHandleDelete,
  onHandleChangeColor,
  isDeleteDisable,
  color,
}: {
  onHandleDelete: (data: BoxElementType) => void;
  onHandleChangeColor: (e: ChangeEvent<HTMLInputElement>) => void;
  isDeleteDisable: boolean;
  color?: string;
}): Array<MenuOptionsType> => {
  const list: Array<MenuOptionsType> = [
    {
      icon: (
        <>
          <label
            htmlFor="map-colum-color-picker"
            className={'custom-vertical-menu--menu-item-content-icon'}>
            <span className={'wm-colorize'} />
            <input
              data-testid={'color-picker'}
              type={'color'}
              value={color}
              id={'map-colum-color-picker'}
              onChange={onHandleChangeColor}
              style={{
                width: 0,
                opacity: 0,
              }}
            />
          </label>
        </>
      ),
      isColorPicker: true,
      name: 'background',
      label: (
        <label htmlFor="map-colum-color-picker" style={{ height: '2rem', lineHeight: '2rem' }}>
          Background
        </label>
      ),
      onClick: () => {},
    },
  ];

  if (!isDeleteDisable) {
    list.unshift({
      icon: <span className={'wm-delete'} />,
      name: 'Delete',
      onClick: item => onHandleDelete(item),
    });
  }
  return list;
};

const JOURNEY_MAP_STEP_OPTIONS = ({
  onHandleDelete,
  onHandleChangeColor,
  color,
  isSingleStep,
}: {
  onHandleDelete: (data: BoxElementType) => void;
  onHandleChangeColor: (e: ChangeEvent<HTMLInputElement>) => void;
  color?: string;
  isSingleStep: boolean;
}): Array<MenuOptionsType> => {
  const list: Array<MenuOptionsType> = [
    {
      icon: (
        <>
          <label
            htmlFor="map-colum-color-picker"
            className={'custom-vertical-menu--menu-item-content-icon'}>
            <span className={'wm-colorize'} />
            <input
              data-testid={'color-picker'}
              type={'color'}
              value={color}
              id={'map-colum-color-picker'}
              onChange={onHandleChangeColor}
              style={{
                width: 0,
                opacity: 0,
              }}
            />
          </label>
        </>
      ),
      isColorPicker: true,
      name: 'background',
      label: (
        <label htmlFor="map-colum-color-picker" style={{ height: '2rem', lineHeight: '2rem' }}>
          Background
        </label>
      ),
      onClick: () => {},
    },
  ];
  if (isSingleStep) {
    list.unshift({
      icon: <span className={'wm-delete'} />,
      name: 'Delete',
      onClick: item => onHandleDelete(item),
    });
  }

  return list;
};

const JOURNEY_MAP_COLUM_ROW_OPTIONS = ({
  isDisabled,
  onHandleDelete,
  onHandleLock,
}: {
  isDisabled: boolean;
  onHandleDelete: () => void;
  onHandleLock: () => void;
}): Array<MenuOptionsType> => {
  return [
    {
      icon: <span className={'wm-delete'} />,
      name: 'Delete',
      disabled: isDisabled,
      onClick: onHandleDelete,
    },
    {
      icon: isDisabled ? (
        <span
          className={'wm-lock-open'}
          style={{
            color: '#545E6B',
          }}
        />
      ) : (
        <span
          className={'wm-lock'}
          style={{
            color: '#545E6B',
          }}
        />
      ),
      name: isDisabled ? 'Unlock' : 'Lock',
      onClick: onHandleLock,
    },
  ];
};

const JOURNEY_MAP_IMAGE_OPTIONS = ({
  onHandleOpenViewModal,
  onHandleFileUpload,
  onHandleFit,
  onHandleFill,
  onHandleCrop,
  onHandleDelete,
}: {
  onHandleOpenViewModal: () => void;
  onHandleFileUpload: (e: ChangeEvent<HTMLInputElement>, type: FileTypeEnum) => void;
  onHandleFit: (data: CommentButtonItemType) => void;
  onHandleFill: (data: CommentButtonItemType) => void;
  onHandleCrop: (data: CommentButtonItemType) => void;
  onHandleDelete: (data: CommentButtonItemType) => void;
}): Array<MenuOptionsType> => {
  return [
    {
      icon: <span className={'wm-eye-tracking'} />,
      name: 'View',
      onClick: onHandleOpenViewModal,
    },
    {
      icon: (
        <>
          <span className={'wm-edit'} />
          <input
            style={{
              opacity: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '6.25rem',
              height: '100%',
              cursor: 'pointer',
            }}
            id={'file'}
            type="file"
            data-testid={'file-input-test-id'}
            accept="image/jpeg, image/png"
            onChange={e => {
              onHandleFileUpload(e, FileTypeEnum.IMAGE);
            }}
          />
        </>
      ),
      name: 'Update',
      isFileUpload: true,
    },
    {
      icon: <span className={'wm-zoom-in-map'} />,
      name: 'Fit',
      onClick: item => onHandleFit(item),
    },
    {
      icon: <span className={'wm-zoom-out-map'} />,
      name: 'Fill',
      onClick: item => onHandleFill(item),
    },
    {
      icon: <span className={'wm-crop'} />,
      name: 'Crop',
      onClick: item => onHandleCrop(item),
    },
    {
      icon: <span className={'wm-delete'} />,
      name: 'Delete',
      onClick: item => onHandleDelete(item),
    },
  ];
};

const JOURNEY_MAP_LOADING_ROW = {
  id: 99999,
  isLoading: true,
  boxElements: [],
  touchPoints: [],
  outcomes: [],
  metrics: [],
  links: [],
  mergeCount: 1,
  step: {
    id: 99999,
    isMerged: false,
    name: '',
    index: 1,
    columnId: 1,
    bgColor: null,
  },
  columnId: 0,
  average: 0,
};

const JOURNEY_MAP_LOADING_COLUMN = {
  id: 99999,
  label: '',
  bgColor: '#D9DFF2',
  size: 1,
  isMerged: false,
  isLoading: true,
  isNextColumnMerged: false,
};

export {
  MAP_HEADER_OPTIONS,
  JOURNEY_MAP_COLUM_OPTIONS,
  JOURNEY_MAP_STEP_OPTIONS,
  JOURNEY_MAP_COLUM_ROW_OPTIONS,
  JOURNEY_MAP_IMAGE_OPTIONS,
  JOURNEY_MAP_LOADING_ROW,
  JOURNEY_MAP_LOADING_COLUMN,
};
