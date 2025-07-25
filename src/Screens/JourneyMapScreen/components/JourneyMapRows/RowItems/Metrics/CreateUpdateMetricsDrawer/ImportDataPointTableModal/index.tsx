import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';

import { useWuShowToast, WuButton } from '@npm-questionpro/wick-ui-lib';
import { v4 as uuidv4 } from 'uuid';

import { DatapointType } from '../../types';

import { MetricsTypeEnum } from '@/api/types';
import BaseWuDataTable from '@/Components/Shared/BaseWuDataTable';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import {
  METRIC_CES_DATA_POINT_EXEL_TABLE_COLUMNS,
  METRIC_CSAT_DATA_POINT_EXEL_TABLE_COLUMNS,
  METRIC_NPS_DATA_POINT_EXEL_TABLE_COLUMNS,
} from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/Metrics/constants.tsx';
import { ObjectKeysType } from '@/types';
import { isValidNumberFormat } from '@/utils/isValidNumberFormat';

interface IImportDataPointTableModal {
  metricsType: MetricsTypeEnum;
  isOpen: boolean;
  datapointFile: Array<ObjectKeysType>;
  onHandleAddDataPont: (data: Array<DatapointType>) => void;
  handleClose: () => void;
}

const ImportDataPointTableModal: FC<IImportDataPointTableModal> = ({
  metricsType,
  isOpen,
  datapointFile,
  onHandleAddDataPont,
  handleClose,
}) => {
  const { showToast } = useWuShowToast();

  const [rows, setRows] = useState<Array<DatapointType>>([]);

  const lowercaseKeys = (obj: ObjectKeysType) => {
    const newObj: ObjectKeysType = {};
    for (const key in obj) {
      newObj[key.toLowerCase()] = obj[key];
    }
    return newObj;
  };

  const getTableRowByType = useCallback(
    (obj: ObjectKeysType) => {
      switch (metricsType) {
        case MetricsTypeEnum.Nps: {
          return {
            id: uuidv4(),
            date: obj.date,
            detractor: isValidNumberFormat(obj.detractor) ? obj.detractor : null,
            passive: isValidNumberFormat(obj.passive) ? obj.passive : null,
            promoter: isValidNumberFormat(obj.promoter) ? obj.promoter : null,
          };
        }
        case MetricsTypeEnum.Csat: {
          return {
            id: uuidv4(),
            date: obj.date,
            satisfied: isValidNumberFormat(obj.satisfied) ? obj.satisfied : null,
            neutral: isValidNumberFormat(obj.neutral) ? obj.neutral : null,
            dissatisfied: isValidNumberFormat(obj.dissatisfied) ? obj.dissatisfied : null,
          };
        }
        case MetricsTypeEnum.Ces: {
          return {
            id: uuidv4(),
            date: obj.date,
            easy: isValidNumberFormat(obj.easy) ? obj.easy : null,
            neutral: isValidNumberFormat(obj.neutral) ? obj.neutral : null,
            difficult: isValidNumberFormat(obj.difficult) ? obj.difficult : null,
          };
        }
      }
    },
    [metricsType],
  );

  const onHandleSaveDataPoint = () => {
    let isError = false;
    rows.forEach(object => {
      for (const key in object) {
        if (key !== 'id') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (key.toLowerCase() === 'date' && typeof object[key] !== 'string') {
            isError = true;
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (key.toLowerCase() !== 'date' && typeof object[key] !== 'number') {
            isError = true;
          }
        }
      }
    });

    if (isError) {
      showToast({
        variant: 'success',
        message: 'You need to fill in all the cells',
      });
    } else {
      onHandleAddDataPont(rows);
      handleClose();
    }
  };

  const onHandleRowChange = useCallback(
    (data: DatapointType, value: string | number, key: string) => {
      setRows(prev =>
        prev.map(r => {
          if (r.id === data.id) {
            return { ...r, [key]: value };
          }
          return r;
        }),
      );
    },
    [],
  );

  const onHandleRowDelete = useCallback(
    (data?: DatapointType) => {
      if (rows.length === 1) {
        handleClose();
      }
      setRows(prev => prev.filter(r => r.id !== data?.id));
    },
    [handleClose, rows.length],
  );

  const columns: ObjectKeysType = useMemo(() => {
    return {
      [MetricsTypeEnum.Nps]: METRIC_NPS_DATA_POINT_EXEL_TABLE_COLUMNS({
        onHandleRowChange,
        onHandleRowDelete,
      }),
      [MetricsTypeEnum.Csat]: METRIC_CSAT_DATA_POINT_EXEL_TABLE_COLUMNS({
        onHandleRowChange,
        onHandleRowDelete,
      }),
      [MetricsTypeEnum.Ces]: METRIC_CES_DATA_POINT_EXEL_TABLE_COLUMNS({
        onHandleRowChange,
        onHandleRowDelete,
      }),
    };
  }, [onHandleRowDelete, onHandleRowChange]);

  useEffect(() => {
    const transformedData = datapointFile
      .map(obj => lowercaseKeys(obj))
      .map(obj => getTableRowByType(obj));
    setRows(transformedData as Array<DatapointType>);
  }, [datapointFile, getTableRowByType]);

  return (
    <BaseWuModal
      headerTitle={'Map data points'}
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={true}
      modalSize={'lg'}
      ModalConfirmButton={
        <WuButton
          type={'button'}
          data-testid="submit-outcome-test-id"
          onClick={onHandleSaveDataPoint}>
          Save
        </WuButton>
      }>
      <div className={'import-data-point-table-modal'}>
        <p className={'import-data-point-table-modal--title'}>
          Remap your data before importing it into your new metric
        </p>
        <div className={'import-data-point-table-modal--table-block'}>
          <BaseWuDataTable columns={columns[metricsType]} data={rows} />
        </div>
      </div>
    </BaseWuModal>
  );
};

export default ImportDataPointTableModal;
