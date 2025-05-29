import { FC, useEffect, useRef } from "react";

import "./style.scss";

import { WuTooltip } from "@npm-questionpro/wick-ui-lib";

import CustomDropDown from "@/Components/Shared/CustomDropDown";
import CustomInput from "@/Components/Shared/CustomInput";
import CustomLongMenu from "@/Components/Shared/CustomLongMenu";
import { PERSONA_GENDER_MENU_ITEMS } from "@/Screens/PersonaScreen/constants.tsx";
import { PersonaDemographicInfoType } from "@/Screens/PersonaScreen/types.ts";
import { MenuOptionsType } from "@/types";
import { MenuViewTypeEnum, PersonaFieldCategoryTypeEnum } from "@/types/enum";

interface IDemographicInfoItem {
  demographicInfo: PersonaDemographicInfoType;
  index: number;
  selectedDemographicInfoId: number | null;
  onHandleChangeDemographicInfo: (
    demographicInfoId: number,
    value: string | boolean,
    key: "key" | "value" | "isHidden",
    categoryType: PersonaFieldCategoryTypeEnum,
  ) => void;
  onHandleRemoveSelectedDemographicInfoId: () => void;
  options: Array<MenuOptionsType>;
}

const DemographicInfoItem: FC<IDemographicInfoItem> = ({
  demographicInfo,
  index,
  selectedDemographicInfoId,
  onHandleChangeDemographicInfo,
  onHandleRemoveSelectedDemographicInfoId,
  options,
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedDemographicInfoId === demographicInfo.id) {
      ref.current?.focus();
    }
  }, [demographicInfo.id, selectedDemographicInfoId]);

  return (
    <div
      className={`demographic-info-item ${demographicInfo.isHidden ? "hidden-demographic-info-item" : ""}`}
      data-testid={`demographic-info-item-${index}-test-id`}
    >
      <div className={"demographic-info-item--key-section"}>
        {demographicInfo.isDefault ? (
          <p className={"demographic-info-item--key-section-content"}>
            {demographicInfo.key}
          </p>
        ) : (
          <div className={"demographic-info-item--options-block"}>
            <CustomInput
              disabled={
                selectedDemographicInfoId !== demographicInfo.id ||
                demographicInfo.isHidden!
              }
              inputRef={ref}
              placeholder={"label"}
              inputType={"secondary"}
              value={demographicInfo.key}
              sxStyles={{
                opacity: demographicInfo.isHidden ? 0.5 : 1,
              }}
              onBlur={onHandleRemoveSelectedDemographicInfoId}
              onChange={(e) =>
                onHandleChangeDemographicInfo(
                  demographicInfo.id,
                  e.target.value,
                  "key",
                  PersonaFieldCategoryTypeEnum.DEMOGRAPHIC_INFO_FIELDS,
                )
              }
            />
          </div>
        )}
        <div className={"demographic-info-item--key-section-actions"}>
          <WuTooltip
            className="wu-tooltip-content"
            content={`${demographicInfo.isHidden ? "Show" : "Hide"} demographic`}
            dir="ltr"
            duration={200}
            position="bottom"
          >
            <button
              onClick={() => {
                onHandleChangeDemographicInfo(
                  demographicInfo.id,
                  !demographicInfo.isHidden,
                  "isHidden",
                  PersonaFieldCategoryTypeEnum.DEMOGRAPHIC_INFO_FIELDS,
                );
              }}
              className={"hide-show-info-button"}
              data-testid={`item-${demographicInfo.id}-hide-show`}
            >
              {demographicInfo.isHidden ? (
                <span
                  className={"wm-eye-tracking"}
                  data-testid={`pin-persona-info-${index}-eye-test-id`}
                />
              ) : (
                <span
                  className={"wm-eye-tracking"}
                  data-testid={`pin-persona-info-${index}-close-eye-test-id`}
                />
              )}
            </button>
          </WuTooltip>
          <CustomLongMenu
            type={MenuViewTypeEnum.VERTICAL}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            item={demographicInfo}
            options={
              !demographicInfo.isDefault
                ? options
                : options.filter((itm) => itm.name !== "Edit")
            }
          />
        </div>
      </div>

      <div className={"demographic-info-item--input"}>
        {demographicInfo.key === "Gender" ? (
          <CustomDropDown
            id={"gender-dropdown"}
            data-testid={`demographic-info-item-${index}-test-id`}
            disabled={demographicInfo.isHidden!}
            menuItems={PERSONA_GENDER_MENU_ITEMS}
            onSelect={(item) => {
              onHandleChangeDemographicInfo(
                demographicInfo.id,
                item.value as string,
                "value",
                PersonaFieldCategoryTypeEnum.DEMOGRAPHIC_INFO_FIELDS,
              );
            }}
            selectItemValue={demographicInfo.value || ""}
            placeholder={"Select"}
          />
        ) : (
          <CustomInput
            disabled={demographicInfo.isHidden!}
            type={demographicInfo.type === "TEXT" ? "text" : "number"}
            placeholder={"type here..."}
            min={0}
            inputRef={inputRef}
            value={demographicInfo.value}
            data-testid={`${demographicInfo.id}-test-id`}
            onChange={(e) => {
              onHandleChangeDemographicInfo(
                demographicInfo.id,
                e.target.value,
                "value",
                PersonaFieldCategoryTypeEnum.DEMOGRAPHIC_INFO_FIELDS,
              );
            }}
            sxStyles={{
              opacity: demographicInfo.isHidden ? 0.5 : 1,
            }}
            onKeyDown={(event) => {
              if (event.keyCode === 13) {
                event.preventDefault();
                (event.target as HTMLElement).blur();
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DemographicInfoItem;
