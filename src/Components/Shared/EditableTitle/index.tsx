import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import "./style.scss";

import { WuTooltip } from "@npm-questionpro/wick-ui-lib";

import { debounced400 } from "@/hooks/useDebounce.ts";
import { EditableInputChangeType, MenuOptionsType } from "@/types";

interface IEditableTitle {
  item: any;
  onHandleUpdate: (data: EditableInputChangeType) => void;
  onHandleDelete: (item: any) => void;
  maxLength?: number;
}

const EDITABLE_INPUT_OPTIONS = ({
  onHandleEdit,
  onHandleDelete,
}: {
  onHandleEdit: (board: BoardType) => void;
  onHandleDelete: (board: BoardType) => void;
}): Array<MenuOptionsType> => {
  return [
    {
      icon: <span />,
      name: "Rename",
      onClick: onHandleEdit,
    },
    {
      icon: <DeleteIcon />,
      name: "Delete",
      onClick: onHandleDelete,
    },
  ];
};

const EditableTitle: FC<IEditableTitle> = ({
  item,
  onHandleUpdate,
  onHandleDelete,
  maxLength,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isTitleEditMode, setIsTitleEditMode] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(item.name);

  const options = useMemo(() => {
    return EDITABLE_INPUT_OPTIONS({
      onHandleEdit: () => {
        setIsTitleEditMode(true);
      },
      onHandleDelete,
    });
  }, [onHandleDelete]);

  const onChangeName = useCallback(
    (title: string) => {
      setInputValue(title);
      debounced400(() => {
        onHandleUpdate({ value: title, id: item?.id });
      });
    },
    [item?.id, onHandleUpdate],
  );

  useEffect(() => {
    if (isTitleEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTitleEditMode]);

  return (
    <WuTooltip content={inputValue}>
      <div className={"editable-input"}>
        {isTitleEditMode ? (
          <>
            <CustomInput
              maxLength={maxLength}
              minLength={1}
              data-testid="board-name-section-test-id"
              style={{
                background: "none",
                borderBottom: "1px solid #1b87e6",
                paddingRight: maxLength ? "3.125rem" : "initial",
              }}
              aria-label={inputValue}
              className={"editable-input-input"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              inputRef={inputRef}
              defaultValue={inputValue}
              onChange={(e) => {
                onChangeName(e?.target?.value);
              }}
              onBlur={() => {
                setIsTitleEditMode(false);
              }}
              onKeyDown={(event) => {
                if (event.keyCode === 13) {
                  event.preventDefault();
                  (event.target as HTMLElement).blur();
                }
              }}
            />
            {maxLength && (
              <span className={"editable-input--max-length"}>
                {inputValue?.length} / {maxLength}
              </span>
            )}
          </>
        ) : (
          <div className={"editable-input--name-option-block"}>
            <p className={"editable-input--name"}>{inputValue}</p>
            <div className={"editable-input--menu"}>
              <CustomLongMenu
                type={menuViewTypeEnum.VERTICAL}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                item={item}
                options={options}
                sxStyles={{
                  display: "inline-block",
                  background: "transparent",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </WuTooltip>
  );
};

export default EditableTitle;
