import { MetricsDateRangeEnum, MetricsSourceEnum, MetricsTypeEnum } from '@/api/types.ts';
import { BoxType } from '@/Screens/JourneyMapScreen/types.ts';

type RowType = {
  rowID: number;
  text: string;
  required: boolean;
  prefix: string;
  suffix: string;
  displayTextBoxBySide: boolean;
  characterLimit: number;
  columns: ColumnType[];
};

type ColumnType = {
  columnID: number;
  isDefault: boolean;
};

type SurveyLanguageType = {
  languageID: number;
  name: string;
  contents: any;
  default: boolean;
};

type NpsType = {
  date: Date | string;
  detractor: number;
  passive: number;
  promoter: number;
};

type CsatType = {
  date: Date | string;
  satisfied: number;
  neutral: number;
  dissatisfied: number;
};

type CesType = {
  date: Date | string;
  easy: number;
  neutral: number;
  difficult: number;
};

type DatapointType = (NpsType | CsatType | CesType) & {
  id: string | number;
  repeat?: boolean | null;
};

type DataPointFormType = {
  valueOne: number;
  valueTwo: number;
  valueThree: number;
};

type MetricsType = BoxType['metrics'][number];

type MetricsFormType = {
  name: string;
  descriptionEnabled: boolean;
  description: string | null;
  source: MetricsSourceEnum;
  type: MetricsTypeEnum;
  dateRange: MetricsDateRangeEnum;
  survey: number | null;
  question: number | null;
  goal: number;
};

type CustomMetricsType = {
  value: number;
  date: Date | string;
  id?: string | number;
  repeat?: boolean | null;
};

type CustomMetricsFormType = {
  value: number;
};

type MetricsSurveyItemType = {
  surveyID: number;
  folderID: number;
  name: string;
  url: string;
  status: string;
  creationDate: string;
  modifiedDate: string;
  thankYouMessage: string;
  responseQuota: number;
  expiryDate: string | null;
  inactiveText: string;
  abbs: boolean;
  saveAndContinue: boolean;
  surveyFinishMode: number;
  completedText: string;
  terminatedText: string;
  quotaOverlimitText: string;
  hasScoringLogic: boolean;
  completedResponses: number;
  viewedResponses: number;
  startedResponses: number;
  terminatedResponses: number;
  lastResponseReceived: string;
  surveyLanguages: SurveyLanguageType[];
};

type MetricsSurveyQuestionItemType = {
  questionID: number;
  blockID: number;
  type: string;
  text: string;
  code: string;
  orderNumber: number;
  rows: RowType[];
};

type NPSDataPointElementType = {
  name: 'valueOne' | 'valueTwo' | 'valueThree';
  title: string;
  placeholder: string;
  type: string;
};

export type {
  NpsType,
  CsatType,
  CesType,
  DatapointType,
  DataPointFormType,
  MetricsType,
  MetricsFormType,
  CustomMetricsType,
  CustomMetricsFormType,
  MetricsSurveyItemType,
  MetricsSurveyQuestionItemType,
  NPSDataPointElementType,
};
