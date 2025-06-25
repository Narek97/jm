import { MenuOptionsType } from '@/types';

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

export { MAP_HEADER_OPTIONS };
