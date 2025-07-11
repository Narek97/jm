import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import './style.scss';

import { WuTooltip } from '@npm-questionpro/wick-ui-lib';

import CustomInput from '@/Components/Shared/CustomInput';
import CustomLongMenu from '@/Components/Shared/CustomLongMenu';
import { debounced400 } from '@/hooks/useDebounce.ts';
import { EditableInputType, MenuOptionsType } from '@/types';
import { MenuViewTypeEnum } from '@/types/enum.ts';

interface IEditableTitle<T extends { id: string | number; name: string }> {
  item: T;
  onHandleUpdate: (data: EditableInputType) => void;
  onHandleDelete: (data: T) => void;
  maxLength?: number;
}

const EDITABLE_INPUT_OPTIONS = <T extends { id: string | number; name: string }>({
  onHandleEdit,
  onHandleDelete,
}: {
  onHandleEdit: () => void;
  onHandleDelete: (data: T) => void;
}): Array<MenuOptionsType> => {
  return [
    {
      icon: <span className={'wm-edit'} />,
      name: 'Rename',
      onClick: onHandleEdit,
    },
    {
      icon: <span className={'wm-delete'} />,
      name: 'Delete',
      onClick: onHandleDelete,
    },
  ];
};

const EditableTitle: FC<IEditableTitle<any>> = <T extends { id: string | number; name: string }>({
  item,
  onHandleUpdate,
  onHandleDelete,
  maxLength,
}: IEditableTitle<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isTitleEditMode, setIsTitleEditMode] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(item.name);

  const options = useMemo(() => {
    return EDITABLE_INPUT_OPTIONS<T>({
      onHandleEdit: () => {
        setIsTitleEditMode(true);
      },
      onHandleDelete: () => {
        onHandleDelete(item);
      },
    });
  }, [item, onHandleDelete]);

  const onChangeName = useCallback(
    (title: string) => {
      setInputValue(title);
      debounced400(() => {
        onHandleUpdate({ value: title, id: item.id });
      });
    },
    [item.id, onHandleUpdate],
  );

  useEffect(() => {
    if (isTitleEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTitleEditMode]);

  return (
    <div className={'editable-input'}>
      {isTitleEditMode ? (
        <>
          <CustomInput
            maxLength={maxLength}
            minLength={1}
            data-testid="board-name-section-test-id"
            style={{
              background: 'none',
              borderBottom: '1px solid #1b87e6',
              paddingRight: maxLength ? '3.125rem' : 'initial',
            }}
            aria-label={inputValue}
            className={'editable-input-input'}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
            inputRef={inputRef}
            defaultValue={inputValue}
            onChange={e => {
              onChangeName(e?.target?.value);
            }}
            onBlur={() => {
              setIsTitleEditMode(false);
            }}
            onKeyDown={event => {
              if (event.keyCode === 13) {
                event.preventDefault();
                (event.target as HTMLElement).blur();
              }
            }}
          />
          {maxLength && (
            <span className={'editable-input--max-length'}>
              {inputValue?.length} / {maxLength}
            </span>
          )}
        </>
      ) : (
        <div className={'editable-input--name-option-block'}>
          <WuTooltip className={'wu-tooltip-content'} content={inputValue || 'Untitled'}>
            <p className={'editable-input--name'}>{inputValue?.trim() || 'Untitled'}</p>
          </WuTooltip>

          <div className={'editable-input--menu'}>
            <CustomLongMenu
              type={MenuViewTypeEnum.VERTICAL}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              item={item}
              options={options}
              sxStyles={{
                display: 'inline-block',
                background: 'transparent',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableTitle;
