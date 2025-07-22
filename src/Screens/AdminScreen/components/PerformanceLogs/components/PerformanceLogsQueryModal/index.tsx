import { FC } from 'react';

import BaseWuModal from '@/Components/Shared/BaseWuModal';

interface IPerformanceLogsQueryModal {
  isOpen: boolean;
  handleClose: () => void;
  queries: string[];
}

const PerformanceLogsQueryModal: FC<IPerformanceLogsQueryModal> = ({
  queries,
  isOpen,
  handleClose,
}) => {
  return (
    <BaseWuModal
      headerTitle={'Queries'}
      modalSize={'md'}
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={true}>
      <ul className={'!p-4 !max-h-[60dvh] overflow-y-auto'}>
        {queries.map((query, index) => (
          <li className={'!mt-[10px]'} key={query}>
            {index + 1}. {query}
          </li>
        ))}
      </ul>
    </BaseWuModal>
  );
};

export default PerformanceLogsQueryModal;
