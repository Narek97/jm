import { FC, useCallback, useEffect, useRef, useState } from 'react';

import './style.scss';
import { FormControl, InputLabel, ListSubheader, MenuItem, SelectProps } from '@mui/material';
import Select from '@mui/material/Select';

import { DropdownSelectItemType, DropdownWithCategorySelectItemType } from '@/types';
import { getPageContentByKey } from '@/utils/getPageContentByKey.ts';

interface ICustomDropDown extends Pick<SelectProps, 'open' | 'onOpen' | 'onClose' | 'disabled'> {
  id?: string;
  dropdownType?: string;
  menuItems: Array<DropdownSelectItemType> | Array<DropdownWithCategorySelectItemType>;
  onSelect?: (item: DropdownSelectItemType) => void;
  selectItemValue?: string;
  sxStyles?: any;
  menuSx?: any;
  formSx?: any;
  placeholder?: string;
  defaultValue?: string;
  onScroll?: any;
  onChange?: any;
  name?: string;
}

const CustomDropDown: FC<ICustomDropDown> = ({
  id,
  onChange,
  dropdownType = 'default',
  name = 'custom',
  menuItems,
  selectItemValue = '',
  onSelect,
  sxStyles,
  menuSx,
  formSx,
  placeholder,
  defaultValue,
  onScroll = () => {},
  ...selectRestParams
}) => {
  const [value, setValue] = useState<string>(defaultValue || '');
  const childRef = useRef<HTMLUListElement>(null);

  const onSelectChange = useCallback(
    (item: any) => {
      setValue(item.value);
      if (onSelect) {
        onSelect(item);
      }
    },
    [setValue, onSelect],
  );

  useEffect(() => {
    if (selectItemValue) {
      setValue(selectItemValue as string);
    }
  }, [selectItemValue]);

  return (
    <FormControl
      className={'custom-dropdown'}
      variant="standard"
      id={`${id ? '-' : ''}dropdown-menu`}
      sx={{
        width: '100%',
        backgroundColor: '#ffffff',
        fontSize: '0.875rem',
        borderBottom: '0.0625rem solid #D8D8D8',
        ...formSx,
      }}>
      <InputLabel
        sx={{
          top: '-0.6875rem',
        }}>
        {placeholder && !value && <div className={'select-placeholder'}>{placeholder}</div>}
      </InputLabel>
      <Select
        {...selectRestParams}
        defaultValue={selectItemValue}
        ref={childRef}
        onChange={onChange}
        data-testid={`${name}-dropdown-test-id`}
        labelId={`${id || 'demo-simple-select-standard'}-label`}
        id={`${id || 'demo-simple-select-standard'}`}
        value={menuItems.length ? value : ''}
        sx={{
          '&:after': { borderBottom: '0' },
          '& .MuiSelect-select:focus': {
            backgroundColor: 'transparent',
          },
          fontWeight: 300,
          marginTop: '0 !important',
          ...sxStyles,
        }}
        MenuProps={{
          PaperProps: {
            onScroll: onScroll,
            sx: {
              borderRadius: 0,
              maxHeight: '10rem',
              maxWidth: '6.25rem',
              ...menuSx,
            },
          },
        }}>
        {menuItems.length > 0 ? (
          getPageContentByKey({
            content: {
              default: menuItems.map((menuItem: any, key) => {
                return (
                  <MenuItem
                    value={menuItem.value}
                    key={key}
                    className={'custom-dropdown--menu-item'}
                    sx={{
                      color: '#545e6b',
                      fontSize: '0.75rem',
                      padding: '0.5rem',
                      minHeight: 'auto',
                      fontWeight: 300,
                      '&:hover': {
                        backgroundColor: '#deebf7',
                      },
                    }}
                    data-testid={`${
                      menuItem.name?.toLowerCase() || menuItem.label?.toLowerCase()
                    }-item-test-id`}
                    onClick={() => onSelectChange(menuItem)}>
                    {menuItem.name?.trim() || menuItem.label?.trim() || 'Untitled'}
                  </MenuItem>
                );
              }),
              withCategories: menuItems?.map((item: any) => [
                <ListSubheader
                  key={item?.id}
                  sx={{
                    backgroundColor: '#F2F2F4',
                    lineHeight: '2.125rem',
                  }}>
                  {item.headerTitle}
                </ListSubheader>,
                item?.group?.map((menuItem: DropdownSelectItemType) => (
                  <MenuItem
                    value={menuItem?.value || ''}
                    key={menuItem?.value}
                    className={'custom-dropdown--menu-item'}
                    sx={{
                      color: '#545e6b',
                      fontSize: '0.75rem',
                      padding: '0.5rem 0.5rem 0.5rem 1.75rem',
                      fontWeight: 300,
                      '&:hover': {
                        backgroundColor: '#deebf7',
                      },
                    }}
                    onClick={() => onSelectChange(menuItem)}>
                    {(menuItem.name as string)?.trim() || 'Untitled'}
                  </MenuItem>
                )),
              ]),
            },
            key: dropdownType,
            defaultPage: <div />,
          })
        ) : (
          <MenuItem
            disabled={true}
            value={''}
            className={'custom-dropdown--menu-item'}
            sx={{
              color: '#545e6b',
              fontSize: '0.75rem',
              padding: '0.5rem',
              fontWeight: 300,
            }}>
            No data yet
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default CustomDropDown;
