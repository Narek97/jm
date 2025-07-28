import { FC, useState } from 'react';

import './style.scss';

import { WuButton } from '@npm-questionpro/wick-ui-lib';
import { FileUploader } from 'react-drag-drop-files';
import * as XLSX from 'xlsx';

import { CES_TEMPLATE, CSAT_TEMPLATE, NPS_TEMPLATE } from '../../constants';

import { MetricsTypeEnum } from '@/api/types.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import CustomFileUploader from '@/Components/Shared/CustomFileUploader';
import CustomFileUploader2 from '@/Components/Shared/CustomFileUploader/index2.tsx';
import { EXEL_FILE_TYPES } from '@/Constants';
import { ObjectKeysType } from '@/types';

interface IImportDataPointModal {
  metricsType: MetricsTypeEnum;
  isOpen: boolean;
  onHandleSetUploadFile: (dataFile: Array<ObjectKeysType>) => void;
  onToggleImportDataPointTableModal: () => void;
  handleClose: () => void;
}

const ImportDataPointModal: FC<IImportDataPointModal> = ({
  isOpen,
  metricsType,
  onHandleSetUploadFile,
  onToggleImportDataPointTableModal,
  handleClose,
}) => {
  const [fileName, setFileName] = useState<string>('Choose file');
  const [isFileUpload, setIsFileUpload] = useState<boolean>(false);

  const isValidDate = (d: Date | any): boolean => {
    return d instanceof Date && !isNaN(d.getTime());
  };

  const processDates = (data: any[]): any[] => {
    return data.map(item => {
      let date: Date;

      if (typeof item.Date === 'number') {
        date = new Date((item.Date - 25569) * 86400 * 1000);
      } else if (typeof item.Date === 'string') {
        date = new Date(item.Date);
      } else {
        return null;
      }

      if (isValidDate(date)) {
        return {
          ...item,
          Date: date.toISOString().split('T')[0],
        };
      } else {
        return {
          ...item,
          Date: null,
        };
      }
    });
  };

  const handleFileUpload = (file: File | File[]) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        const workbook = XLSX.read(event.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet);
        onHandleSetUploadFile(processDates(sheetData) as ObjectKeysType[]);
        setFileName((file as File).name);
        setIsFileUpload(true);
      };
      reader.readAsBinaryString(file as File);
    }
  };

  const handleFileExport = () => {
    const templates: ObjectKeysType = {
      [MetricsTypeEnum.Nps]: NPS_TEMPLATE,
      [MetricsTypeEnum.Csat]: CSAT_TEMPLATE,
      [MetricsTypeEnum.Ces]: CES_TEMPLATE,
    };

    const ws = XLSX.utils.json_to_sheet(templates[metricsType] as Array<ObjectKeysType>);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `example-${metricsType}.xlsx`);
  };

  const onHandleNext = () => {
    onToggleImportDataPointTableModal();
  };

  return (
    <BaseWuModal
      headerTitle={'Import data points'}
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={true}
      ModalConfirmButton={
        <WuButton
          type={'submit'}
          data-testid="next-data-point-btn-test-id"
          disabled={!isFileUpload}
          onClick={onHandleNext}>
          Next
        </WuButton>
      }>
      <div className={'import-data-point-modal'}>
        <p className={'import-data-point-modal--title'}>
          You can import your Excel or CSV files here to upload the data points to your journey.
        </p>
        <div className={'import-data-point-modal--file-upload'}>
          <FileUploader
            classes={`attachments--file-uploader`}
            multiple={false}
            handleChange={handleFileUpload}
            name="file"
            types={EXEL_FILE_TYPES}>
            <CustomFileUploader
              uploadProgress={0}
              content={<CustomFileUploader2 title={fileName} />}
            />
          </FileUploader>
        </div>
        <button
          data-testid="export-data-point-exel-test-id"
          className={'import-data-point-modal--file-download'}
          onClick={handleFileExport}>
          <p className={'import-data-point-modal--file-download--title'}>
            <span className={'wc-data-import'} /> Download import template
          </p>
        </button>
      </div>
    </BaseWuModal>
  );
};

export default ImportDataPointModal;
