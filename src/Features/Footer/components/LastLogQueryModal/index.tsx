import { FC } from 'react';

import './style.scss';
import packageJson from '../../../../../package.json';

import {
  GetUserLastPerformanceLogQuery,
  useGetUserLastPerformanceLogQuery,
} from '@/api/queries/generated/getUserLastPerformanceLog.generated.ts';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import BaseWuModal from '@/Components/Shared/BaseWuModal';

const wickUiVersion = (packageJson.devDependencies['@npm-questionpro/wick-ui-lib'] || '').replace(
  /^[^\d]*/,
  '',
);
const wickUiIconsVersion = (
  packageJson.devDependencies['@npm-questionpro/wick-ui-icon'] || ''
).replace(/^[^\d]*/, '');

interface ILastLogQueryModal {
  isOpen: boolean;
  handleClose: () => void;
}
const LastLogQueryModal: FC<ILastLogQueryModal> = ({ handleClose, isOpen }) => {
  const { data: dataQuery, isLoading: isLoadingQuery } = useGetUserLastPerformanceLogQuery<
    GetUserLastPerformanceLogQuery,
    Error
  >();

  const query = dataQuery?.getUserLastPerformanceLog;
  const getResponsePayloadSizeColor = (payloadSize: number) => {
    if (payloadSize <= 1) {
      return '#51ff51';
    } else if (payloadSize <= 10) {
      return '#ffff73';
    } else {
      return '#ff9f9f';
    }
  };

  const getResponseTimeColor = (time: number) => {
    if (time < 300) {
      return '#51ff51';
    } else if (time < 3000) {
      return '#ffff73';
    } else {
      return '#ff9f9f';
    }
  };

  return (
    <BaseWuModal
      headerTitle={'User last Query'}
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={true}
      modalSize={'md'}>
      <div className={'last-user-query-modal'} data-testid="last-user-query-modal-test-id">
        {isLoadingQuery ? (
          <BaseWuLoader />
        ) : (
          <>
            <div className={'last-user-query-modal--query-item'}>
              <p className={'last-user-query-modal--title'}>Path: </p>
              <p className={'last-user-query-modal--key'}>{query?.path}</p>
            </div>
            <div className={'last-user-query-modal--query-item'}>
              <p className={'last-user-query-modal--title'}>Payload Time: </p>
              <p
                data-testid={'last-user-query-modal--key-test-id'}
                className={'last-user-query-modal--key last-user-query-modal--time-key'}
                style={{
                  background: getResponseTimeColor(query?.responseTime || 0),
                }}>
                {query?.responseTime}
              </p>
            </div>
            <div className={'last-user-query-modal--query-item'}>
              <p className={'last-user-query-modal--title'}>Payload Size: </p>
              <p
                className={'last-user-query-modal--key last-user-query-modal--size-key'}
                data-testid="query-payload-size-test-id"
                style={{
                  background: getResponsePayloadSizeColor(query?.payloadSize || 0),
                }}>
                {query?.payloadSize}
              </p>
            </div>
            <div className={'last-user-query-modal--query-item'}>
              <p className={'last-user-query-modal--title'}>Query Count: </p>
              <p>{query?.queryCount}</p>
            </div>
            <div className={'last-user-query-modal--query-item'}>
              <p className={'last-user-query-modal--title'}>Query Method: </p>
              <p className={'last-user-query-modal--key'}>{query?.method}</p>
            </div>
            <div className={'last-user-query-modal--query-item'}>
              <p className={'last-user-query-modal--title'}>Wick Ui version: </p>
              <p>{wickUiVersion}</p>
            </div>
            <div className={'last-user-query-modal--query-item'}>
              <p className={'last-user-query-modal--title'}>Wick Ui icons version: </p>
              <p>{wickUiIconsVersion}</p>
            </div>
            <div className={'last-user-query-modal--query-item'}>
              <p className={'last-user-query-modal--title'}>Query SQL: </p>
              <ul className={'last-user-query-modal--sql-key'}>
                {query?.sqlRowQueries?.map((el, index) => (
                  <li key={index}>
                    <span>{index + 1}: </span>
                    <span>{el}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </BaseWuModal>
  );
};

export default LastLogQueryModal;
