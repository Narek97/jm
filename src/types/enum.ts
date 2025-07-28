export enum WorkspaceAnalyticsEnumType {
  SMALL = 'SMALL',
  BIG = 'BIG',
}

export enum CopyMapLevelEnum {
  ORG = 'ORG',
  WORKSPACE = 'WORKSPACE',
}

export enum CopyMapLevelTemplateEnum {
  ORGS = 'ORGS',
  WORKSPACES = 'WORKSPACES',
  BOARDS = 'BOARDS',
  MAPS = 'MAPS',
}

export enum MenuItemIconPositionEnum {
  START = 'START',
  END = 'END',
}

export enum OutcomeLevelEnum {
  WORKSPACE = 'WORKSPACE',
  MAP = 'MAP',
}

export enum ImageSizeEnum {
  XSM = 'XSM',
  SM = 'SM',
  MD = 'MD',
  MDS = 'MDS',
  MDL = 'MDL',
  LG = 'LG',
}

export enum PersonaFieldCategoryTypeEnum {
  PERSONA_FIELD_SECTIONS = 'personaFieldSections',
  DEMOGRAPHIC_INFO_FIELDS = 'demographicInfoFields',
}

export enum PersonaTypeEnum {
  Customer = 'CUSTOMER',
  Employee = 'EMPLOYEE',
  Others = 'OTHERS',
}

export enum PersonaGenderEnum {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum JourneyViewTypeEnum {
  STANDARD = 'STANDARD',
  BOARD = 'BOARD',
}
export enum MapCopyLevelEnum {
  ORG = 'ORG',
  WORKSPACE = 'WORKSPACE',
}

export enum SelectedPersonasViewModeEnum {
  MAP = 'MAP',
  SENTIMENT = 'SENTIMENT',
}

export enum JourneyMapRowTypesEnum {
  STEPS = 'STEPS',
  SENTIMENT = 'SENTIMENT',
  DIVIDER = 'DIVIDER',
  PROS = 'PROS',
  CONS = 'CONS',
  INTERACTIONS = 'INTERACTIONS',
  LIST_ITEM = 'LIST_ITEM',
  INSIGHTS = 'INSIGHTS',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  MEDIA = 'MEDIA',
  TOUCHPOINTS = 'TOUCHPOINTS',
  METRICS = 'METRICS',
  OUTCOMES = 'OUTCOMES',
  LINKS = 'LINKS',
}

export enum JourneyMapRowActionEnum {
  BACK_CARD = 'BACK_CARD',
  ROW_LABEL = 'ROW_LABEL',
  ROW_DISABLE = 'ROW_DISABLE',
  ROW_COLLAPSE = 'ROW_COLLAPSE',
  ROW = 'ROW',
  COLUMN_LABEL = 'COLUMN_LABEL',
  COLUMN_BG_COLOR = 'COLUMN_BG_COLOR',
  STEPS_BG_COLOR = 'STEPS_BG_COLOR',
  COLUMN = 'COLUMN',
  BOX_ELEMENT = 'BOX_ELEMENT',
  BOX_TEXT_ELEMENT = 'BOX_TEXT_ELEMENT',
  MERGE_UNMERGE_COLUMNS = 'MERGE_UNMERGE_COLUMNS',
}

export enum ActionsEnum {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DRAG = 'DRAG',
  DELETE = 'DELETE',
  DISABLE = 'DISABLE',
  ENABLE = 'ENABLE',
  MERGE = 'MERGE',
  UNMERGE = 'UNMERGE',
  ADD_MERGE_ID = 'ADD_MERGE_ID',
  DELETE_MERGE_ID = 'DELETE_MERGE_ID',
  'COLOR-CHANGE' = 'COLOR-CHANGE',
  'CREATE-DELETE' = 'CREATE-DELETE',
}

export enum UndoRedoEnum {
  UNDO = 'UNDO',
  REDO = 'REDO',
}

export enum FileTypeEnum {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  MEDIA = 'MEDIA',
}

export enum TouchpointIconsEnum {
  ALL = 'ALL',
  COMMUNICATION = 'COMMUNICATION',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  SALES_MARKETING = 'SALES_MARKETING',
  FINANCE = 'FINANCE',
  RETAIL = 'RETAIL',
  HEALTHCARE = 'HEALTHCARE',
  HUMAN_RESOURCES = 'HUMAN_RESOURCES',
  CUSTOM = 'CUSTOM',
}

export enum CommentEventsEnum {
  JOIN_ITEM_COMMENT_EVENT = 'JOIN_ITEM_COMMENT_EVENT',
  LEAVE_ITEM_COMMENT_EVENT = 'LEAVE_ITEM_COMMENT_EVENT',
  COMMENT_ITEM_EVENT = 'COMMENT_ITEM_EVENT',
}

export enum JourneyMapEventsEnum {
  JOIN_MAP = 'JOIN_MAP',
  LEAVE_MAP = 'LEAVE_MAP',
  REPLACE_MAP_VERSION = 'REPLACE_MAP_VERSION',
}
