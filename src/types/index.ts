import { ReactNode } from 'react';

import { Attachment, CommentAndNoteModelsEnum, User } from '@/api/types.ts';

export type ObjectKeysType<T = any> = {
  [key: string]: T;
};

export type CreatUpdateFormGeneralType = {
  [key: string]: string | number[];
};

export type ErrorWithStatus = Error & { status?: number };

export type UserType = User & {
  isHavePermission: boolean | null;
};

export type TabType = {
  label: string | ReactNode;
  value: string;
};

export type TabPanelType = {
  page: ReactNode;
  value: string;
};

export type TableColumnOptionType<T = unknown> = {
  onHandleRowEdit?: (item: T) => void;
  onHandleRowDelete?: (item?: T) => void;
  onHandleRowClick?: (item: T) => void;
  onHandleCopy?: (item: T) => void;
  onHandleCopyShareUrl?: (item: T) => void;
  onHandleRowChange?: (item: T, value: string | number, key: string) => void;
};

export type MenuOptionsType = {
  id?: number;
  icon?: ReactNode;
  children?: ReactNode;
  label?: ReactNode;
  name?: any;
  isSubOption?: boolean;
  disabled?: boolean;
  isFileUpload?: boolean;
  isColorPicker?: boolean;
  onClick?: (item?: any) => void;
};

export type SearchParamsType = {
  tab?: string;
};

export type DropdownMultiSelectItemType = {
  id: number;
  name: string;
  value: string | number;
};

export type DropdownSelectItemType = {
  id: number;
  name?: string | ReactNode;
  label?: string;
  value: string | number | null;
};

export type DropdownWithCategorySelectItemType = {
  id?: number;
  headerTitle?: string | ReactNode;
  group: DropdownSelectItemType[];
};

export type EditableInputType = { value: string; id: number | string };

export type PersonaImageBoxType = {
  color: string;
  isSelected?: boolean;
  attachment: AttachmentType;
};

export type CroppedAreaType = {
  width?: number | null;
  height?: number | null;
  x?: number | null;
  y?: number | null;
};

// todo
export type AttachmentType = Pick<
  Attachment,
  'id' | 'key' | 'url' | 'name' | 'hasResizedVersions'
> & {
  croppedArea?: CroppedAreaType | null;
  uuid?: string;
  type?: string;
};

export type JourneyMapNounProjectIconsType = {
  id: string;
  term: string;
  thumbnail_url: string;
};

export type NotesAndCommentsDrawerType = {
  title: string;
  isOpen: boolean;
  itemId: number | null;
  type: CommentAndNoteModelsEnum | null;
  url?: string;
  rowId?: number;
  columnId?: number;
  stepId?: number | null;
};

export type FileTypeConfigType = {
  accept: string;
  extensions: string[];
};

export type NoteType = {
  id: number;
  text: string;
  itemId: number;
  updatedAt: any;
  owner: {
    color?: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
  };
};

export type SortType = {
  id: string;
  desc: boolean;
};
