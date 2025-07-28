import { ChangeEvent } from 'react';

import * as yup from 'yup';

import { LinkType } from './types';

import { LinkTypeEnum } from '@/api/types.ts';
import { MenuOptionsType } from '@/types';

const LINK_ITEM_OPTIONS = ({
  onHandleEdit,
  onHandleDelete,
  onHandleChangeBgColor,
  color,
}: {
  onHandleEdit: () => void;
  onHandleDelete: (link?: LinkType) => void;
  onHandleChangeBgColor: (e: ChangeEvent<HTMLInputElement>) => void;
  color?: string;
}): Array<MenuOptionsType<LinkType>> => {
  return [
    {
      icon: <span className={'wm-edit'} />,
      name: 'Edit',
      onClick: onHandleEdit,
    },
    {
      icon: <span className={'wm-delete'} />,
      name: 'Delete',
      onClick: onHandleDelete,
    },
    {
      icon: (
        <>
          <label
            htmlFor="link-color-picker"
            className={'custom-vertical-menu--menu-item-content-icon'}>
            <span className={'wm-colorize'} />
            <input
              data-testid={'color-picker'}
              type={'color'}
              value={color}
              id={'link-color-picker'}
              onChange={onHandleChangeBgColor}
              style={{
                width: 0,
                opacity: 0,
              }}
            />
          </label>
        </>
      ),
      isColorPicker: true,
      name: 'Background',
      label: (
        <label htmlFor="link-color-picker" style={{ height: '2rem', lineHeight: '2rem' }}>
          Background
        </label>
      ),
      onClick: () => {},
    },
  ];
};

const CREATE_LINK_VALIDATION_SCHEMA = yup
  .object()
  .shape({
    type: yup.string().required(''),
    title: yup.string().nullable().default(null),
    linkedMapId: yup
      .number()
      .when('type', {
        is: (value: string) => value === LinkTypeEnum.Journey,
        then: () => yup.number().required('Map is required'),
        otherwise: () => yup.number().nullable().default(null),
      })
      .nullable()
      .default(null),
    url: yup
      .string()
      .when('type', {
        is: (value: string) => value === LinkTypeEnum.External,
        then: () =>
          yup
            .string()
            .matches(/(^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$)/, 'Enter correct url!')
            .required(),
        otherwise: () => yup.string().nullable().default(null),
      })
      .nullable()
      .default(null),
  })
  .required();

export { LINK_ITEM_OPTIONS, CREATE_LINK_VALIDATION_SCHEMA };
