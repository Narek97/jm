import { FC, useEffect, useRef } from 'react';

import { WuButton, WuTooltip } from '@npm-questionpro/wick-ui-lib';

import BaseWuInput from '@/Components/Shared/BaseWuInput';
import BaseWuMenu from '@/Components/Shared/BaseWuMenu';
import BaseWuSelect from '@/Components/Shared/BaseWuSelect';
import { PERSONA_GENDER_MENU_ITEMS } from '@/Screens/PersonaScreen/constants.tsx';
import { DemographicInfoFieldsType } from '@/Screens/PersonaScreen/types.ts';
import { MenuOptionsType } from '@/types';
import { PersonaFieldCategoryTypeEnum } from '@/types/enum';

interface IDemographicInfoItem {
  demographicInfo: DemographicInfoFieldsType;
  index: number;
  selectedDemographicInfoId: number | null;
  onHandleChangeDemographicInfo: (
    demographicInfoId: number,
    value: string | boolean,
    key: 'key' | 'value' | 'isHidden',
    categoryType: PersonaFieldCategoryTypeEnum,
  ) => void;
  onHandleRemoveSelectedDemographicInfoId: () => void;
  options: Array<MenuOptionsType<DemographicInfoFieldsType>>;
}

interface FieldConfig {
  regex: RegExp;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
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

  const fieldConfigs: Record<string, FieldConfig> = {
    Age: {
      regex: /[^0-9]/g,
      minValue: 0,
      maxValue: 100,
    },
    default: {
      regex: /[^a-zA-Z0-9 ]/g,
      maxLength: 1000,
    },
  };

  const isDisable = selectedDemographicInfoId !== demographicInfo.id || demographicInfo.isHidden!;

  useEffect(() => {
    if (selectedDemographicInfoId === demographicInfo.id) {
      ref.current?.focus();
    }
  }, [demographicInfo.id, selectedDemographicInfoId]);

  return (
    <div data-testid={`demographic-info-item-${index}-test-id`} className={'group'}>
      <div className={'opacity-60 w-full min-h-8 flex items-center justify-between gap-4 text-xs'}>
        {demographicInfo.isDefault ? (
          <p>{demographicInfo.key}</p>
        ) : (
          <BaseWuInput
            className={`${isDisable ? 'border-none' : ''}`}
            disabled={isDisable}
            inputRef={ref}
            placeholder={'label'}
            value={demographicInfo.key}
            style={{
              background: 'none',
              opacity: demographicInfo.isHidden ? 0.5 : 1,
            }}
            onBlur={onHandleRemoveSelectedDemographicInfoId}
            onChange={e =>
              onHandleChangeDemographicInfo(
                demographicInfo.id,
                e.target.value,
                'key',
                PersonaFieldCategoryTypeEnum.DEMOGRAPHIC_INFO_FIELDS,
              )
            }
          />
        )}
        <div className={'flex gap-[1rem] invisible group-hover:visible!'}>
          <WuTooltip
            className="wu-tooltip-content"
            content={`${demographicInfo.isHidden ? 'Show' : 'Hide'} demographic`}
            dir="ltr"
            duration={200}
            position="bottom">
            <WuButton
              variant="iconOnly"
              onClick={() => {
                onHandleChangeDemographicInfo(
                  demographicInfo.id,
                  !demographicInfo.isHidden,
                  'isHidden',
                  PersonaFieldCategoryTypeEnum.DEMOGRAPHIC_INFO_FIELDS,
                );
              }}
              className={'hide-show-info-button'}
              data-testid={`item-${demographicInfo.id}-hide-show`}>
              {demographicInfo.isHidden ? (
                <span
                  className={'wm-visibility-off'}
                  data-testid={`pin-persona-info-${index}-eye-test-id`}
                />
              ) : (
                <span
                  className={'wm-visibility'}
                  data-testid={`pin-persona-info-${index}-close-eye-test-id`}
                />
              )}
            </WuButton>
          </WuTooltip>
          <BaseWuMenu
            trigger={
              <WuButton variant="iconOnly">
                <span className={'wm-more-vert cursor-pointer'} />
              </WuButton>
            }
            item={demographicInfo}
            options={
              !demographicInfo.isDefault ? options : options.filter(itm => itm.name !== 'Edit')
            }
          />
        </div>
      </div>

      <div>
        {demographicInfo.key === 'Gender' ? (
          <BaseWuSelect
            name={`gender-${demographicInfo.id}`}
            accessorKey={{
              label: 'name',
              value: 'id',
            }}
            data-testid={`demographic-info-item-${index}-test-id`}
            data={PERSONA_GENDER_MENU_ITEMS}
            disabled={demographicInfo.isHidden}
            onSelect={data => {
              onHandleChangeDemographicInfo(
                demographicInfo.id,
                (data as (typeof PERSONA_GENDER_MENU_ITEMS)[number]).value,
                'value',
                PersonaFieldCategoryTypeEnum.DEMOGRAPHIC_INFO_FIELDS,
              );
            }}
            defaultValue={PERSONA_GENDER_MENU_ITEMS.find(
              gender => gender.value === demographicInfo.value,
            )}
            placeholder={'Select'}
          />
        ) : (
          <BaseWuInput
            disabled={demographicInfo.isHidden!}
            type={demographicInfo.type === 'TEXT' ? 'text' : 'number'}
            placeholder={'type here...'}
            min={0}
            value={demographicInfo.value || ''}
            data-testid={`${demographicInfo.id}-test-id`}
            onChange={e => {
              const config = fieldConfigs[demographicInfo.key] || fieldConfigs.default;
              const value = e.target.value.replace(config.regex, '');

              let isValid = value === '';
              if (config.minValue !== undefined && config.maxValue !== undefined) {
                const numValue = Number(value);
                isValid = isValid || (numValue >= config.minValue && numValue <= config.maxValue);
              } else if (config.maxLength !== undefined) {
                isValid = isValid || value.length <= config.maxLength;
              }

              if (isValid) {
                onHandleChangeDemographicInfo(
                  demographicInfo.id,
                  value,
                  'value',
                  PersonaFieldCategoryTypeEnum.DEMOGRAPHIC_INFO_FIELDS,
                );
              }
            }}
            style={{
              background: 'none',
              opacity: demographicInfo.isHidden ? 0.5 : 1,
            }}
            onKeyDown={event => {
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
