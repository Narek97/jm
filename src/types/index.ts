import { ReactNode } from 'react';

import { Attachment, User } from '@/api/types.ts';

export type ObjectKeysType<T = unknown> = {
  [key: string]: T;
};

export type CreatUpdateFormGeneralType = {
  [key: string]: string | number[];
};

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

export type TableRowItemChangeType = {
  id: number | string;
  key: string;
  value: number | string;
};

export type TableColumnOptionType = {
  toggleDeleteModal?: () => void;
  onHandleRowChange?: (item: TableRowItemChangeType) => void;
  onHandleRowDelete?: (item: TableRowItemChangeType) => void;
  onHandleRowClick?: (id: number, key: string) => void;
  checkedItemsCount?: number;
};

export type TableColumnType<T = any> = {
  id: number | string;
  label: string | ReactNode;
  style?: any;
  renderFunction?: (data: T) => ReactNode;
  onClick?: () => void;
  sortFieldName?: string;
  isAscDescSortable?: boolean;
  isNameSortable?: boolean;
  align?: 'right' | 'left' | 'center';
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

export type EditableInputType = { value: string; id: number };

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

export type AttachmentType = Pick<
  Attachment,
  "id" | "key" | "url" | "hasResizedVersions"
> & {
  croppedArea?: CroppedAreaType | null;
};

export type JourneyMapNounProjectIconsType = {
  id: string;
  term: string;
  thumbnail_url: string;
};
