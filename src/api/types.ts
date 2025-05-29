export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  JSON: { input: any; output: any };
  JSONObject: { input: any; output: any };
  StringOrNumberGql: { input: any; output: any };
  Timestamp: { input: any; output: any };
};

export enum ActionEnum {
  Add = 'ADD',
  Delete = 'DELETE',
  Update = 'UPDATE',
}

export enum ActionTypeEnum {
  Archive = 'ARCHIVE',
  Copy = 'COPY',
  Create = 'CREATE',
  Delete = 'DELETE',
  Merge = 'MERGE',
  Restore = 'RESTORE',
  Unmerge = 'UNMERGE',
  Update = 'UPDATE',
}

export type AddBoxElementInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  columnId: Scalars['Int']['input'];
  imageId?: InputMaybe<Scalars['Int']['input']>;
  personaId?: InputMaybe<Scalars['Int']['input']>;
  rowId: Scalars['Int']['input'];
  stepId: Scalars['Int']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
};

export type AddColumnStepInput = {
  columnId: Scalars['Int']['input'];
  index?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type AddCommentInput = {
  commentId?: InputMaybe<Scalars['Int']['input']>;
  itemId?: InputMaybe<Scalars['Int']['input']>;
  itemType: CommentAndNoteModelsEnum;
  rowId?: InputMaybe<Scalars['Int']['input']>;
  stepId?: InputMaybe<Scalars['Int']['input']>;
  text: Scalars['String']['input'];
};

export type AddLinkInput = {
  linkedMapId?: InputMaybe<Scalars['Int']['input']>;
  personaId?: InputMaybe<Scalars['Int']['input']>;
  rowId: Scalars['Int']['input'];
  stepId: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  type: LinkTypeEnum;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type AddOrUpdateColumnStepInput = {
  add?: InputMaybe<AddColumnStepInput>;
  update?: InputMaybe<UpdateColumnStepInput>;
};

export enum AiCardsEnum {
  Background = 'BACKGROUND',
  Challenges = 'CHALLENGES',
  Expectations = 'EXPECTATIONS',
  Frustrations = 'FRUSTRATIONS',
  Goals = 'GOALS',
  Motivations = 'MOTIVATIONS',
  NameWithTagLine = 'NAME_WITH_TAG_LINE',
  Needs = 'NEEDS',
  ProfilePicture = 'PROFILE_PICTURE',
}

export type AiJourneyModel = {
  attachment?: Maybe<Attachment>;
  attachmentId?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  orgAiJourneyModels: Array<OrgAiJourneyModel>;
  ownerId: Scalars['Int']['output'];
  prompt: Scalars['String']['output'];
  universal: Scalars['Boolean']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export type AiJourneyModelResponse = {
  attachmentUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  prompt: Scalars['String']['output'];
  selectedOrgIds: Array<Scalars['Int']['output']>;
  transcriptPlace: Scalars['Int']['output'];
  universal: Scalars['Boolean']['output'];
};

export type AttachImageInput = {
  attachmentId: Scalars['Int']['input'];
  personaId: Scalars['Int']['input'];
};

export type AttachTagInput = {
  cardId: Scalars['Int']['input'];
  cardType: MapCardTypeEnum;
  tagId: Scalars['Int']['input'];
};

export type Attachment = {
  category?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  croppedArea?: Maybe<Position>;
  croppedAreaId?: Maybe<Scalars['Int']['output']>;
  hasResizedVersions?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['Int']['output'];
  imgScaleType: ImgScaleTypeEnum;
  key: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  relatedId: Scalars['Int']['output'];
  touchpoints: Array<TouchPoint>;
  type: AttachmentsEnum;
  updatedAt: Scalars['Timestamp']['output'];
  url: Scalars['String']['output'];
};

export enum AttachmentsEnum {
  AiModel = 'AI_MODEL',
  MapRow = 'MAP_ROW',
  NounProjectIcon = 'NOUN_PROJECT_ICON',
  PersonaGallery = 'PERSONA_GALLERY',
  Screenshot = 'SCREENSHOT',
  TouchpointIcon = 'TOUCHPOINT_ICON',
  Whiteboard = 'WHITEBOARD',
}

export type Board = {
  createdAt: Scalars['Timestamp']['output'];
  defaultMapId?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  journeyMapCount: Scalars['Int']['output'];
  lastUpdatedBy: Scalars['String']['output'];
  maps: Array<Map>;
  name: Scalars['String']['output'];
  organizationId: Scalars['Int']['output'];
  owner: Member;
  ownerId: Scalars['Int']['output'];
  personasCount: Scalars['Int']['output'];
  pinnedOutcomeGroupCount: Scalars['Int']['output'];
  pinnedOutcomeGroups: Array<PinnedOutcomeGroup>;
  sortedMaps?: Maybe<Scalars['Int']['output']>;
  tags: Array<Tags>;
  updatedAt: Scalars['Timestamp']['output'];
  workspace: Workspace;
  workspaceId: Scalars['Int']['output'];
};

export type BoardResponse = {
  createdAt: Scalars['Timestamp']['output'];
  defaultMapId?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  journeyMapCount: Scalars['Int']['output'];
  maps: Array<Map>;
  name: Scalars['String']['output'];
  outcomeGroupWithOutcomeCounts: Array<OutcomeGroupWithOutcomeCounts>;
  personasCount: Scalars['Int']['output'];
  pinnedOutcomeGroupCount: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  workspaceId: Scalars['Int']['output'];
};

export type BoardStats = {
  journeysCount: Scalars['Int']['output'];
  outcomeStats: Array<OutcomeGroupWithOutcomeCounts>;
  personasCount: Scalars['Int']['output'];
};

export type Box = {
  boxTextElement?: Maybe<BoxElement>;
  columnId: Scalars['Int']['output'];
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  mapId: Scalars['Int']['output'];
  mergeCount: Scalars['Int']['output'];
  rowId: Scalars['Int']['output'];
  stepId?: Maybe<Scalars['Int']['output']>;
  type: MapRowTypeEnum;
  updatedAt: Scalars['Timestamp']['output'];
};

export type BoxElement = {
  attachment?: Maybe<Attachment>;
  attachmentId?: Maybe<Scalars['Int']['output']>;
  attachmentPosition?: Maybe<Position>;
  bgColor?: Maybe<Scalars['String']['output']>;
  boxId: Scalars['Int']['output'];
  color?: Maybe<Scalars['String']['output']>;
  columnId: Scalars['Int']['output'];
  commentsCount: Scalars['Int']['output'];
  createdAt: Scalars['Timestamp']['output'];
  deletedAt?: Maybe<Scalars['Timestamp']['output']>;
  digsiteUrl?: Maybe<Scalars['String']['output']>;
  flippedText?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  isDisabled: Scalars['Boolean']['output'];
  mapId: Scalars['Int']['output'];
  note?: Maybe<Note>;
  persona?: Maybe<Personas>;
  personaId?: Maybe<Scalars['Int']['output']>;
  rowId: Scalars['Int']['output'];
  stepId?: Maybe<Scalars['Int']['output']>;
  studyId?: Maybe<Scalars['Int']['output']>;
  studyName?: Maybe<Scalars['String']['output']>;
  tags: Array<Tags>;
  text?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
};

export type BoxElementResponseModel = {
  attachmentId?: Maybe<Scalars['Int']['output']>;
  bgColor?: Maybe<Scalars['String']['output']>;
  columnId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  previousBgColor?: Maybe<Scalars['String']['output']>;
  previousText?: Maybe<Scalars['String']['output']>;
  rowId: Scalars['Int']['output'];
  stepId: Scalars['Int']['output'];
  text?: Maybe<Scalars['String']['output']>;
};

export type BoxTextElementResponseModel = {
  action: ActionEnum;
  columnId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  previousText?: Maybe<Scalars['String']['output']>;
  rowId: Scalars['Int']['output'];
  stepId: Scalars['Int']['output'];
  text?: Maybe<Scalars['String']['output']>;
};

export type BoxWithElements = {
  average: Scalars['Float']['output'];
  boxElements: Array<BoxElement>;
  boxTextElement?: Maybe<BoxElement>;
  columnId: Scalars['Int']['output'];
  /** box id which can be null if box is not created, this can be happen when box does not has element */
  id?: Maybe<Scalars['Int']['output']>;
  links: Array<LinkResponse>;
  mapId: Scalars['Int']['output'];
  mergeCount: Scalars['Int']['output'];
  metrics: Array<MetricsResponse>;
  outcomes: Array<OutcomeResponse>;
  /** nullable is true is for createJourneyMapRow api response */
  step?: Maybe<ColumnStep>;
  stepId?: Maybe<Scalars['Int']['output']>;
  touchPoints: Array<TouchPoint>;
  type: MapRowTypeEnum;
};

export type CesPoint = {
  createdAt: Scalars['Timestamp']['output'];
  date: Scalars['Timestamp']['output'];
  difficult: Scalars['Int']['output'];
  easy: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  metricsId: Scalars['Int']['output'];
  neutral: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export type CesPointInput = {
  date: Scalars['Timestamp']['input'];
  difficult: Scalars['Int']['input'];
  easy: Scalars['Int']['input'];
  neutral: Scalars['Int']['input'];
};

export type CsatModel = {
  dissatisfied: Scalars['Int']['output'];
  neutral: Scalars['Int']['output'];
  satisfied: Scalars['Int']['output'];
};

export type CsatPoint = {
  createdAt: Scalars['Timestamp']['output'];
  date: Scalars['Timestamp']['output'];
  dissatisfied: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  metricsId: Scalars['Int']['output'];
  neutral: Scalars['Int']['output'];
  satisfied: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export type CsatPointInput = {
  date: Scalars['Timestamp']['input'];
  dissatisfied: Scalars['Int']['input'];
  neutral: Scalars['Int']['input'];
  satisfied: Scalars['Int']['input'];
};

export type ColumnStep = {
  bgColor?: Maybe<Scalars['String']['output']>;
  columnId: Scalars['Int']['output'];
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  isMerged: Scalars['Boolean']['output'];
  mapId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  userId: Scalars['Int']['output'];
};

export type Comment = {
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  itemId: Scalars['Int']['output'];
  itemType: CommentAndNoteModelsEnum;
  owner: Member;
  ownerId: Scalars['Int']['output'];
  parentId?: Maybe<Scalars['Int']['output']>;
  replies: Array<Comment>;
  text: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export enum CommentAndNoteModelsEnum {
  BoxElement = 'BOX_ELEMENT',
  Links = 'LINKS',
  Metrics = 'METRICS',
  Outcome = 'OUTCOME',
  Touchpoint = 'TOUCHPOINT',
}

export type CompareJourneyMapJsonInput = {
  frontJsonHash: Scalars['String']['input'];
  getJourneyMapInput: GetJourneyMapInput;
};

export type CompleteMultiPartInput = {
  Key: Scalars['String']['input'];
  UploadId: Scalars['String']['input'];
  category?: InputMaybe<Scalars['String']['input']>;
  detailedInput?: InputMaybe<DetailedInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  parts: Array<Scalars['JSONObject']['input']>;
  relatedId?: InputMaybe<Scalars['Int']['input']>;
  type: AttachmentsEnum;
};

export type ConnectPersonasToMapInput = {
  connectPersonaIds?: Array<Scalars['Int']['input']>;
  disconnectPersonaIds?: Array<Scalars['Int']['input']>;
  mapId: Scalars['Int']['input'];
};

export type CopyMapInput = {
  boardId: Scalars['Int']['input'];
  mapId: Scalars['Int']['input'];
};

export type CopyPersonaInput = {
  personaId: Scalars['Int']['input'];
};

export type CreateAiJourneyInput = {
  attachmentId?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  orgIds: Array<Scalars['Int']['input']>;
  prompt?: InputMaybe<Scalars['String']['input']>;
  transcriptPlace: Scalars['Int']['input'];
  universal: Scalars['Boolean']['input'];
};

export type CreateBoardInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  workspaceId: Scalars['Int']['input'];
};

export type CreateColumnInput = {
  headerColor?: InputMaybe<Scalars['String']['input']>;
  index?: InputMaybe<Scalars['Int']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  mapId: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
};

export type CreateColumnResponse = {
  bgColor: Scalars['String']['output'];
  columnSteps: Array<ColumnStep>;
  createdAt: Scalars['Timestamp']['output'];
  deletedAt?: Maybe<Scalars['Timestamp']['output']>;
  headerColor: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  isDisabled: Scalars['Boolean']['output'];
  isMerged: Scalars['Boolean']['output'];
  isNextColumnMerged: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['String']['output']>;
  mapId: Scalars['Int']['output'];
  refToNext?: Maybe<Scalars['Int']['output']>;
  size: Scalars['Int']['output'];
  stepId: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export type CreateCustomMetricsInput = {
  customMetrics: Array<CustomMetricsInput>;
};

export type CreateDataPointsInput = {
  cesPointsInput?: InputMaybe<Array<CesPointInput>>;
  csatPointsInput?: InputMaybe<Array<CsatPointInput>>;
  npsPointsInput?: InputMaybe<Array<NpsPointInput>>;
};

export type CreateDefaultDemographicInfoFieldsInput = {
  personaId: Scalars['Int']['input'];
};

export type CreateDemographicInfoInput = {
  height?: InputMaybe<Scalars['Int']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  personaId: Scalars['Int']['input'];
  position?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<DemographicInfoTypeEnum>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type CreateIconInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  url: Scalars['String']['input'];
};

export type CreateInterviewInput = {
  aiJourneyModelId: Scalars['Int']['input'];
  boardId: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  text: Scalars['String']['input'];
};

export type CreateItemsInput = {
  data?: InputMaybe<Array<DataInput>>;
  whiteboardId: Scalars['Int']['input'];
};

export type CreateJourneyMapInput = {
  boardId: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type CreateLayerInput = {
  columnIds: Array<Scalars['Int']['input']>;
  columnSelectedStepIds: Scalars['JSON']['input'];
  mapId: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  rowIds: Array<Scalars['Int']['input']>;
  tagIds: Array<Scalars['Int']['input']>;
};

export type CreateMetricsInput = {
  columnId: Scalars['Int']['input'];
  customData?: InputMaybe<CustomDataInput>;
  dateRange?: InputMaybe<MetricsDateRangeEnum>;
  description?: InputMaybe<Scalars['String']['input']>;
  descriptionEnabled?: Scalars['Boolean']['input'];
  endDate?: InputMaybe<Scalars['Timestamp']['input']>;
  goal?: InputMaybe<Scalars['Int']['input']>;
  mapId: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  personaId?: InputMaybe<Scalars['Int']['input']>;
  questionId?: InputMaybe<Scalars['Int']['input']>;
  rowId: Scalars['Int']['input'];
  source: MetricsSourceEnum;
  startDate?: InputMaybe<Scalars['Timestamp']['input']>;
  stepId: Scalars['Int']['input'];
  surveyId?: InputMaybe<Scalars['Int']['input']>;
  type: MetricsTypeEnum;
  value?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateMultipartInput = {
  attachmentType: AttachmentsEnum;
  contentType?: InputMaybe<Scalars['String']['input']>;
  fileType: Scalars['String']['input'];
  id: Scalars['Int']['input'];
};

export type CreateOrUpdateNoteInput = {
  itemId?: InputMaybe<Scalars['Int']['input']>;
  itemType: CommentAndNoteModelsEnum;
  rowId?: InputMaybe<Scalars['Int']['input']>;
  stepId?: InputMaybe<Scalars['Int']['input']>;
  text: Scalars['String']['input'];
};

export type CreateOrUpdateOutcomeGroupInput = {
  connectBoardIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  disconnectBoardIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  icon: Scalars['String']['input'];
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pluralName?: InputMaybe<Scalars['String']['input']>;
};

export type CreateOrUpdateWorkspaceOutcomeInput = {
  createWorkspaceOutcomeInput?: InputMaybe<CreateWorkspaceOutcomeInput>;
  updateWorkspaceOutcomeInput?: InputMaybe<UpdateWorkspaceOutcomeInput>;
};

export type CreateOutcomeInput = {
  description: Scalars['String']['input'];
  outcomeGroupId: Scalars['Int']['input'];
  personaId?: InputMaybe<Scalars['Int']['input']>;
  positionInput?: InputMaybe<CreateOutcomePositionInput>;
  status?: InputMaybe<OutcomeStatusEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
  workspaceId: Scalars['Int']['input'];
};

export type CreateOutcomePositionInput = {
  columnId: Scalars['Int']['input'];
  mapId: Scalars['Int']['input'];
  stepId: Scalars['Int']['input'];
};

export type CreateParentMapInput = {
  childId: Scalars['Int']['input'];
  parentId: Scalars['Int']['input'];
};

export type CreatePersonaByAiInput = {
  needDemographicData: Scalars['Boolean']['input'];
  personaGroupId: Scalars['Int']['input'];
  personaInfo: Scalars['String']['input'];
  templateCards?: InputMaybe<Array<AiCardsEnum>>;
};

export type CreatePersonaGroupInput = {
  name: Scalars['String']['input'];
  workspaceId: Scalars['Int']['input'];
};

export type CreatePersonaInput = {
  personaGroupId: Scalars['Int']['input'];
  workspaceId: Scalars['Int']['input'];
};

export type CreatePersonaSectionInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  h?: InputMaybe<Scalars['Int']['input']>;
  i?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
  personaId: Scalars['Int']['input'];
  w?: InputMaybe<Scalars['Int']['input']>;
  x?: InputMaybe<Scalars['Int']['input']>;
  y?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateRowInput = {
  index?: InputMaybe<Scalars['Int']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  mapId: Scalars['Int']['input'];
  outcomeGroupId?: InputMaybe<Scalars['Int']['input']>;
  rowFunction?: InputMaybe<MapRowTypeEnum>;
  size?: Scalars['Int']['input'];
};

export type CreateRowResponseModel = {
  boxesWithElements: Array<BoxWithElements>;
  row: MapRow;
  rowWithPersonas: Array<RowWithPersonas>;
};

export type CreateTagInput = {
  boardId: Scalars['Int']['input'];
  color: Scalars['String']['input'];
  mapId: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type CreateTouchPointInput = {
  columnId: Scalars['Int']['input'];
  mapId: Scalars['Int']['input'];
  personaId?: InputMaybe<Scalars['Int']['input']>;
  rowId: Scalars['Int']['input'];
  stepId: Scalars['Int']['input'];
  touchPoints: Array<TouchPointInputs>;
};

export type CreateTouchpointResponseModel = {
  createdTouchpoints: Array<TouchPoint>;
  deletedAttachments: Array<Scalars['Int']['output']>;
};

export type CreateUpdateOutcomeInput = {
  createOutcomeInput?: InputMaybe<CreateOutcomeInput>;
  updateOutcomeInput?: InputMaybe<UpdateOutcomeInput>;
};

export type CreateUpdateStepModel = {
  /** step that created or changed the position */
  columnStep: ColumnStep;
  /** step must exist when a columns position changes, and the column does not have any step; in such cases, one must be created */
  createdColumnStep?: Maybe<ColumnStep>;
};

export type CreateUserInput = {
  emailAddress: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type CreateWhiteboardInput = {
  canvasId?: InputMaybe<Scalars['Int']['input']>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  folderId: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  type?: WhiteboardTypeEnum;
};

export type CreateWorkspaceOutcomeInput = {
  description: Scalars['String']['input'];
  outcomeGroupId: Scalars['Int']['input'];
  status?: InputMaybe<OutcomeStatusEnum>;
  title: Scalars['String']['input'];
  workspaceId: Scalars['Int']['input'];
};

export type CustomDataInput = {
  classType: CustomMetricsClassEnum;
  scoring?: InputMaybe<CustomMetricsScoringEnum>;
  values?: InputMaybe<Array<KeyValueInput>>;
};

export type CustomMap = {
  id: Scalars['Int']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type CustomMetrics = {
  createdAt: Scalars['Timestamp']['output'];
  date: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  metricsId: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  value: Scalars['Int']['output'];
};

export enum CustomMetricsClassEnum {
  Average = 'AVERAGE',
  Goal = 'GOAL',
  Total = 'TOTAL',
}

export type CustomMetricsInput = {
  date: Scalars['Timestamp']['input'];
  id?: InputMaybe<Scalars['Int']['input']>;
  value: Scalars['Int']['input'];
};

export enum CustomMetricsScoringEnum {
  Decrease = 'DECREASE',
  Increase = 'INCREASE',
}

export type DataInput = {
  boardItem?: InputMaybe<Scalars['JSONObject']['input']>;
  textData?: InputMaybe<Scalars['JSONObject']['input']>;
};

export enum DatabaseModelEnum {
  Attachment = 'ATTACHMENT',
  Board = 'BOARD',
  Box = 'BOX',
  BoxElement = 'BOX_ELEMENT',
  CesPoint = 'CES_POINT',
  Comment = 'COMMENT',
  CsatPoint = 'CSAT_POINT',
  DemographicInfo = 'DEMOGRAPHIC_INFO',
  JourneyMap = 'JOURNEY_MAP',
  Layer = 'LAYER',
  Map = 'MAP',
  MapColumn = 'MAP_COLUMN',
  MapRow = 'MAP_ROW',
  Metrics = 'METRICS',
  Note = 'NOTE',
  NpsPoint = 'NPS_POINT',
  Outcome = 'OUTCOME',
  OutcomeGroup = 'OUTCOME_GROUP',
  Persona = 'PERSONA',
  PersonaSection = 'PERSONA_SECTION',
  Step = 'STEP',
  Touchpoint = 'TOUCHPOINT',
  Whiteboard = 'WHITEBOARD',
  Workspace = 'WORKSPACE',
}

export type DeleteItemsInput = {
  data: Array<Scalars['JSONObject']['input']>;
  whiteboardId: Scalars['Int']['input'];
};

export type DeleteTouchPointAttachmentTypeInput = {
  id: Scalars['Int']['input'];
  url: Scalars['String']['input'];
};

export type DemographicInfo = {
  attachment?: Maybe<Attachment>;
  attachmentId?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  croppedArea?: Maybe<Position>;
  croppedAreaId?: Maybe<Scalars['Int']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  isDefault: Scalars['Boolean']['output'];
  isHidden: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  personaId: Scalars['Int']['output'];
  position: Scalars['Int']['output'];
  type: DemographicInfoTypeEnum;
  updatedAt: Scalars['Timestamp']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export enum DemographicInfoTypeEnum {
  Content = 'CONTENT',
  Image = 'IMAGE',
  List = 'LIST',
  Number = 'NUMBER',
  Text = 'TEXT',
}

export type DetailedInput = {
  fileType: WhiteboardItemTypeEnum;
  height: Scalars['Int']['input'];
  uuid: Scalars['String']['input'];
  width: Scalars['Int']['input'];
  x: Scalars['Int']['input'];
  y: Scalars['Int']['input'];
};

export type DisablePersonaForRowInput = {
  disable: Scalars['Boolean']['input'];
  id: Scalars['Int']['input'];
};

export type DisablePersonaInput = {
  disableAverage?: InputMaybe<Scalars['Boolean']['input']>;
  disablePersonaForRowInput?: InputMaybe<DisablePersonaForRowInput>;
  rowId: Scalars['Int']['input'];
};

export type DuplicateWhiteboardInput = {
  whiteboardId: Scalars['Int']['input'];
};

export type EditLinkInput = {
  id: Scalars['Int']['input'];
  linkedMapId?: InputMaybe<Scalars['Int']['input']>;
  positionInput?: InputMaybe<LinkPositionInput>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<LinkTypeEnum>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type ErrorLog = {
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  path: Scalars['String']['output'];
  status: Scalars['Int']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export type FilterInput = {
  ownership: OwnershipTypeEnum;
};

export type Folder = {
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  ownerId: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  whiteboardCount: Scalars['Int']['output'];
  workspaceId: Scalars['Int']['output'];
};

export type FolderInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  workspaceId: Scalars['Int']['input'];
};

export type GetAiJourneyModelsInput = {
  isAdmin: Scalars['Boolean']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export type GetAiJourneyModelsResponse = {
  aiJourneyModels: Array<AiJourneyModelResponse>;
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export type GetAttachedTagsInput = {
  cardId: Scalars['Int']['input'];
  cardType: MapCardTypeEnum;
};

export type GetAttachmentTouchPointMapsInput = {
  attachmentId: Scalars['Int']['input'];
};

export type GetBoardInterviewsModel = {
  count?: Maybe<Scalars['Int']['output']>;
  interviews: Array<Interview>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export type GetBoardTagsInput = {
  boardId: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type GetBoardsForItemInput = {
  uuid: Scalars['String']['input'];
  workspaceId: Scalars['Int']['input'];
};

export type GetBoardsForItemModel = {
  boards: Array<ItemBoardForGetBoardsForItemModel>;
};

export type GetBoardsFourOutcomeGroupInput = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  outcomeGroupId?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  workspaceId: Scalars['Int']['input'];
};

export type GetBoardsOutcomeGroupModel = {
  id: Scalars['Int']['output'];
  isPinned: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type GetBoardsTagsModel = {
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  tags: Array<GetCardAttachedTagsModel>;
};

export type GetCardAttachedTagsModel = {
  color: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type GetCompleteMultipartResponse = {
  id: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type GetDataPointsFilterInput = {
  dateFrom: Scalars['Timestamp']['input'];
  dateTo: Scalars['Timestamp']['input'];
};

export type GetDataPointsInput = {
  filterInput?: InputMaybe<GetDataPointsFilterInput>;
  limit: Scalars['Int']['input'];
  metricsId: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  type: MetricsTypeEnum;
};

export type GetDataPointsResponse = {
  count?: Maybe<Scalars['Int']['output']>;
  dataPoints: Array<MetricsDataPointUnion>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export type GetDemographicInfosModel = {
  demographicInfoFields: Array<GetPersonaDemographicInfoModel>;
  personaFieldSections: Array<GetPersonaDemographicInfoModel>;
};

export type GetErrorLogModel = {
  count?: Maybe<Scalars['Int']['output']>;
  errorLogs: Array<ErrorLog>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export type GetFoldersInput = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  workspaceId: Scalars['Int']['input'];
};

export type GetFoldersModel = {
  count?: Maybe<Scalars['Int']['output']>;
  folders: Array<Folder>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export type GetHistoryLogInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  type: LoggerTypeEnum;
};

export type GetHistoryLogModel = {
  count?: Maybe<Scalars['Int']['output']>;
  historyLogs: Array<HistoryLog>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export type GetInterviewsInput = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  workspaceId: Scalars['Int']['input'];
};

export type GetItemCommentsInput = {
  itemId?: InputMaybe<Scalars['Int']['input']>;
  itemType: CommentAndNoteModelsEnum;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  rowId?: InputMaybe<Scalars['Int']['input']>;
  stepId?: InputMaybe<Scalars['Int']['input']>;
};

export type GetItemCommentsModel = {
  comments: Array<Comment>;
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export type GetItemNoteInput = {
  itemId?: InputMaybe<Scalars['Int']['input']>;
  itemType: CommentAndNoteModelsEnum;
  rowId?: InputMaybe<Scalars['Int']['input']>;
  stepId?: InputMaybe<Scalars['Int']['input']>;
};

export type GetJourneyMapColumnStepsInput = {
  columnIds: Array<Scalars['Int']['input']>;
  mapId: Scalars['Int']['input'];
};

export type GetJourneyMapColumnStepsResponse = {
  stepsByColumnId: Scalars['JSON']['output'];
};

export type GetJourneyMapDebugLogsModel = {
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  mapDebugLogs: Array<MapDebugLogs>;
  offset: Scalars['Int']['output'];
};

export type GetJourneyMapInput = {
  columnLimit: Scalars['Int']['input'];
  columnOffset: Scalars['Int']['input'];
  layerId?: InputMaybe<Scalars['Int']['input']>;
  mapId: Scalars['Int']['input'];
  overView?: InputMaybe<Scalars['Boolean']['input']>;
  personaIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  rowLimit: Scalars['Int']['input'];
  rowOffset: Scalars['Int']['input'];
};

export type GetJourneyMapResponse = {
  columnCount: Scalars['Int']['output'];
  columns: Array<MapColumn>;
  map: Map;
  rowCount: Scalars['Int']['output'];
  rows: Array<JourneyMapRow>;
};

export type GetJourneyMapRowsAndColumnResponse = {
  columnCount: Scalars['Int']['output'];
  columns: Array<MergedColumnResponse>;
  rowCount: Scalars['Int']['output'];
  rows: Array<IdLabelResponse>;
};

export type GetJourneyMapRowsAndColumnsInput = {
  mapId: Scalars['Int']['input'];
};

export type GetLayersInput = {
  mapId: Scalars['Int']['input'];
};

export type GetLayersModel = {
  layers: Array<LayerResponseModel>;
};

export type GetLinkMapsModel = {
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  maps: Array<LinkMapResponse>;
  offset: Scalars['Int']['output'];
};

export type GetMapByVersionIdInput = {
  versionId: Scalars['Int']['input'];
};

export type GetMapByVersionIdModel = {
  columnCount: Scalars['Int']['output'];
  columns: Array<MapColumn>;
  personas: Array<Personas>;
  rowCount: Scalars['Int']['output'];
  rows: Array<JourneyMapVersionRow>;
  title: Scalars['String']['output'];
};

export type GetMapColumnsOutcomeModel = {
  columns: Array<MapColumnForOutcome>;
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export type GetMapDebugLogsInput = {
  limit: Scalars['Int']['input'];
  mapId: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export type GetMapDetailsModel = {
  isChildMap: Scalars['Boolean']['output'];
  isParentMap: Scalars['Boolean']['output'];
  parentMap?: Maybe<CustomMap>;
};

export type GetMapLogsModel = {
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  mapLogs: Array<MapLog>;
  offset: Scalars['Int']['output'];
};

export type GetMapPersonasInput = {
  limit: Scalars['Int']['input'];
  mapId: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export type GetMapPersonasModel = {
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  personas: Array<PersonaForOutcomeCreation>;
};

export type GetMapRowColumnsForOutcomeInput = {
  limit: Scalars['Int']['input'];
  mapId: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  outcomeId?: InputMaybe<Scalars['Int']['input']>;
};

export type GetMapVersionsInput = {
  limit: Scalars['Int']['input'];
  mapId: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export type GetMapVersionsModel = {
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  mapVersions: Array<MapVersion>;
  offset: Scalars['Int']['output'];
};

export type GetMapsInput = {
  boardId?: InputMaybe<Scalars['Int']['input']>;
  endDate?: InputMaybe<Scalars['Timestamp']['input']>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  order?: InputMaybe<OrderInput>;
  personaIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  query?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type GetMapsModel = {
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  maps: Array<Map>;
  offset: Scalars['Int']['output'];
};

export type GetMultipartObject = {
  Bucket: Scalars['String']['output'];
  Key: Scalars['String']['output'];
  ServerSideEncryption: Scalars['String']['output'];
  UploadId: Scalars['String']['output'];
};

export type GetMyBoardsInput = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  workspaceId: Scalars['Int']['input'];
};

export type GetOrgsInput = {
  search?: InputMaybe<Scalars['String']['input']>;
};

export type GetOutcomeBoardsModel = {
  boards: Array<GetBoardsOutcomeGroupModel>;
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export type GetOutcomeGroupInput = {
  outcomeGroupId: Scalars['Int']['input'];
};

export type GetOutcomeGroupModel = {
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  outcomeGroups: Array<OutcomeGroup>;
};

export type GetOutcomeGroupsInput = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export type GetOutcomesInput = {
  icon?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
  list?: InputMaybe<OutcomeListEnum>;
  mapId?: InputMaybe<Scalars['Int']['input']>;
  offset: Scalars['Int']['input'];
  orderBy: OrderByEnum;
  sortBy: SortByEnum;
  workspaceId?: InputMaybe<Scalars['Int']['input']>;
};

export type GetParentMapByBoardIdInput = {
  boardId: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  order?: InputMaybe<OrderMapInput>;
};

export type GetParentMapsByBoardIdModel = {
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  maps: Array<Map>;
  offset: Scalars['Int']['output'];
};

export type GetPerformanceLogModel = {
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  performanceLogs: Array<PerformanceLog>;
};

export type GetPersonaByIdInput = {
  personaId: Scalars['Int']['input'];
};

export type GetPersonaDemographicInfoModel = {
  attachment?: Maybe<Attachment>;
  attachmentId?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  croppedArea?: Maybe<Position>;
  croppedAreaId?: Maybe<Scalars['Int']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  isDefault: Scalars['Boolean']['output'];
  isHidden: Scalars['Boolean']['output'];
  isPinned?: Maybe<Scalars['Boolean']['output']>;
  key: Scalars['String']['output'];
  personaId: Scalars['Int']['output'];
  position: Scalars['Int']['output'];
  type: DemographicInfoTypeEnum;
  updatedAt: Scalars['Timestamp']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type GetPersonaDemographicInfosInput = {
  mapId?: InputMaybe<Scalars['Int']['input']>;
  personaId: Scalars['Int']['input'];
};

export type GetPersonaGalleryInput = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};

export type GetPersonaGalleryModel = {
  attachments: Array<Attachment>;
  count: Scalars['Int']['output'];
};

export type GetPersonaGroupsInput = {
  workspaceId: Scalars['Int']['input'];
};

export type GetPersonaGroupsModel = {
  personaGroups: Array<PersonaGroupModel>;
};

export type GetPersonaGroupsWithPersonasInput = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  workspaceId: Scalars['Int']['input'];
};

export type GetPersonaGroupsWithPersonasModel = {
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  personaGroups: Array<PersonaGroup>;
};

export type GetPersonaSectionsInput = {
  mapId?: InputMaybe<Scalars['Int']['input']>;
  personaId: Scalars['Int']['input'];
};

export type GetPersonaSectionsModel = {
  color: Scalars['String']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  h: Scalars['Int']['output'];
  i: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isHidden: Scalars['Boolean']['output'];
  isPinned?: Maybe<Scalars['Boolean']['output']>;
  key: Scalars['String']['output'];
  personaId: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  w: Scalars['Int']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
};

export type GetPersonasInput = {
  limit: Scalars['Int']['input'];
  mapId?: InputMaybe<Scalars['Int']['input']>;
  offset: Scalars['Int']['input'];
  personaGroupId: Scalars['Int']['input'];
  workspaceId: Scalars['Int']['input'];
};

export type GetPersonasModel = {
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  personaGroup?: Maybe<PartialPersonaGroup>;
  personas: Array<Personas>;
  workspace?: Maybe<PartialWorkspace>;
};

export type GetPinnedPersonaItemsModel = {
  demographicInfos: Array<DemographicInfo>;
  pinnedSections: Array<PinnedSection>;
};

export type GetPreSignedUrlInput = {
  name: Scalars['String']['input'];
  parts: Scalars['Int']['input'];
  uploadId: Scalars['String']['input'];
};

export type GetPresignedUrlObject = {
  key: Scalars['String']['output'];
};

export type GetQuestionProUsersModel = {
  count: Scalars['Int']['output'];
  users: Array<Member>;
};

export type GetSelectedMapsForItemInput = {
  uuid: Scalars['String']['input'];
};

export type GetSelectedMapsForItemModel = {
  maps: Array<ItemMapForGetSelectedMapsForItemModel>;
};

export type GetSuiteOrgsInput = {
  search?: InputMaybe<Scalars['String']['input']>;
};

export type GetTouchPointIconsModel = {
  attachments: Array<Attachment>;
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export type GetTouchpointIconsInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};

export type GetUserBoardsModel = {
  boards: Array<BoardResponse>;
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  workspace: Workspace;
};

export type GetUserWorkspacesModel = {
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  workspaces: Array<GetWorkspaceWithStat>;
};

export type GetUsersModel = {
  orgName: Scalars['String']['output'];
  users: Array<SuiteUserModel>;
};

export type GetWhiteboardDataItemsInput = {
  whiteboardId: Scalars['Int']['input'];
};

export type GetWhiteboardDataItemsModel = {
  BOARD_DATA_ITEMS: Array<WhiteboardDataItem>;
  BOTTOM_ELLIPSE: Array<WhiteboardDataItem>;
  BOTTOM_LEFT_CIRCLE: Array<WhiteboardDataItem>;
  BOTTOM_LEFT_ELLIPSE: Array<WhiteboardDataItem>;
  BOTTOM_RIGHT_CIRCLE: Array<WhiteboardDataItem>;
  BOTTOM_RIGHT_ELLIPSE: Array<WhiteboardDataItem>;
  CIRCLE: Array<WhiteboardDataItem>;
  DB: Array<WhiteboardDataItem>;
  DOCUMENT: Array<WhiteboardDataItem>;
  DRAW: Array<WhiteboardDataItem>;
  ELLIPSE: Array<WhiteboardDataItem>;
  FILE: Array<WhiteboardDataItem>;
  GROUP: Array<WhiteboardDataItem>;
  ICON: Array<WhiteboardDataItem>;
  IMAGE: Array<WhiteboardDataItem>;
  LINE: Array<WhiteboardDataItem>;
  LINK: Array<WhiteboardDataItem>;
  NOTE: Array<WhiteboardDataItem>;
  POINTER: Array<WhiteboardDataItem>;
  RECT: Array<WhiteboardDataItem>;
  ROUND_RECT: Array<WhiteboardDataItem>;
  SMART: Array<WhiteboardDataItem>;
  STAR: Array<WhiteboardDataItem>;
  TEXT: Array<WhiteboardDataItem>;
  TOP_ELLIPSE: Array<WhiteboardDataItem>;
  TOP_LEFT_CIRCLE: Array<WhiteboardDataItem>;
  TOP_LEFT_ELLIPSE: Array<WhiteboardDataItem>;
  TOP_RIGHT_CIRCLE: Array<WhiteboardDataItem>;
  TOP_RIGHT_ELLIPSE: Array<WhiteboardDataItem>;
  TRIANGLE: Array<WhiteboardDataItem>;
  VIDEO: Array<WhiteboardDataItem>;
};

export type GetWhiteboardModel = {
  canvasId?: Maybe<Scalars['Int']['output']>;
  color: Scalars['String']['output'];
  createdAt: Scalars['Timestamp']['output'];
  description: Scalars['String']['output'];
  folderId: Scalars['Int']['output'];
  helpLink?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  isLocked: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  ownerId: Scalars['Int']['output'];
  sharingPolicy: SharingPolicyEnum;
  type: WhiteboardTypeEnum;
  updatedAt: Scalars['Timestamp']['output'];
  whiteboardUserType: WhiteboardUserTypeEnum;
  workspaceId: Scalars['Int']['output'];
};

export type GetWhiteboardsInput = {
  filterInput?: InputMaybe<FilterInput>;
  folderId: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};

export type GetWhiteboardsModel = {
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  whiteboards: Array<Whiteboard>;
};

export type GetWorkspaceBoardsInput = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  workspaceId: Scalars['Int']['input'];
};

export type GetWorkspaceBoardsModel = {
  boards: Array<WorkspaceBoardResponse>;
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export type GetWorkspaceMapsInput = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  outcomeId?: InputMaybe<Scalars['Int']['input']>;
  workspaceId: Scalars['Int']['input'];
};

export type GetWorkspaceMapsModel = {
  count?: Maybe<Scalars['Int']['output']>;
  limit: Scalars['Int']['output'];
  maps: Array<MapForOutcome>;
  offset: Scalars['Int']['output'];
};

export type GetWorkspaceWithStat = {
  boards: Array<Board>;
  boardsCount?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  defaultFolder: Folder;
  defaultFolderId: Scalars['Int']['output'];
  deletedAt?: Maybe<Scalars['Timestamp']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  feedBackCreationDate?: Maybe<Scalars['Timestamp']['output']>;
  feedbackId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  journeyMapCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['Int']['output'];
  ownerId: Scalars['Int']['output'];
  personaGroup: Array<PersonaGroup>;
  personasCount: Scalars['Int']['output'];
  sortedBoards?: Maybe<Array<Scalars['Int']['output']>>;
  updatedAt: Scalars['Timestamp']['output'];
  userAction?: Maybe<UserActionEnum>;
};

export type GetWorkspacesInput = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  organizationId: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};

export type HistoryLog = {
  action: ActionTypeEnum;
  createdAt: Scalars['Timestamp']['output'];
  from?: Maybe<Scalars['JSONObject']['output']>;
  id: Scalars['Int']['output'];
  itemId?: Maybe<Scalars['Int']['output']>;
  logType: LoggerTypeEnum;
  referenceId: Scalars['Int']['output'];
  to?: Maybe<Scalars['JSONObject']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
  user: Scalars['JSONObject']['output'];
  userId: Scalars['Int']['output'];
};

export type IdLabelResponse = {
  id: Scalars['Int']['output'];
  label: Scalars['String']['output'];
};

export type IdsInput = {
  add?: InputMaybe<Array<Scalars['Int']['input']>>;
  remove?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum ImgScaleTypeEnum {
  Crop = 'CROP',
  Fill = 'FILL',
  Fit = 'FIT',
}

export type Interview = {
  aiJourneyModelId?: Maybe<Scalars['Int']['output']>;
  boardId: Scalars['Int']['output'];
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  interview: Scalars['JSON']['output'];
  journeyType: Scalars['String']['output'];
  mapId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  ownerId: Scalars['Int']['output'];
  text: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  workspaceId: Scalars['Int']['output'];
};

export type ItemBoardForGetBoardsForItemModel = {
  id: Scalars['Int']['output'];
  maps: Array<ItemMapForGetBoardsForItemModel>;
  name: Scalars['String']['output'];
};

export type ItemMapForGetBoardsForItemModel = {
  id: Scalars['Int']['output'];
  selected: Scalars['Boolean']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ItemMapForGetSelectedMapsForItemModel = {
  boardId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type JourneyMap = {
  boardId: Scalars['Int']['output'];
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  lastUpdatedBy: Scalars['Int']['output'];
  mapId: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  userId: Scalars['Int']['output'];
};

export type JourneyMapRow = {
  boxes?: Maybe<Array<BoxWithElements>>;
  id: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  isCollapsed: Scalars['Boolean']['output'];
  isLocked: Scalars['Boolean']['output'];
  isPersonaAverageDisabled: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['String']['output']>;
  outcomeGroup?: Maybe<OutcomeGroupResponse>;
  rowFunction?: Maybe<MapRowTypeEnum>;
  rowWithPersonas: Array<RowWithPersonas>;
  size: Scalars['Int']['output'];
};

export type JourneyMapVersionRow = {
  boxes?: Maybe<Array<MetricsVersion>>;
  id: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  isCollapsed: Scalars['Boolean']['output'];
  isLocked: Scalars['Boolean']['output'];
  isPersonaAverageDisabled: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['String']['output']>;
  outcomeGroup?: Maybe<OutcomeGroupResponse>;
  rowFunction?: Maybe<MapRowTypeEnum>;
  rowWithPersonas: Array<RowWithPersonas>;
  size: Scalars['Int']['output'];
};

export type KeyValue = {
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  isEditable: Scalars['Boolean']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  userId?: Maybe<Scalars['Int']['output']>;
  uuid?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

export type KeyValueInput = {
  label: Scalars['String']['input'];
  uuid: Scalars['String']['input'];
  value?: InputMaybe<Scalars['Int']['input']>;
};

export enum LanguagesEnum {
  En = 'en',
  Es = 'es',
  Pt = 'pt',
}

export type Layer = {
  columnIds?: Maybe<Array<Scalars['Int']['output']>>;
  columnSelectedStepIds: Scalars['JSONObject']['output'];
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  mapId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  rowIds?: Maybe<Array<Scalars['Int']['output']>>;
  tagIds?: Maybe<Array<Scalars['Int']['output']>>;
  updatedAt: Scalars['Timestamp']['output'];
  userId: Scalars['Int']['output'];
};

export type LayerResponseModel = {
  columnIds?: Maybe<Array<Scalars['Int']['output']>>;
  columnSelectedStepIds: Scalars['JSONObject']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  rowIds?: Maybe<Array<Scalars['Int']['output']>>;
  tagIds?: Maybe<Array<Scalars['Int']['output']>>;
};

export type LinkMapResponse = {
  mapId: Scalars['Int']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type LinkPositionInput = {
  columnId: Scalars['Int']['input'];
  index: Scalars['Int']['input'];
  rowId: Scalars['Int']['input'];
  stepId: Scalars['Int']['input'];
};

export type LinkResponse = {
  bgColor?: Maybe<Scalars['String']['output']>;
  commentsCount: Scalars['Int']['output'];
  flippedText?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  linkedJourneyMapId?: Maybe<Scalars['Int']['output']>;
  linkedMapId?: Maybe<Scalars['Int']['output']>;
  mapPersonaImages?: Maybe<Array<PersonaUrlObject>>;
  note?: Maybe<Note>;
  personaId?: Maybe<Scalars['Int']['output']>;
  personaImage?: Maybe<PersonaUrlObject>;
  rowId: Scalars['Int']['output'];
  tags: Array<Tags>;
  title?: Maybe<Scalars['String']['output']>;
  type: LinkTypeEnum;
  url?: Maybe<Scalars['String']['output']>;
};

export enum LinkTypeEnum {
  External = 'EXTERNAL',
  Journey = 'JOURNEY',
}

export enum LoggerTypeEnum {
  Board = 'BOARD',
  BoxElement = 'BOX_ELEMENT',
  Color = 'COLOR',
  ColumnStep = 'COLUMN_STEP',
  Comment = 'COMMENT',
  FLiPpText = 'FLiPP_TEXT',
  Folder = 'FOLDER',
  Link = 'LINK',
  Map = 'MAP',
  MapColumn = 'MAP_COLUMN',
  MapRow = 'MAP_ROW',
  Media = 'MEDIA',
  Metrics = 'METRICS',
  Note = 'NOTE',
  Outcome = 'OUTCOME',
  Persona = 'PERSONA',
  Sentiment = 'SENTIMENT',
  Shuffle = 'SHUFFLE',
  Space = 'SPACE',
  Tag = 'TAG',
  Touchpoint = 'TOUCHPOINT',
  Whiteboard = 'WHITEBOARD',
  Workspace = 'WORKSPACE',
}

export type Map = {
  boardId: Scalars['Int']['output'];
  childMaps: Array<ParentMap>;
  columnCount: Scalars['Int']['output'];
  columns: Array<MapColumn>;
  createdAt: Scalars['Timestamp']['output'];
  detail: MapTypeUnion;
  id: Scalars['Int']['output'];
  isTitleDisabled: Scalars['Boolean']['output'];
  lastUpdatedBy: Scalars['String']['output'];
  owner: Member;
  ownerId: Scalars['Int']['output'];
  parentMaps: Array<ParentMap>;
  personaCount: Scalars['Int']['output'];
  rowCount: Scalars['Int']['output'];
  rows: Array<MapRow>;
  selectedPersonas: Array<Personas>;
  title?: Maybe<Scalars['String']['output']>;
  type: MapTypeEnum;
  updatedAt: Scalars['Timestamp']['output'];
  whiteboardDataItemMaps: Array<WhiteboardDataItemMap>;
};

export enum MapCardTypeEnum {
  BoxElement = 'BOX_ELEMENT',
  Link = 'LINK',
  Metrics = 'METRICS',
  Outcome = 'OUTCOME',
  Touchpoint = 'TOUCHPOINT',
}

export type MapColumn = {
  bgColor: Scalars['String']['output'];
  columnSteps: Array<ColumnStep>;
  createdAt: Scalars['Timestamp']['output'];
  deletedAt?: Maybe<Scalars['Timestamp']['output']>;
  headerColor: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  isDisabled: Scalars['Boolean']['output'];
  isMerged: Scalars['Boolean']['output'];
  isNextColumnMerged: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['String']['output']>;
  mapId: Scalars['Int']['output'];
  refToNext?: Maybe<Scalars['Int']['output']>;
  size: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export type MapColumnForOutcome = {
  id: Scalars['Int']['output'];
  label?: Maybe<Scalars['String']['output']>;
};

export type MapDebugLogs = {
  backJsonHash: Scalars['String']['output'];
  createdAt: Scalars['Timestamp']['output'];
  frontJsonHash: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  mapId: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  userId: Scalars['Int']['output'];
};

export type MapForOutcome = {
  id: Scalars['Int']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type MapLog = {
  action: ActionTypeEnum;
  createdAt: Scalars['Timestamp']['output'];
  from?: Maybe<Scalars['JSONObject']['output']>;
  id: Scalars['Int']['output'];
  mapId: Scalars['Int']['output'];
  member: Member;
  model: LoggerTypeEnum;
  referenceId: Scalars['Int']['output'];
  subAction?: Maybe<SubActionTypeEnum>;
  to?: Maybe<Scalars['JSONObject']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
  userId: Member;
};

export type MapRow = {
  attachments: Array<Attachment>;
  boxes: Array<Box>;
  createdAt: Scalars['Timestamp']['output'];
  deletedAt?: Maybe<Scalars['Timestamp']['output']>;
  id: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  isCollapsed: Scalars['Boolean']['output'];
  isLocked: Scalars['Boolean']['output'];
  isPersonaAverageDisabled: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['String']['output']>;
  mapId: Scalars['Int']['output'];
  outcomeGroup?: Maybe<OutcomeGroup>;
  outcomeGroupId?: Maybe<Scalars['Int']['output']>;
  refToNext?: Maybe<MapRow>;
  rowFunction?: Maybe<MapRowTypeEnum>;
  size: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export enum MapRowTypeEnum {
  Cons = 'CONS',
  Divider = 'DIVIDER',
  Image = 'IMAGE',
  Insights = 'INSIGHTS',
  Interactions = 'INTERACTIONS',
  Links = 'LINKS',
  ListItem = 'LIST_ITEM',
  Media = 'MEDIA',
  Metrics = 'METRICS',
  Outcomes = 'OUTCOMES',
  Pros = 'PROS',
  Sentiment = 'SENTIMENT',
  Steps = 'STEPS',
  Tags = 'TAGS',
  Text = 'TEXT',
  Touchpoints = 'TOUCHPOINTS',
  Video = 'VIDEO',
}

export enum MapTypeEnum {
  Journey = 'JOURNEY',
}

export type MapTypeUnion = JourneyMap;

export type MapVersion = {
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  mapId: Scalars['Int']['output'];
  s3ObjectUrl: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  versionName: Scalars['String']['output'];
};

export type MapsBulkDeleteInput = {
  ids: Array<Scalars['Int']['input']>;
};

export type Member = {
  color: Scalars['String']['output'];
  createdAt: Scalars['Timestamp']['output'];
  debugMode: Scalars['Boolean']['output'];
  emailAddress: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isShared?: Maybe<Scalars['Boolean']['output']>;
  lastName: Scalars['String']['output'];
  online?: Maybe<Scalars['Boolean']['output']>;
  superAdmin: Scalars['Boolean']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  userId: Scalars['Int']['output'];
};

export type MergeColumnInput = {
  endColumnId: Scalars['Int']['input'];
  endStepId: Scalars['Int']['input'];
  rowId: Scalars['Int']['input'];
  startColumnId: Scalars['Int']['input'];
  startStepId: Scalars['Int']['input'];
};

export type MergeColumnModel = {
  endBoxId: Scalars['Int']['output'];
  startBoxId: Scalars['Int']['output'];
};

export type MergedColumnResponse = {
  id: Scalars['Int']['output'];
  label: Scalars['String']['output'];
  mergedIds: Array<Scalars['Int']['output']>;
};

export type Metrics = {
  boxId: Scalars['Int']['output'];
  ces: Scalars['Float']['output'];
  columnId: Scalars['Int']['output'];
  commentsCount: Scalars['Int']['output'];
  createdAt: Scalars['Timestamp']['output'];
  csat: Scalars['Float']['output'];
  dateRange?: Maybe<MetricsDateRangeEnum>;
  deletedAt?: Maybe<Scalars['Timestamp']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  descriptionEnabled: Scalars['Boolean']['output'];
  endDate?: Maybe<Scalars['Timestamp']['output']>;
  flippedText?: Maybe<Scalars['String']['output']>;
  goal?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  mapId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  note?: Maybe<Note>;
  nps: Scalars['Float']['output'];
  overall: Scalars['Float']['output'];
  ownerId: Scalars['Int']['output'];
  persona?: Maybe<Personas>;
  personaId?: Maybe<Scalars['Int']['output']>;
  questionId?: Maybe<Scalars['Int']['output']>;
  rowId: Scalars['Int']['output'];
  source: MetricsSourceEnum;
  startDate?: Maybe<Scalars['Timestamp']['output']>;
  stepId: Scalars['Int']['output'];
  surveyId?: Maybe<Scalars['Int']['output']>;
  tags: Array<Tags>;
  type: MetricsTypeEnum;
  typeData?: Maybe<MetricsTypeDataUnion>;
  updatedAt: Scalars['Timestamp']['output'];
  value?: Maybe<Scalars['Int']['output']>;
  /** (detractors,satisfied,easy) */
  x: Scalars['Float']['output'];
  /** (passive, neutral, neutral) */
  y: Scalars['Float']['output'];
  /** (promoter,dissatisfied, difficult) */
  z: Scalars['Float']['output'];
};

export type MetricsDataPointUnion = CesPoint | CsatPoint | NpsPoint;

export enum MetricsDateRangeEnum {
  Custom = 'CUSTOM',
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY',
  Yearly = 'YEARLY',
}

export type MetricsResponse = {
  boxId: Scalars['Int']['output'];
  ces: Scalars['Float']['output'];
  columnId: Scalars['Int']['output'];
  commentsCount: Scalars['Int']['output'];
  csat: Scalars['Float']['output'];
  dateRange?: Maybe<MetricsDateRangeEnum>;
  description?: Maybe<Scalars['String']['output']>;
  descriptionEnabled: Scalars['Boolean']['output'];
  endDate?: Maybe<Scalars['Timestamp']['output']>;
  flippedText?: Maybe<Scalars['String']['output']>;
  goal?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  note?: Maybe<Note>;
  nps: Scalars['Float']['output'];
  overall: Scalars['Float']['output'];
  persona?: Maybe<Personas>;
  personaId?: Maybe<Scalars['Int']['output']>;
  questionId?: Maybe<Scalars['Int']['output']>;
  rowId: Scalars['Int']['output'];
  source: MetricsSourceEnum;
  startDate?: Maybe<Scalars['Timestamp']['output']>;
  surveyId?: Maybe<Scalars['Int']['output']>;
  tags: Array<Tags>;
  type: MetricsTypeEnum;
  typeData?: Maybe<Scalars['JSON']['output']>;
  value?: Maybe<Scalars['Int']['output']>;
  /** (detractors,satisfied,easy) */
  x: Scalars['Float']['output'];
  /** (passive, neutral, neutral) */
  y: Scalars['Float']['output'];
  /** (promoter,dissatisfied, difficult) */
  z: Scalars['Float']['output'];
};

export enum MetricsSourceEnum {
  Custom = 'custom',
  Manual = 'manual',
  Survey = 'survey',
}

export type MetricsTypeDataUnion = CsatModel | NpsModel;

export enum MetricsTypeEnum {
  Ces = 'CES',
  Csat = 'CSAT',
  Custom = 'CUSTOM',
  Nps = 'NPS',
}

export type MetricsVersion = {
  average: Scalars['Float']['output'];
  boxElements: Array<BoxElement>;
  boxTextElement?: Maybe<BoxElement>;
  columnId: Scalars['Int']['output'];
  /** box id which can be null if box is not created, this can be happen when box does not has element */
  id?: Maybe<Scalars['Int']['output']>;
  links: Array<LinkResponse>;
  mapId: Scalars['Int']['output'];
  mergeCount: Scalars['Int']['output'];
  metrics?: Maybe<Array<MetricsVersionResponse>>;
  outcomes: Array<OutcomeResponse>;
  /** nullable is true is for createJourneyMapRow api response */
  step?: Maybe<ColumnStep>;
  stepId?: Maybe<Scalars['Int']['output']>;
  touchPoints: Array<TouchPoint>;
  type: MapRowTypeEnum;
};

export type MetricsVersionResponse = {
  boxId: Scalars['Int']['output'];
  ces: Scalars['Float']['output'];
  columnId: Scalars['Int']['output'];
  commentsCount: Scalars['Int']['output'];
  csat: Scalars['Float']['output'];
  dateRange?: Maybe<MetricsDateRangeEnum>;
  description?: Maybe<Scalars['String']['output']>;
  descriptionEnabled: Scalars['Boolean']['output'];
  endDate: Scalars['String']['output'];
  flippedText?: Maybe<Scalars['String']['output']>;
  goal?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  nps: Scalars['Float']['output'];
  overall: Scalars['Float']['output'];
  persona?: Maybe<Personas>;
  personaId?: Maybe<Scalars['Int']['output']>;
  questionId?: Maybe<Scalars['Int']['output']>;
  rowId: Scalars['Int']['output'];
  source: MetricsSourceEnum;
  startDate: Scalars['String']['output'];
  surveyId?: Maybe<Scalars['Int']['output']>;
  type: MetricsTypeEnum;
  typeData?: Maybe<Scalars['JSON']['output']>;
  value?: Maybe<Scalars['Int']['output']>;
  /** (detractors,satisfied,easy) */
  x: Scalars['Float']['output'];
  /** (passive, neutral, neutral) */
  y: Scalars['Float']['output'];
  /** (promoter,dissatisfied, difficult) */
  z: Scalars['Float']['output'];
};

export type MultipartUploadResponse = {
  /** Data for creating a multipart upload. */
  createMultipartData: GetMultipartObject;
  key: Scalars['String']['output'];
};

export type Mutation = {
  addBoxElement: BoxElementResponseModel;
  addComment: Comment;
  addItemsIntoWhiteboard: Array<WhiteboardDataItem>;
  addLink: LinkResponse;
  addOrUpdateColumnStep: CreateUpdateStepModel;
  /** image url */
  attachImageToPersona: Scalars['String']['output'];
  attachTag: Tags;
  clearUserMapsHistory?: Maybe<Scalars['Int']['output']>;
  compareJourneyMapJson?: Maybe<MapDebugLogs>;
  completeMultiPart: GetCompleteMultipartResponse;
  /** map id */
  connectPersonasToMap: Scalars['Int']['output'];
  copyMap: Map;
  copyPersona: Scalars['Int']['output'];
  createAiJourneyModel: AiJourneyModelResponse;
  createBoard: Board;
  createDefaultDemographicInfoFields: Array<DemographicInfo>;
  createDemographicInfo: DemographicInfo;
  createIconAttachment: Scalars['Int']['output'];
  createInterview: Interview;
  createJourneyMap: JourneyMap;
  createJourneyMapColumn: CreateColumnResponse;
  createJourneyMapRow: CreateRowResponseModel;
  createLayer: Layer;
  createMetrics: MetricsResponse;
  createMultipart: MultipartUploadResponse;
  createOrUpdateFolder: Folder;
  createOrUpdateNote: Note;
  createOrUpdateOutcomeGroup: OutcomeGroup;
  createParentMap: ParentMap;
  createPersona: Personas;
  createPersonaByAi: Scalars['Int']['output'];
  createPersonaGroup: PersonaGroup;
  createPersonaSection: PersonaSection;
  createTag: Tags;
  createTouchPoints: CreateTouchpointResponseModel;
  createUpdateOutcome: Outcome;
  createUpdateOutcomeWorkspaceLevel: Outcome;
  createUser: Member;
  createWhiteboard: Whiteboard;
  deleteAiJourneyModel: Scalars['Int']['output'];
  /** persona id */
  deleteAllDemographicInfoFields: Scalars['Int']['output'];
  deleteAttachment: Scalars['Int']['output'];
  deleteBoard: Scalars['Int']['output'];
  deleteComment: Scalars['Int']['output'];
  /** demographic info id */
  deleteDemographicInfo: Scalars['Int']['output'];
  deleteErrorLogs: Scalars['Int']['output'];
  deleteFolder: Scalars['Boolean']['output'];
  deleteInterview: Scalars['Int']['output'];
  deleteItems: Array<Scalars['String']['output']>;
  deleteLayer: Scalars['Int']['output'];
  deleteLink: Scalars['Int']['output'];
  deleteMapColumn: Scalars['Boolean']['output'];
  deleteMapRow: Scalars['Boolean']['output'];
  deleteMapVersion: Scalars['Boolean']['output'];
  deleteMetrics: RemoveMetricsResponseModel;
  deleteOutcome: Scalars['Int']['output'];
  deleteOutcomeGroup: Scalars['Int']['output'];
  deleteParentMap: Scalars['Int']['output'];
  deletePerformanceLogs: Scalars['Int']['output'];
  deletePersona: Scalars['Int']['output'];
  deletePersonaGroup: Scalars['Int']['output'];
  /** section id */
  deletePersonaSection: Scalars['Int']['output'];
  deleteTag: Scalars['Int']['output'];
  deleteTouchPoint: RemoveTouchpointResponseModel;
  deleteTouchPointAttachment: Scalars['Int']['output'];
  deleteWhiteboard: Scalars['Boolean']['output'];
  /** returns row id */
  disablePersonaForRow: Scalars['Int']['output'];
  duplicateWhiteboard: Whiteboard;
  editLink: LinkResponse;
  getPreSignedUrl: GetPresignedUrlObject;
  mapsBulkDelete: Array<Scalars['Int']['output']>;
  mergeJourneyMapColumn: MergeColumnModel;
  patchWhiteboardUser: WhiteboardUser;
  pinDemographicInfo: Scalars['Int']['output'];
  pinPersonaSection: Scalars['Int']['output'];
  /** box element id */
  removeBoxElement: BoxElementResponseModel;
  removeColumnStep: Scalars['Int']['output'];
  replaceMapVersion: GetMapByVersionIdModel;
  restoreMetrics: Metrics;
  retrieveColumn: MapColumn;
  retrieveColumnStep: ColumnStep;
  retrieveMetricsData: Metrics;
  retrieveRow: MapRow;
  selectItems?: Maybe<Scalars['Int']['output']>;
  setMapForItem: SuccessTypeModel;
  toggleDebugMode: Member;
  toggleUserSuperAdminMode: Member;
  unAttachTag: Tags;
  unMergeJourneyMapColumn: UnmergeColumnModel;
  updateAiJourneyModel: AiJourneyModelResponse;
  updateAttachmentCroppedArea: GetPresignedUrlObject;
  updateAttachmentName: Scalars['String']['output'];
  updateAttachmentScaleType: GetPresignedUrlObject;
  updateAttachmentTouchPoint: Scalars['String']['output'];
  updateBoard: Board;
  updateBoxElement: BoxElementResponseModel;
  /** returns updated text */
  updateComment: Scalars['String']['output'];
  updateDemographicInfo: DemographicInfo;
  updateDemographicInfoPosition: UpdateDemographicInfoPositionModel;
  updateItemFlippedText: Scalars['String']['output'];
  updateItems: Array<WhiteboardDataItem>;
  updateJourneyMap: Scalars['Int']['output'];
  updateJourneyMapColumn: Scalars['Int']['output'];
  updateJourneyMapRow: Scalars['Int']['output'];
  updateLayer: Layer;
  updateLinkBGColor: LinkResponse;
  updateMapVersionName: MapVersion;
  updateMetrics: MetricsResponse;
  updatePersona: Scalars['Int']['output'];
  updatePersonaGroup: PersonaGroup;
  updatePersonaSection?: Maybe<Scalars['Int']['output']>;
  /** returns state */
  updatePersonaState: PersonaStateEnum;
  updateTextRows: BoxTextElementResponseModel;
  updateTouchPoint: TouchPoint;
  updateWhiteboard: Whiteboard;
  updateWhiteboardUser: WhiteboardUser;
};

export type MutationAddBoxElementArgs = {
  addBoxElementInput: AddBoxElementInput;
};

export type MutationAddCommentArgs = {
  addCommentInput: AddCommentInput;
};

export type MutationAddItemsIntoWhiteboardArgs = {
  createItemsInput: CreateItemsInput;
};

export type MutationAddLinkArgs = {
  addLinkInput: AddLinkInput;
};

export type MutationAddOrUpdateColumnStepArgs = {
  addOrUpdateColumnStepInput: AddOrUpdateColumnStepInput;
};

export type MutationAttachImageToPersonaArgs = {
  attachImageInput: AttachImageInput;
};

export type MutationAttachTagArgs = {
  attachTagInput: AttachTagInput;
};

export type MutationCompareJourneyMapJsonArgs = {
  compareJourneyMapJsonInput: CompareJourneyMapJsonInput;
};

export type MutationCompleteMultiPartArgs = {
  completeMultiPartInput: CompleteMultiPartInput;
};

export type MutationConnectPersonasToMapArgs = {
  connectPersonasToMapInput: ConnectPersonasToMapInput;
};

export type MutationCopyMapArgs = {
  copyMapInput: CopyMapInput;
};

export type MutationCopyPersonaArgs = {
  copyPersonaInput: CopyPersonaInput;
};

export type MutationCreateAiJourneyModelArgs = {
  createAiJourneyInput: CreateAiJourneyInput;
};

export type MutationCreateBoardArgs = {
  createBoardInput: CreateBoardInput;
};

export type MutationCreateDefaultDemographicInfoFieldsArgs = {
  createDefaultDemographicInfoFieldsInput: CreateDefaultDemographicInfoFieldsInput;
};

export type MutationCreateDemographicInfoArgs = {
  createDemographicInfoInput: CreateDemographicInfoInput;
};

export type MutationCreateIconAttachmentArgs = {
  createIconInput: CreateIconInput;
};

export type MutationCreateInterviewArgs = {
  createInterviewInput: CreateInterviewInput;
};

export type MutationCreateJourneyMapArgs = {
  createJourneyMapInput: CreateJourneyMapInput;
};

export type MutationCreateJourneyMapColumnArgs = {
  createColumnInput: CreateColumnInput;
};

export type MutationCreateJourneyMapRowArgs = {
  createRowInput: CreateRowInput;
};

export type MutationCreateLayerArgs = {
  createLayerInput: CreateLayerInput;
};

export type MutationCreateMetricsArgs = {
  createCustomMetricsInput?: InputMaybe<CreateCustomMetricsInput>;
  createDataPointsInput?: InputMaybe<CreateDataPointsInput>;
  createMetricsInput: CreateMetricsInput;
};

export type MutationCreateMultipartArgs = {
  createMultipartInput: CreateMultipartInput;
};

export type MutationCreateOrUpdateFolderArgs = {
  folderInput: FolderInput;
};

export type MutationCreateOrUpdateNoteArgs = {
  createOrUpdateNoteInput: CreateOrUpdateNoteInput;
};

export type MutationCreateOrUpdateOutcomeGroupArgs = {
  createOrUpdateOutcomeGroupInput: CreateOrUpdateOutcomeGroupInput;
};

export type MutationCreateParentMapArgs = {
  createParentMapInput: CreateParentMapInput;
};

export type MutationCreatePersonaArgs = {
  createPersonaInput: CreatePersonaInput;
};

export type MutationCreatePersonaByAiArgs = {
  createPersonaByAiInput: CreatePersonaByAiInput;
};

export type MutationCreatePersonaGroupArgs = {
  createPersonaGroupInput: CreatePersonaGroupInput;
};

export type MutationCreatePersonaSectionArgs = {
  createPersonaSectionInput: CreatePersonaSectionInput;
};

export type MutationCreateTagArgs = {
  createTagInput: CreateTagInput;
};

export type MutationCreateTouchPointsArgs = {
  createTouchPointInput: CreateTouchPointInput;
};

export type MutationCreateUpdateOutcomeArgs = {
  createUpdateOutcomeInput: CreateUpdateOutcomeInput;
};

export type MutationCreateUpdateOutcomeWorkspaceLevelArgs = {
  createOrUpdateWorkspaceOutcomeInput: CreateOrUpdateWorkspaceOutcomeInput;
};

export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};

export type MutationCreateWhiteboardArgs = {
  createWhiteboardInput: CreateWhiteboardInput;
};

export type MutationDeleteAiJourneyModelArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteAllDemographicInfoFieldsArgs = {
  personaId: Scalars['Int']['input'];
};

export type MutationDeleteAttachmentArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteBoardArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteCommentArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteDemographicInfoArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteFolderArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteInterviewArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteItemsArgs = {
  deleteItemsInput: DeleteItemsInput;
};

export type MutationDeleteLayerArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteLinkArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteMapColumnArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteMapRowArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteMapVersionArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteMetricsArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteOutcomeArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteOutcomeGroupArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteParentMapArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeletePersonaArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeletePersonaGroupArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeletePersonaSectionArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteTagArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteTouchPointArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteTouchPointAttachmentArgs = {
  deleteTouchPointAttachmentTypeInput: DeleteTouchPointAttachmentTypeInput;
};

export type MutationDeleteWhiteboardArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDisablePersonaForRowArgs = {
  disablePersonaInput: DisablePersonaInput;
};

export type MutationDuplicateWhiteboardArgs = {
  duplicateWhiteboardInput: DuplicateWhiteboardInput;
};

export type MutationEditLinkArgs = {
  editLinkInput: EditLinkInput;
};

export type MutationGetPreSignedUrlArgs = {
  getPreSignedUrlInput: GetPreSignedUrlInput;
};

export type MutationMapsBulkDeleteArgs = {
  mapsBulkDeleteInput: MapsBulkDeleteInput;
};

export type MutationMergeJourneyMapColumnArgs = {
  mergeColumnInput: MergeColumnInput;
};

export type MutationPatchWhiteboardUserArgs = {
  patchWhiteboardUserInput: PatchWhiteboardUserInput;
};

export type MutationPinDemographicInfoArgs = {
  pinDemographicInfoInput: PinInput;
};

export type MutationPinPersonaSectionArgs = {
  pinSectionInput: PinInput;
};

export type MutationRemoveBoxElementArgs = {
  removeBoxElementInput: RemoveBoxElementInput;
};

export type MutationRemoveColumnStepArgs = {
  id: Scalars['Int']['input'];
};

export type MutationReplaceMapVersionArgs = {
  replaceMapVersionInput: ReplaceMapVersionInput;
};

export type MutationRestoreMetricsArgs = {
  id: Scalars['Int']['input'];
};

export type MutationRetrieveColumnArgs = {
  id: Scalars['Int']['input'];
};

export type MutationRetrieveColumnStepArgs = {
  id: Scalars['Int']['input'];
};

export type MutationRetrieveMetricsDataArgs = {
  id: Scalars['Int']['input'];
  previous: Scalars['Boolean']['input'];
};

export type MutationRetrieveRowArgs = {
  id: Scalars['Int']['input'];
};

export type MutationSelectItemsArgs = {
  selectItemsInput: SelectItemsInput;
};

export type MutationSetMapForItemArgs = {
  setMapForItemInput: SetMapForItemInput;
};

export type MutationToggleDebugModeArgs = {
  debugMode: Scalars['Boolean']['input'];
};

export type MutationToggleUserSuperAdminModeArgs = {
  superAdminInput: SuperAdminInput;
};

export type MutationUnAttachTagArgs = {
  unAttachTagInput: UnAttachTagInput;
};

export type MutationUnMergeJourneyMapColumnArgs = {
  unmergeColumnInput: UnmergeColumnInput;
};

export type MutationUpdateAiJourneyModelArgs = {
  updateAiJourneyInput: UpdateAiJourneyInput;
};

export type MutationUpdateAttachmentCroppedAreaArgs = {
  updateAttachmentCroppedAreaInput: UpdateAttachmentCroppedAreaInput;
};

export type MutationUpdateAttachmentNameArgs = {
  updateAttachmentNameInput: UpdateAttachmentNameInput;
};

export type MutationUpdateAttachmentScaleTypeArgs = {
  updateAttachmentScaleTypeInput: UpdateAttachmentScaleTypeInput;
};

export type MutationUpdateAttachmentTouchPointArgs = {
  updateAttachmentTouchPointInput: UpdateAttachmentTouchPointInput;
};

export type MutationUpdateBoardArgs = {
  updateBoardInput: UpdateBoardInput;
};

export type MutationUpdateBoxElementArgs = {
  updateBoxDataInput: UpdateBoxDataInput;
};

export type MutationUpdateCommentArgs = {
  updateCommentInput: UpdateCommentInput;
};

export type MutationUpdateDemographicInfoArgs = {
  updateDemographicInfoInput: UpdateDemographicInfoInput;
};

export type MutationUpdateDemographicInfoPositionArgs = {
  updateDemographicInfoPositionInput: UpdateDemographicInfoPositionInput;
};

export type MutationUpdateItemFlippedTextArgs = {
  updateItemFlippedTextInput: UpdateItemFlippedTextInput;
};

export type MutationUpdateItemsArgs = {
  updateItemsInput: UpdateItemsInput;
};

export type MutationUpdateJourneyMapArgs = {
  updateJourneyMapInput: UpdateJourneyMapInput;
};

export type MutationUpdateJourneyMapColumnArgs = {
  updateColumnInput: UpdateColumnInput;
};

export type MutationUpdateJourneyMapRowArgs = {
  updateRowInput: UpdateRowInput;
};

export type MutationUpdateLayerArgs = {
  updateLayerInput: UpdateLayerInput;
};

export type MutationUpdateLinkBgColorArgs = {
  updateLinkBGColor: UpdateLinkBgColor;
};

export type MutationUpdateMapVersionNameArgs = {
  updateMapVersionInput: UpdateMapVersionInput;
};

export type MutationUpdateMetricsArgs = {
  updateCustomMetricsInput?: InputMaybe<UpdateCustomMetricsInput>;
  updateDataPointsInput?: InputMaybe<UpdateDataPointsInput>;
  updateMetricsInput: UpdateMetricsInput;
};

export type MutationUpdatePersonaArgs = {
  updatePersonaInput: UpdatePersonaInput;
};

export type MutationUpdatePersonaGroupArgs = {
  updatePersonaGroupInput: UpdatePersonaGroupInput;
};

export type MutationUpdatePersonaSectionArgs = {
  updatePersonaSectionInput: UpdatePersonaSectionInput;
};

export type MutationUpdatePersonaStateArgs = {
  updatePersonaStateInput: UpdatePersonaStateInput;
};

export type MutationUpdateTextRowsArgs = {
  updateTextRowInput: UpdateTextRowInput;
};

export type MutationUpdateTouchPointArgs = {
  updateTouchPointInput: UpdateTouchPointInput;
};

export type MutationUpdateWhiteboardArgs = {
  updateWhiteboardInput: UpdateWhiteboardInput;
};

export type MutationUpdateWhiteboardUserArgs = {
  updateWhiteboardUserInput: UpdateWhiteboardUserInput;
};

export type NpsModel = {
  detractors: Scalars['Int']['output'];
  neutral: Scalars['Int']['output'];
  promoters: Scalars['Int']['output'];
};

export type NpsPoint = {
  createdAt: Scalars['Timestamp']['output'];
  date: Scalars['Timestamp']['output'];
  detractor: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  metricsId: Scalars['Int']['output'];
  passive: Scalars['Int']['output'];
  promoter: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export type NpsPointInput = {
  date: Scalars['Timestamp']['input'];
  detractor: Scalars['Int']['input'];
  passive: Scalars['Int']['input'];
  promoter: Scalars['Int']['input'];
};

export type Note = {
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  itemId: Scalars['Int']['output'];
  itemType: CommentAndNoteModelsEnum;
  owner: Member;
  ownerId: Scalars['Int']['output'];
  text: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export enum OrderByEnum {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type OrderInput = {
  key: Scalars['String']['input'];
  orderBY: OrderByEnum;
};

export type OrderMapInput = {
  key: Scalars['String']['input'];
  orderBY: OrderByEnum;
};

export type OrgAiJourneyModel = {
  aiJourneyModel: AiJourneyModel;
  aiJourneyModelId: Scalars['Int']['output'];
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  orgId: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export type OrgSettings = {
  businessTypeId?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  language: LanguagesEnum;
  lastVisitedWorkspaceId?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  orgId: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export type Outcome = {
  bgColor?: Maybe<Scalars['String']['output']>;
  boardId?: Maybe<Scalars['Int']['output']>;
  boxId?: Maybe<Scalars['Int']['output']>;
  column?: Maybe<MapColumn>;
  columnId?: Maybe<Scalars['Int']['output']>;
  commentsCount: Scalars['Int']['output'];
  createdAt: Scalars['Timestamp']['output'];
  description?: Maybe<Scalars['String']['output']>;
  flippedText?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  index?: Maybe<Scalars['Int']['output']>;
  map?: Maybe<Map>;
  mapId?: Maybe<Scalars['Int']['output']>;
  note?: Maybe<Note>;
  orgId: Scalars['Int']['output'];
  outcomeGroupId: Scalars['Int']['output'];
  persona?: Maybe<Personas>;
  personaId?: Maybe<Scalars['Int']['output']>;
  row?: Maybe<MapRow>;
  rowId?: Maybe<Scalars['Int']['output']>;
  status: OutcomeStatusEnum;
  step: ColumnStep;
  stepId?: Maybe<Scalars['Int']['output']>;
  tags: Array<Tags>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  user?: Maybe<Member>;
  userId: Scalars['Int']['output'];
  webhookUrl?: Maybe<Scalars['String']['output']>;
  workspaceId: Scalars['Int']['output'];
};

export type OutcomeGroup = {
  createdAt: Scalars['Timestamp']['output'];
  icon: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isDefault: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  orgId: Scalars['Int']['output'];
  outcomes: Array<Outcome>;
  outcomesCount: Scalars['Int']['output'];
  pluralName: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
  user?: Maybe<Member>;
  userId?: Maybe<Scalars['Int']['output']>;
};

export type OutcomeGroupOutcomesArgs = {
  getOutcomesInput: GetOutcomesInput;
};

export type OutcomeGroupOutcomesCountArgs = {
  list: OutcomeListEnum;
  mapId?: InputMaybe<Scalars['Int']['input']>;
};

export type OutcomeGroupResponse = {
  icon: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  pluralName: Scalars['String']['output'];
};

export type OutcomeGroupWithOutcomeCounts = {
  count: Scalars['Int']['output'];
  icon: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export enum OutcomeListEnum {
  MapLevel = 'MAP_LEVEL',
  OutcomeGroupLevel = 'OUTCOME_GROUP_LEVEL',
  WorkspaceLevel = 'WORKSPACE_LEVEL',
}

export type OutcomeResponse = {
  bgColor?: Maybe<Scalars['String']['output']>;
  boxId?: Maybe<Scalars['Int']['output']>;
  columnId?: Maybe<Scalars['Int']['output']>;
  commentsCount: Scalars['Int']['output'];
  createdAt: Scalars['Timestamp']['output'];
  description?: Maybe<Scalars['String']['output']>;
  flippedText?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  index?: Maybe<Scalars['Int']['output']>;
  mapId?: Maybe<Scalars['Int']['output']>;
  note?: Maybe<Note>;
  outcomeGroupId: Scalars['Int']['output'];
  persona?: Maybe<Personas>;
  personaId?: Maybe<Scalars['Int']['output']>;
  rowId?: Maybe<Scalars['Int']['output']>;
  status: OutcomeStatusEnum;
  stepId?: Maybe<Scalars['Int']['output']>;
  tags: Array<Tags>;
  title: Scalars['String']['output'];
  user?: Maybe<Member>;
};

export enum OutcomeStatusEnum {
  Backlog = 'BACKLOG',
  Initiative = 'INITIATIVE',
}

export enum OwnershipTypeEnum {
  All = 'ALL',
  Mine = 'MINE',
}

export type PaginationInput = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export type ParentMap = {
  childId: Scalars['Int']['output'];
  childMap: Map;
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  parentId: Scalars['Int']['output'];
  parentMap: Map;
  updatedAt: Scalars['Timestamp']['output'];
};

export type PartialPersonaGroup = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  organizationId?: Maybe<Scalars['Int']['output']>;
  workspaceId?: Maybe<Scalars['Int']['output']>;
};

export type PartialWorkspace = {
  boards?: Maybe<Array<Board>>;
  boardsCount?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['Timestamp']['output']>;
  defaultFolderId?: Maybe<Scalars['Int']['output']>;
  deletedAt?: Maybe<Scalars['Timestamp']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  feedBackCreationDate?: Maybe<Scalars['Timestamp']['output']>;
  feedbackId?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  journeyMapCount?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  organizationId?: Maybe<Scalars['Int']['output']>;
  ownerId?: Maybe<Scalars['Int']['output']>;
  personaGroup?: Maybe<Array<PersonaGroup>>;
  personasCount?: Maybe<Scalars['Int']['output']>;
  sortedBoards?: Maybe<Array<Scalars['Int']['output']>>;
  updatedAt?: Maybe<Scalars['Timestamp']['output']>;
  userAction?: Maybe<UserActionEnum>;
};

export type PatchWhiteboardUserInput = {
  mouseEventsEnabled: Scalars['Boolean']['input'];
  whiteboardId: Scalars['Int']['input'];
};

export type PerformanceLog = {
  complexity?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  method: Scalars['String']['output'];
  path: Scalars['String']['output'];
  payloadSize?: Maybe<Scalars['Float']['output']>;
  queryCount: Scalars['Int']['output'];
  responseTime: Scalars['Int']['output'];
  sqlRowQueries?: Maybe<Array<Scalars['String']['output']>>;
  updatedAt: Scalars['Timestamp']['output'];
  user: Scalars['JSONObject']['output'];
};

export type PersonaForOutcomeCreation = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type PersonaGroup = {
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['Int']['output'];
  persona: Array<Personas>;
  updatedAt: Scalars['Timestamp']['output'];
  workspaceId: Scalars['Int']['output'];
};

export type PersonaGroupModel = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['Int']['output'];
  workspaceId: Scalars['Int']['output'];
};

export type PersonaSection = {
  color: Scalars['String']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  h: Scalars['Int']['output'];
  i: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isHidden: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  personaId: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  w: Scalars['Int']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
};

export type PersonaState = {
  boxId: Scalars['Int']['output'];
  columnId: Scalars['Int']['output'];
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  mapPersonaId: Scalars['Int']['output'];
  personaId: Scalars['Int']['output'];
  rowId: Scalars['Int']['output'];
  state: PersonaStateEnum;
  stepId?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
};

export enum PersonaStateEnum {
  Happy = 'HAPPY',
  Neutral = 'NEUTRAL',
  Sad = 'SAD',
  VeryHappy = 'VERY_HAPPY',
  VerySad = 'VERY_SAD',
}

export type PersonaUrlObject = {
  color?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type PinInput = {
  id: Scalars['Int']['input'];
  mapId: Scalars['Int']['input'];
};

export type PinnedOutcomeGroup = {
  board: Board;
  boardId: Scalars['Int']['output'];
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  outcomeGroup: OutcomeGroup;
  outcomeGroupId: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  userId: Scalars['Int']['output'];
};

export type PinnedSection = {
  createdAt: Scalars['Timestamp']['output'];
  h: Scalars['Int']['output'];
  i: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  section: PersonaSection;
  sectionId: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  w: Scalars['Int']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
};

export type Position = {
  createdAt: Scalars['Timestamp']['output'];
  height?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  parentId: Scalars['Int']['output'];
  parentType: DatabaseModelEnum;
  referenceId: Scalars['Int']['output'];
  referenceType: PositionReferenceTypeEnum;
  updatedAt: Scalars['Timestamp']['output'];
  width?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
};

export type PositionInput = {
  columnId: Scalars['Int']['input'];
  index: Scalars['Int']['input'];
  rowId: Scalars['Int']['input'];
  stepId: Scalars['Int']['input'];
};

export enum PositionReferenceTypeEnum {
  Attachment = 'ATTACHMENT',
  DemographicInfoFieldImage = 'DEMOGRAPHIC_INFO_FIELD_IMAGE',
  Persona = 'PERSONA',
}

export type Query = {
  getAiJourneyModels: GetAiJourneyModelsResponse;
  getAllPinnedBoards: Array<Scalars['Int']['output']>;
  getAttachmentTouchPointMaps: Attachment;
  getBoardById: Board;
  getBoardOutcomesStat: BoardStats;
  getBoardTags: GetBoardsTagsModel;
  getBoardsForItem: GetBoardsForItemModel;
  getBoardsForOutcomeGroup: GetOutcomeBoardsModel;
  getCardAttachedTags: Array<GetCardAttachedTagsModel>;
  getColumnSteps: Array<ColumnStep>;
  getCustomMetricsItems: Array<CustomMetrics>;
  getDataPoints: GetDataPointsResponse;
  getErrorLogs: GetErrorLogModel;
  getFolderById: Folder;
  getFolders: GetFoldersModel;
  getHistoryLogs: GetHistoryLogModel;
  getInterviewsByWorkspaceId: GetBoardInterviewsModel;
  getItemComments: GetItemCommentsModel;
  getItemNote: Note;
  getJourneyMap: GetJourneyMapResponse;
  getJourneyMapColumnSteps: GetJourneyMapColumnStepsResponse;
  getJourneyMapRowsAndColumns: GetJourneyMapRowsAndColumnResponse;
  getLayersByMapId: GetLayersModel;
  getLinkMapsByBoard: GetLinkMapsModel;
  getMapByVersionId: GetMapByVersionIdModel;
  getMapColumnsForOutcome: GetMapColumnsOutcomeModel;
  getMapDebugLogs?: Maybe<GetJourneyMapDebugLogsModel>;
  getMapDetails: GetMapDetailsModel;
  getMapLogs: GetMapLogsModel;
  getMapOutcomeGroupsForRowCreation: Array<OutcomeGroup>;
  getMapPersonasForOutcome: GetMapPersonasModel;
  getMapSelectedPersonas: Array<Personas>;
  getMapVersions: GetMapVersionsModel;
  getMaps: GetMapsModel;
  getMe: User;
  getMyBoards: GetUserBoardsModel;
  getNounProjectIcons?: Maybe<Scalars['JSON']['output']>;
  getOrganizationUsers: GetQuestionProUsersModel;
  getOrgs: Array<OrgSettings>;
  getOutcomeGroup: OutcomeGroup;
  getOutcomeGroups: GetOutcomeGroupModel;
  getParentMapChildren: Array<Map>;
  getParentMapsByBoardId: GetParentMapsByBoardIdModel;
  getPerformanceLogs: GetPerformanceLogModel;
  getPersonaById: Personas;
  getPersonaDemographicInfos: GetDemographicInfosModel;
  getPersonaGallery: GetPersonaGalleryModel;
  getPersonaGroups: GetPersonaGroupsModel;
  getPersonaGroupsWithPersonas: GetPersonaGroupsWithPersonasModel;
  getPersonaSections: Array<GetPersonaSectionsModel>;
  getPersonas: GetPersonasModel;
  getPinnedPersonaItems: GetPinnedPersonaItemsModel;
  getProjectMaps: Array<SuiteMapModel>;
  getProjects: Array<SuiteProjectModel>;
  getSelectedMapsForItem: GetSelectedMapsForItemModel;
  getSuiteOrgs: Array<SuiteOrgModel>;
  getSuiteUsers: GetUsersModel;
  getTouchPointIcons: GetTouchPointIconsModel;
  getUserLastPerformanceLog: PerformanceLog;
  getWhiteboard: GetWhiteboardModel;
  getWhiteboardDataItems: GetWhiteboardDataItemsModel;
  getWhiteboardUsers: Array<WhiteboardUser>;
  getWhiteboards: GetWhiteboardsModel;
  getWorkspaceBoards: GetWorkspaceBoardsModel;
  getWorkspaceById: GetWorkspaceWithStat;
  getWorkspaceMaps: GetWorkspaceMapsModel;
  getWorkspaces: Array<WorkspaceResponseModel>;
  getWorkspacesByOrganizationId: GetUserWorkspacesModel;
  searchOrganizationUsers: Array<Member>;
};

export type QueryGetAiJourneyModelsArgs = {
  getAiJourneyModelsInput: GetAiJourneyModelsInput;
};

export type QueryGetAllPinnedBoardsArgs = {
  outcomeGroupId: Scalars['Int']['input'];
};

export type QueryGetAttachmentTouchPointMapsArgs = {
  getAttachmentTouchPointMapsInput: GetAttachmentTouchPointMapsInput;
};

export type QueryGetBoardByIdArgs = {
  id: Scalars['Int']['input'];
};

export type QueryGetBoardOutcomesStatArgs = {
  boardId: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryGetBoardTagsArgs = {
  getBoardTagsInput: GetBoardTagsInput;
};

export type QueryGetBoardsForItemArgs = {
  getBoardsForItemInput: GetBoardsForItemInput;
};

export type QueryGetBoardsForOutcomeGroupArgs = {
  getBoardsFourOutcomeGroupInput: GetBoardsFourOutcomeGroupInput;
};

export type QueryGetCardAttachedTagsArgs = {
  getAttachedTagsInput: GetAttachedTagsInput;
};

export type QueryGetColumnStepsArgs = {
  columnId: Scalars['Int']['input'];
};

export type QueryGetCustomMetricsItemsArgs = {
  metricsId: Scalars['Int']['input'];
};

export type QueryGetDataPointsArgs = {
  getDataPointsInput: GetDataPointsInput;
};

export type QueryGetErrorLogsArgs = {
  paginationInput: PaginationInput;
};

export type QueryGetFolderByIdArgs = {
  id: Scalars['Int']['input'];
};

export type QueryGetFoldersArgs = {
  getFoldersInput: GetFoldersInput;
};

export type QueryGetHistoryLogsArgs = {
  getHistoryLogInput: GetHistoryLogInput;
};

export type QueryGetInterviewsByWorkspaceIdArgs = {
  getInterviewsInput: GetInterviewsInput;
};

export type QueryGetItemCommentsArgs = {
  getItemCommentsInput: GetItemCommentsInput;
};

export type QueryGetItemNoteArgs = {
  getItemNoteInput: GetItemNoteInput;
};

export type QueryGetJourneyMapArgs = {
  getJourneyMapInput: GetJourneyMapInput;
};

export type QueryGetJourneyMapColumnStepsArgs = {
  getJourneyMapColumnStepsInput: GetJourneyMapColumnStepsInput;
};

export type QueryGetJourneyMapRowsAndColumnsArgs = {
  getJourneyMapRowsAndColumnsInput: GetJourneyMapRowsAndColumnsInput;
};

export type QueryGetLayersByMapIdArgs = {
  getLayersInput: GetLayersInput;
};

export type QueryGetLinkMapsByBoardArgs = {
  getMapsInput: GetMapsInput;
};

export type QueryGetMapByVersionIdArgs = {
  getMapByVersionIdInput: GetMapByVersionIdInput;
};

export type QueryGetMapColumnsForOutcomeArgs = {
  getMapColumnsForOutcomeInput: GetMapRowColumnsForOutcomeInput;
};

export type QueryGetMapDebugLogsArgs = {
  getMapDebugLogsInput: GetMapDebugLogsInput;
};

export type QueryGetMapDetailsArgs = {
  mapId: Scalars['Int']['input'];
};

export type QueryGetMapLogsArgs = {
  mapId: Scalars['Int']['input'];
  paginationInput: PaginationInput;
};

export type QueryGetMapOutcomeGroupsForRowCreationArgs = {
  mapId: Scalars['Int']['input'];
};

export type QueryGetMapPersonasForOutcomeArgs = {
  getMapPersonasInput: GetMapPersonasInput;
};

export type QueryGetMapSelectedPersonasArgs = {
  mapId: Scalars['Int']['input'];
};

export type QueryGetMapVersionsArgs = {
  getMapVersionsInput: GetMapVersionsInput;
};

export type QueryGetMapsArgs = {
  getMapsInput: GetMapsInput;
};

export type QueryGetMyBoardsArgs = {
  getMyBoardsInput: GetMyBoardsInput;
};

export type QueryGetNounProjectIconsArgs = {
  category: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
};

export type QueryGetOrganizationUsersArgs = {
  paginationInput: QuestionProPaginationInput;
};

export type QueryGetOrgsArgs = {
  getOrgsInput?: InputMaybe<GetOrgsInput>;
};

export type QueryGetOutcomeGroupArgs = {
  getOutcomeGroupInput: GetOutcomeGroupInput;
};

export type QueryGetOutcomeGroupsArgs = {
  getOutcomeGroupsInput: GetOutcomeGroupsInput;
};

export type QueryGetParentMapChildrenArgs = {
  parentMapId: Scalars['Int']['input'];
};

export type QueryGetParentMapsByBoardIdArgs = {
  getParentMapByBoardIdInput: GetParentMapByBoardIdInput;
};

export type QueryGetPerformanceLogsArgs = {
  paginationInput: PaginationInput;
};

export type QueryGetPersonaByIdArgs = {
  getPersonaByIdInput: GetPersonaByIdInput;
};

export type QueryGetPersonaDemographicInfosArgs = {
  getPersonaDemographicInfosInput: GetPersonaDemographicInfosInput;
};

export type QueryGetPersonaGalleryArgs = {
  getPersonaGalleryInput: GetPersonaGalleryInput;
};

export type QueryGetPersonaGroupsArgs = {
  getPersonaGroupsInput: GetPersonaGroupsInput;
};

export type QueryGetPersonaGroupsWithPersonasArgs = {
  getPersonaGroupsWithPersonasInput: GetPersonaGroupsWithPersonasInput;
};

export type QueryGetPersonaSectionsArgs = {
  getPersonaSectionsInput: GetPersonaSectionsInput;
};

export type QueryGetPersonasArgs = {
  getPersonasInput: GetPersonasInput;
};

export type QueryGetPinnedPersonaItemsArgs = {
  pinnedPersonaItemsInput: PinInput;
};

export type QueryGetProjectMapsArgs = {
  projectId: Scalars['Int']['input'];
};

export type QueryGetProjectsArgs = {
  orgId: Scalars['Int']['input'];
};

export type QueryGetSelectedMapsForItemArgs = {
  getSelectedMapsForItemInput: GetSelectedMapsForItemInput;
};

export type QueryGetSuiteOrgsArgs = {
  getSuiteOrgsInput: GetSuiteOrgsInput;
};

export type QueryGetSuiteUsersArgs = {
  orgId: Scalars['Int']['input'];
};

export type QueryGetTouchPointIconsArgs = {
  getTouchpointIconsInput: GetTouchpointIconsInput;
};

export type QueryGetWhiteboardArgs = {
  id: Scalars['Int']['input'];
};

export type QueryGetWhiteboardDataItemsArgs = {
  getWhiteboardDataItemsInput: GetWhiteboardDataItemsInput;
};

export type QueryGetWhiteboardUsersArgs = {
  id: Scalars['Int']['input'];
};

export type QueryGetWhiteboardsArgs = {
  getWhiteboardsInput: GetWhiteboardsInput;
};

export type QueryGetWorkspaceBoardsArgs = {
  getWorkspaceBoardsInput: GetWorkspaceBoardsInput;
};

export type QueryGetWorkspaceByIdArgs = {
  id: Scalars['Int']['input'];
};

export type QueryGetWorkspaceMapsArgs = {
  getWorkspaceMapsInput: GetWorkspaceMapsInput;
};

export type QueryGetWorkspacesArgs = {
  orgId?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryGetWorkspacesByOrganizationIdArgs = {
  getWorkspacesInput: GetWorkspacesInput;
};

export type QuerySearchOrganizationUsersArgs = {
  searchOrganizationUserInput: SearchOrganizationUserInput;
};

export type QuestionProPaginationInput = {
  page: Scalars['Int']['input'];
  perPage: Scalars['Int']['input'];
  workspaceId?: InputMaybe<Scalars['Int']['input']>;
};

export type RemoveBoxElementInput = {
  boxElementId: Scalars['Int']['input'];
};

export type RemoveMetricsResponseModel = {
  columnId: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  rowId: Scalars['Int']['output'];
};

export type RemoveTouchpointResponseModel = {
  columnId: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  rowId: Scalars['Int']['output'];
};

export type ReplaceMapVersionInput = {
  versionId: Scalars['Int']['input'];
};

export type RowWithPersonas = {
  attachment?: Maybe<Attachment>;
  color?: Maybe<Scalars['String']['output']>;
  croppedArea?: Maybe<Position>;
  id: Scalars['Int']['output'];
  isDisabledForThisRow: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  personaStates: Array<PersonaState>;
  type: Scalars['String']['output'];
};

export type SearchOrganizationUserInput = {
  search?: InputMaybe<Scalars['String']['input']>;
};

export type SelectItemsInput = {
  deselectedItemIds: Array<Scalars['Int']['input']>;
  selectedItemIds: Array<Scalars['Int']['input']>;
};

/** The user who selected the board item */
export type SelectedUser = {
  date?: Maybe<Scalars['Timestamp']['output']>;
  isSelected: Scalars['Boolean']['output'];
  user: Member;
};

export type SetMapForItemInput = {
  mapId: Scalars['Int']['input'];
  selected: Scalars['Boolean']['input'];
  uuid: Scalars['String']['input'];
};

export enum SharingPolicyEnum {
  Edit = 'EDIT',
  Private = 'PRIVATE',
  View = 'VIEW',
}

export enum SortByEnum {
  CreatedAt = 'CREATED_AT',
  CreatedBy = 'CREATED_BY',
  Title = 'TITLE',
}

export enum SubActionTypeEnum {
  Attach = 'ATTACH',
  BgColor = 'BG_COLOR',
  Collapse = 'COLLAPSE',
  External = 'EXTERNAL',
  Journey = 'JOURNEY',
  Lock = 'LOCK',
  Title = 'TITLE',
  Unattach = 'UNATTACH',
}

export type SuccessTypeModel = {
  success: Scalars['Boolean']['output'];
};

export type SuiteMapModel = {
  c_id: Scalars['Int']['output'];
  cs_acc_id: Scalars['Int']['output'];
  cs_added_date?: Maybe<Scalars['Timestamp']['output']>;
  cs_mod_date?: Maybe<Scalars['Timestamp']['output']>;
  cs_name: Scalars['String']['output'];
  cs_project_id: Scalars['Int']['output'];
  cs_usage_desc?: Maybe<Scalars['String']['output']>;
};

export type SuiteOrgModel = {
  acc_date_added?: Maybe<Scalars['Timestamp']['output']>;
  acc_date_modified?: Maybe<Scalars['Timestamp']['output']>;
  acc_id: Scalars['Int']['output'];
  acc_name: Scalars['String']['output'];
  acc_notes?: Maybe<Scalars['String']['output']>;
  acc_status: Scalars['String']['output'];
  qp_org_id?: Maybe<Scalars['Int']['output']>;
};

export type SuiteProjectModel = {
  pro_acc_id: Scalars['Int']['output'];
  pro_add_date?: Maybe<Scalars['Timestamp']['output']>;
  pro_mod_date?: Maybe<Scalars['Timestamp']['output']>;
  pro_owner_id: Scalars['Int']['output'];
  pro_project_desc?: Maybe<Scalars['String']['output']>;
  pro_project_id: Scalars['Int']['output'];
  pro_project_name: Scalars['String']['output'];
};

export type SuiteUserModel = {
  user_date_added?: Maybe<Scalars['Timestamp']['output']>;
  user_date_modified?: Maybe<Scalars['Timestamp']['output']>;
  user_email: Scalars['String']['output'];
  user_fname: Scalars['String']['output'];
  user_id: Scalars['Int']['output'];
  user_lname: Scalars['String']['output'];
  user_loc_cell?: Maybe<Scalars['String']['output']>;
  user_loc_fax?: Maybe<Scalars['String']['output']>;
  user_loc_telephone?: Maybe<Scalars['String']['output']>;
  user_notes?: Maybe<Scalars['String']['output']>;
  user_qp_user_id?: Maybe<Scalars['Int']['output']>;
  user_status?: Maybe<Scalars['String']['output']>;
};

export type SuperAdminInput = {
  id: Scalars['Int']['input'];
  superAdmin: Scalars['Boolean']['input'];
};

export type Tags = {
  boardId: Scalars['Int']['output'];
  color: Scalars['String']['output'];
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  mapCardIds?: Maybe<Array<Scalars['Int']['output']>>;
  mapId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  ownerId: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export type TouchPoint = {
  bgColor?: Maybe<Scalars['String']['output']>;
  boardId: Scalars['Int']['output'];
  boxId?: Maybe<Scalars['Int']['output']>;
  columnId: Scalars['Int']['output'];
  commentsCount: Scalars['Int']['output'];
  createdAt: Scalars['Timestamp']['output'];
  customIconId?: Maybe<Scalars['Int']['output']>;
  flippedText?: Maybe<Scalars['String']['output']>;
  iconId?: Maybe<Scalars['String']['output']>;
  iconUrl: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  map: Map;
  mapId: Scalars['Int']['output'];
  note?: Maybe<Note>;
  ownerId?: Maybe<Scalars['Int']['output']>;
  persona?: Maybe<Personas>;
  personaId?: Maybe<Scalars['Int']['output']>;
  rowId: Scalars['Int']['output'];
  stepId?: Maybe<Scalars['Int']['output']>;
  tags?: Maybe<Array<Tags>>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
};

export type TouchPointInputs = {
  bgColor?: InputMaybe<Scalars['String']['input']>;
  customIconId?: InputMaybe<Scalars['Int']['input']>;
  iconId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['StringOrNumberGql']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UnAttachTagInput = {
  cardId: Scalars['Int']['input'];
  cardType: MapCardTypeEnum;
  tagId: Scalars['Int']['input'];
};

export type UnmergeColumnInput = {
  endBoxId: Scalars['Int']['input'];
  endBoxMergeCount: Scalars['Int']['input'];
  endColumnId: Scalars['Int']['input'];
  endStepId: Scalars['Int']['input'];
  startBoxId: Scalars['Int']['input'];
  startBoxMergeCount: Scalars['Int']['input'];
  startColumnId: Scalars['Int']['input'];
  startStepId: Scalars['Int']['input'];
};

export type UnmergeColumnModel = {
  endColumnIsMerged: Scalars['Boolean']['output'];
  endStepIsMerged: Scalars['Boolean']['output'];
  nextColumnMergedCandidateIds: Array<Scalars['Int']['output']>;
  nextColumnUnMergedCandidateIds: Array<Scalars['Int']['output']>;
  startColumnIsMerged: Scalars['Boolean']['output'];
  startStepIsMerged: Scalars['Boolean']['output'];
};

export type UpdateAiJourneyInput = {
  aiModelId: Scalars['Int']['input'];
  attachmentId?: InputMaybe<Scalars['Int']['input']>;
  createOrgIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  deleteOrgIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  prompt?: InputMaybe<Scalars['String']['input']>;
  transcriptPlace: Scalars['Int']['input'];
  universal?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateAttachmentCroppedAreaInput = {
  attachmentId: Scalars['Int']['input'];
  demographicFieldId?: InputMaybe<Scalars['Int']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  personaId?: InputMaybe<Scalars['Int']['input']>;
  width?: InputMaybe<Scalars['Float']['input']>;
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateAttachmentNameInput = {
  attachmentId: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type UpdateAttachmentScaleTypeInput = {
  attachmentId: Scalars['Int']['input'];
  imgScaleType: ImgScaleTypeEnum;
};

export type UpdateAttachmentTouchPointInput = {
  attachmentId: Scalars['Int']['input'];
  customIconId?: InputMaybe<Scalars['Int']['input']>;
  iconId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  newAttachmentId?: InputMaybe<Scalars['Int']['input']>;
  newCustomIconId?: InputMaybe<Scalars['Int']['input']>;
  newIconId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBoardInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  index?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBoxDataInput = {
  attachmentId?: InputMaybe<Scalars['Int']['input']>;
  bgColor?: InputMaybe<Scalars['String']['input']>;
  boxElementId: Scalars['Int']['input'];
  imageId?: InputMaybe<Scalars['Int']['input']>;
  positionInput?: InputMaybe<PositionInput>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateColumnInput = {
  bgColor?: InputMaybe<Scalars['String']['input']>;
  columnId: Scalars['Int']['input'];
  dragColumnId?: InputMaybe<Scalars['Int']['input']>;
  index?: InputMaybe<Scalars['Int']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateColumnStepInput = {
  bgColor?: InputMaybe<Scalars['String']['input']>;
  columnId?: InputMaybe<Scalars['Int']['input']>;
  dragStepId?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
  index?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCommentInput = {
  id: Scalars['Int']['input'];
  text: Scalars['String']['input'];
};

export type UpdateCustomMetricsInput = {
  customMetrics: Array<CustomMetricsInput>;
  deletedCustomMetricsIds: Array<Scalars['Int']['input']>;
};

export type UpdateDataPointsInput = {
  cesPointsInput?: InputMaybe<Array<CesPointInput>>;
  csatPointsInput?: InputMaybe<Array<CsatPointInput>>;
  deleteInput?: InputMaybe<Array<Scalars['Int']['input']>>;
  npsPointsInput?: InputMaybe<Array<NpsPointInput>>;
};

export type UpdateDemographicInfoInput = {
  attachmentId?: InputMaybe<Scalars['Int']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
  isHidden: Scalars['Boolean']['input'];
  key?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<DemographicInfoTypeEnum>;
  value: Scalars['String']['input'];
};

export type UpdateDemographicInfoPositionInput = {
  afterId?: InputMaybe<Scalars['Int']['input']>;
  beforeId?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
  personaId: Scalars['Int']['input'];
};

export type UpdateDemographicInfoPositionModel = {
  success: Scalars['Boolean']['output'];
};

export type UpdateItemFlippedTextInput = {
  itemId: Scalars['Int']['input'];
  rowId: Scalars['Int']['input'];
  text: Scalars['String']['input'];
};

export type UpdateItemsInput = {
  data: Array<Scalars['JSONObject']['input']>;
  whiteboardId: Scalars['Int']['input'];
  zIndex?: InputMaybe<ZIndexModel>;
};

export type UpdateJourneyMapInput = {
  index?: InputMaybe<Scalars['Int']['input']>;
  mapId: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLayerInput = {
  columnSelectedStepIds: Scalars['JSON']['input'];
  columnsChange?: InputMaybe<IdsInput>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  rowsChange?: InputMaybe<IdsInput>;
  tagIds: Array<Scalars['Int']['input']>;
};

export type UpdateLinkBgColor = {
  bgColor: Scalars['String']['input'];
  linkId: Scalars['Int']['input'];
};

export type UpdateMapVersionInput = {
  versionId: Scalars['Int']['input'];
  versionName: Scalars['String']['input'];
};

export type UpdateMetricsInput = {
  customData?: InputMaybe<CustomDataInput>;
  dateRange?: InputMaybe<MetricsDateRangeEnum>;
  description?: InputMaybe<Scalars['String']['input']>;
  descriptionEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  endDate?: InputMaybe<Scalars['Timestamp']['input']>;
  goal?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  positionInput?: InputMaybe<PositionInput>;
  questionId?: InputMaybe<Scalars['Int']['input']>;
  source?: InputMaybe<MetricsSourceEnum>;
  startDate?: InputMaybe<Scalars['Timestamp']['input']>;
  surveyId?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<MetricsTypeEnum>;
  value?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateOutcomeColumnInput = {
  columnId?: InputMaybe<Scalars['Int']['input']>;
  rowId?: InputMaybe<Scalars['Int']['input']>;
  stepId: Scalars['Int']['input'];
};

export type UpdateOutcomeInput = {
  bgColor?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  personaId?: InputMaybe<Scalars['Int']['input']>;
  positionInput?: InputMaybe<UpdateOutcomePositionInput>;
  status?: InputMaybe<OutcomeStatusEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOutcomePositionInput = {
  index?: InputMaybe<Scalars['Int']['input']>;
  mapId?: InputMaybe<Scalars['Int']['input']>;
  positionChange?: InputMaybe<UpdateOutcomeColumnInput>;
};

export type UpdatePersonaGroupInput = {
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type UpdatePersonaInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  personaId: Scalars['Int']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePersonaSection = {
  color?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  h?: InputMaybe<Scalars['Int']['input']>;
  i?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  isHidden?: InputMaybe<Scalars['Boolean']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  w?: InputMaybe<Scalars['Int']['input']>;
  x?: InputMaybe<Scalars['Int']['input']>;
  y?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdatePersonaSectionInput = {
  updatePersonaSection: Array<UpdatePersonaSection>;
};

export type UpdatePersonaStateInput = {
  personaId: Scalars['Int']['input'];
  rowId: Scalars['Int']['input'];
  state: PersonaStateEnum;
  stepId: Scalars['Int']['input'];
};

export type UpdateRowInput = {
  index?: InputMaybe<Scalars['Int']['input']>;
  isCollapsed?: InputMaybe<Scalars['Boolean']['input']>;
  isLocked?: InputMaybe<Scalars['Boolean']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['Int']['input'];
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateTextRowInput = {
  columnId: Scalars['Int']['input'];
  rowId: Scalars['Int']['input'];
  stepId: Scalars['Int']['input'];
  text: Scalars['String']['input'];
};

export type UpdateTouchPointInput = {
  bgColor?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  positionInput?: InputMaybe<PositionInput>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateWhiteboardInput = {
  canvasId?: InputMaybe<Scalars['Int']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  folderId?: InputMaybe<Scalars['Int']['input']>;
  helpLink?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  isLocked?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateWhiteboardUserInput = {
  mouseEventsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  permission?: InputMaybe<WhiteboardPermissionEnum>;
  userId: Scalars['Int']['input'];
  whiteboardId: Scalars['Int']['input'];
};

export type UpdateWorkspaceOutcomeInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  outcomeGroupId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<OutcomeStatusEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  accountLanguage: LanguagesEnum;
  apiToken: Scalars['String']['output'];
  businessType?: Maybe<Array<KeyValue>>;
  debugMode?: Maybe<Scalars['Boolean']['output']>;
  defaultProductUponLogin: Scalars['String']['output'];
  emailAddress: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  initials: Scalars['String']['output'];
  isAdmin: Scalars['Boolean']['output'];
  isPartner: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  lastVisitedWorkspaceId?: Maybe<Scalars['Int']['output']>;
  orgID: Scalars['Int']['output'];
  orgLanguage: LanguagesEnum;
  primaryUserAPIKey: Scalars['String']['output'];
  profilePic: Scalars['String']['output'];
  superAdmin: Scalars['Boolean']['output'];
  userAPIKey: Scalars['String']['output'];
  userID: Scalars['Int']['output'];
};

export enum UserActionEnum {
  Edit = 'EDIT',
  Owner = 'OWNER',
  View = 'VIEW',
}

export type Whiteboard = {
  canvas?: Maybe<Whiteboard>;
  canvasId?: Maybe<Scalars['Int']['output']>;
  color: Scalars['String']['output'];
  createdAt: Scalars['Timestamp']['output'];
  description: Scalars['String']['output'];
  folderId: Scalars['Int']['output'];
  helpLink?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  isLocked: Scalars['Boolean']['output'];
  items?: Maybe<Array<WhiteboardDataItem>>;
  name: Scalars['String']['output'];
  owner?: Maybe<Member>;
  ownerId: Scalars['Int']['output'];
  sharingPolicy: SharingPolicyEnum;
  type: WhiteboardTypeEnum;
  updatedAt: Scalars['Timestamp']['output'];
  workspaceId: Scalars['Int']['output'];
};

export type WhiteboardDataItem = {
  board: Whiteboard;
  createdAt: Scalars['Timestamp']['output'];
  data: Scalars['JSONObject']['output'];
  dummy: Scalars['Boolean']['output'];
  file?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  ownerId: Scalars['Int']['output'];
  parentId?: Maybe<Scalars['Int']['output']>;
  selected: Scalars['Boolean']['output'];
  selectedUser?: Maybe<SelectedUser>;
  selectedUserId?: Maybe<Scalars['Int']['output']>;
  type: WhiteboardItemTypeEnum;
  updatedAt: Scalars['Timestamp']['output'];
  uuid: Scalars['String']['output'];
  zIndex?: Maybe<Scalars['Int']['output']>;
};

export type WhiteboardDataItemMap = {
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  mapId: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  uuid: Scalars['String']['output'];
};

export enum WhiteboardItemTypeEnum {
  BoardDataItems = 'BOARD_DATA_ITEMS',
  BottomEllipse = 'BOTTOM_ELLIPSE',
  BottomLeftCircle = 'BOTTOM_LEFT_CIRCLE',
  BottomLeftEllipse = 'BOTTOM_LEFT_ELLIPSE',
  BottomRightCircle = 'BOTTOM_RIGHT_CIRCLE',
  BottomRightEllipse = 'BOTTOM_RIGHT_ELLIPSE',
  Circle = 'CIRCLE',
  Db = 'DB',
  Document = 'DOCUMENT',
  Draw = 'DRAW',
  Ellipse = 'ELLIPSE',
  File = 'FILE',
  Group = 'GROUP',
  Icon = 'ICON',
  Image = 'IMAGE',
  Line = 'LINE',
  Link = 'LINK',
  Note = 'NOTE',
  Pointer = 'POINTER',
  Rect = 'RECT',
  RoundRect = 'ROUND_RECT',
  Smart = 'SMART',
  Star = 'STAR',
  Text = 'TEXT',
  TopEllipse = 'TOP_ELLIPSE',
  TopLeftCircle = 'TOP_LEFT_CIRCLE',
  TopLeftEllipse = 'TOP_LEFT_ELLIPSE',
  TopRightCircle = 'TOP_RIGHT_CIRCLE',
  TopRightEllipse = 'TOP_RIGHT_ELLIPSE',
  Triangle = 'TRIANGLE',
  Video = 'VIDEO',
}

export enum WhiteboardPermissionEnum {
  Editor = 'EDITOR',
  Owner = 'OWNER',
  View = 'VIEW',
}

export enum WhiteboardTypeEnum {
  Canvas = 'CANVAS',
  Whiteboard = 'WHITEBOARD',
}

export enum WhiteboardUpdateZIndexEnum {
  Decrement = 'DECREMENT',
  End = 'END',
  Increment = 'INCREMENT',
  Start = 'START',
}

export type WhiteboardUser = {
  board: Scalars['Int']['output'];
  boardUserType: WhiteboardUserTypeEnum;
  color?: Maybe<Scalars['String']['output']>;
  confirmed?: Maybe<Scalars['Boolean']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  id: Scalars['Int']['output'];
  mouseEventsEnabled: Scalars['Boolean']['output'];
  noteColor?: Maybe<Scalars['String']['output']>;
  permission: WhiteboardPermissionEnum;
  updatedAt: Scalars['Timestamp']['output'];
  userId: Scalars['Int']['output'];
};

export enum WhiteboardUserTypeEnum {
  Guest = 'GUEST',
  Member = 'MEMBER',
  Owner = 'OWNER',
}

export type Workspace = {
  boards: Array<Board>;
  boardsCount?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  defaultFolder: Folder;
  defaultFolderId: Scalars['Int']['output'];
  deletedAt?: Maybe<Scalars['Timestamp']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  feedBackCreationDate?: Maybe<Scalars['Timestamp']['output']>;
  feedbackId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  journeyMapCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['Int']['output'];
  ownerId: Scalars['Int']['output'];
  personaGroup: Array<PersonaGroup>;
  personasCount: Scalars['Int']['output'];
  sortedBoards?: Maybe<Array<Scalars['Int']['output']>>;
  updatedAt: Scalars['Timestamp']['output'];
  userAction?: Maybe<UserActionEnum>;
};

export type WorkspaceBoardResponse = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type WorkspaceResponseModel = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type ZIndexModel = {
  action: WhiteboardUpdateZIndexEnum;
  data: Array<Scalars['String']['input']>;
};

export type Personas = {
  attachment?: Maybe<Attachment>;
  attachmentId?: Maybe<Scalars['Int']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  croppedArea?: Maybe<Position>;
  croppedAreaId?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  isDisabledForThisRow: Scalars['Boolean']['output'];
  isSelected: Scalars['Boolean']['output'];
  journeys: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  personaGroupId: Scalars['Int']['output'];
  personaGroupName: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  workspace: Workspace;
  workspaceId: Scalars['Int']['output'];
  workspaceName: Scalars['String']['output'];
};
