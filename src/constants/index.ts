import { FileTypeConfigType } from '@/types';
import { FileTypeEnum } from '@/types/enum.ts';

export const TOKEN_NAME = 'suitecx-token';
export const LOGIN_ERROR_NAME = 'suitecx-login-error';

export const querySlateTime = 3000;
export const IMAGE_ASPECT = 400;
export const IMAGE_ASPECT_LARGE = 800;

export const DEFAULT_OUTCOME_ICON = `${import.meta.env.VITE_AWS_URL}/default/outcome-group/icon/action.svg`;

export const PERSONA_FILE_TYPES = ['JPG', 'PNG', 'GIF'];
export const EXEL_FILE_TYPES = ['XLS', 'XLSX', 'CSV'];

export const DEFAULT_OUTCOMES_GROUP = [
  {
    count: 0,
    icon: 'https://suitecx.s3.us-east-2.amazonaws.com/default/outcome-group/icon/opportuniti.svg',
    id: 1,
  },

  {
    count: 0,
    icon: 'https://suitecx.s3.us-east-2.amazonaws.com/default/outcome-group/icon/solution.svg',
    id: 2,
  },

  {
    count: 0,
    icon: 'https://suitecx.s3.us-east-2.amazonaws.com/default/outcome-group/icon/action.svg',
    id: 3,
  },
];

export const FILE_TYPE_CONFIG: Record<FileTypeEnum, FileTypeConfigType> = {
  [FileTypeEnum.IMAGE]: {
    accept: 'image/jpeg, image/png, image/gif',
    extensions: ['jpg', 'jpeg', 'png', 'gif'],
  },
  [FileTypeEnum.VIDEO]: {
    accept: '.mp3, video/mp3, video/mp4, video/webm, video/ogg, video/quicktime, video/x-m4v',
    extensions: ['mp3', 'mp4', 'webm', 'ogg', 'mov', 'm4v'],
  },
  [FileTypeEnum.MEDIA]: {
    accept: '.pdf, .doc, .docx, .xls, .xlsx, .csv, .ppt, .pptx',
    extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx'],
  },
};

export const SIGNATURE_TO_EXTENSION: Record<FileTypeEnum, Record<string, string>> = {
  [FileTypeEnum.IMAGE]: {
    FFD8FFDB: 'jpg',
    FFD8FFE0: 'jpg',
    FFD8FFE1: 'jpg',
    '89504E47': 'png',
    '47494638': 'gif',
  },
  [FileTypeEnum.VIDEO]: {
    '00000018FTYPMP4': 'mp4',
    '00000020FTYPISOM': 'mp4',
    '1A45DFA3': 'webm',
    '4F676753': 'ogg',
    '00000014FTYPQT': 'mov',
    '00000020FTYPMOOV': 'mov',
    '00000014': 'mov',
    '00000020': 'mp4',
    '00000018': 'm4v',
  },
  [FileTypeEnum.MEDIA]: {
    '25504446': 'pdf',
    D0CF11E0: 'doc',
    '504B0304': 'docx',
  },
};
