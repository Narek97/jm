import React, { FC, memo, useRef, useState } from 'react';

import { DraggableProvided } from '@hello-pangea/dnd';
import { WuButton, WuTooltip } from '@npm-questionpro/wick-ui-lib';

import ImageViewAndUpload from './ImageViewAndUpload';

import { DemographicInfoTypeEnum } from '@/api/types';
import BaseWuInput from '@/Components/Shared/BaseWuInput';
import PersonaEditor from '@/Components/Shared/Editors/PersonaEditor';
import { debounced400 } from '@/Hooks/useDebounce.ts';
import { PersonaFieldSectionsType } from '@/Screens/PersonaScreen/types.ts';
import { PersonaFieldCategoryTypeEnum } from '@/types/enum.ts';

interface ISectionField {
  item: PersonaFieldSectionsType;
  index: number;
  type: DemographicInfoTypeEnum;
  onHandleChangeDemographicInfo: (
    demographicInfoId: number,
    value: string | boolean | number,
    key: 'key' | 'value' | 'isHidden' | 'height',
    categoryType: PersonaFieldCategoryTypeEnum,
  ) => void;
  onHandleDeleteDemographicInfoItem: (item: PersonaFieldSectionsType) => void;
  onHandleToggleGalleryModal: () => void;
  provided: DraggableProvided;
}

const SectionField: FC<ISectionField> = memo(
  ({
    item,
    index,
    type,
    onHandleChangeDemographicInfo,
    onHandleDeleteDemographicInfoItem,
    onHandleToggleGalleryModal,
    provided,
  }) => {
    const ref = useRef<HTMLInputElement>(null);
    const [height, setHeight] = useState(item?.height || 100);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const startY = e.clientY;
      const startHeight = height;

      const handleMouseMove = (e: MouseEvent) => {
        const newHeight = startHeight + (e.clientY - startY);
        setHeight(Math.max(newHeight, 50)); // Minimum height of 50px
        debounced400(() => {
          onHandleChangeDemographicInfo(
            item.id,
            newHeight,
            'height',
            PersonaFieldCategoryTypeEnum.PERSONA_FIELD_SECTIONS,
          );
        });
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    return (
      <div
        data-testid={`demographic-field-${index}`}
        ref={provided.innerRef}
        {...provided.draggableProps}
        className={`group relative bg-white p-2 rounded-[0.3rem] mb-4 ${item?.isHidden ? 'opacity-60' : ''}`}>
        <span className={'field-section--drag'} {...provided.dragHandleProps}>
          <span className={'wm-drag-indicator'} />
        </span>
        <div className={'relative flex gap-2'}>
          <div className={'w-[calc(100%-5rem)]'}>
            <BaseWuInput
              inputRef={ref}
              placeholder={'label'}
              value={item.key}
              disabled={item?.isHidden}
              style={{
                background: 'none',
                opacity: item.isHidden ? 0.5 : 1,
              }}
              onChange={e =>
                onHandleChangeDemographicInfo(
                  item.id,
                  e.target.value,
                  'key',
                  PersonaFieldCategoryTypeEnum.PERSONA_FIELD_SECTIONS,
                )
              }
            />
          </div>
          <div className={'flex items-center gap-2 ml-2 invisible group-hover:visible!'}>
            <WuTooltip
              className="break-all"
              content={`${item.isHidden ? 'Show' : 'Hide'} demographic`}
              dir="ltr"
              duration={200}
              position="bottom">
              <WuButton
                variant="iconOnly"
                onClick={() => {
                  onHandleChangeDemographicInfo(
                    item.id,
                    !item.isHidden,
                    'isHidden',
                    PersonaFieldCategoryTypeEnum.PERSONA_FIELD_SECTIONS,
                  );
                }}
                data-testid={`item-${item.id}-hide-show`}>
                {item.isHidden ? (
                  <span
                    className={'wm-visibility'}
                    data-testid={`pin-persona-info-${item.id}-${index}-eye-test-id`}
                  />
                ) : (
                  <span
                    className={'wm-visibility-off'}
                    data-testid={`pin-persona-${item.id}-info-${index}-close-eye-test-id`}
                  />
                )}
              </WuButton>
            </WuTooltip>

            <WuButton
              onClick={() => onHandleDeleteDemographicInfoItem(item)}
              Icon={<span className="wm-delete" />}
              variant="iconOnly"
            />
          </div>
        </div>

        {type === DemographicInfoTypeEnum.Content ? (
          <>
            <div
              className={'bg-[#f4f4f4] rounded-[0.2rem] mt-[8px]! p-2'}
              style={{
                height: `${height}px`,
                position: 'relative',
                overflow: 'auto',
              }}>
              <PersonaEditor
                layoutId={'1'}
                disabled={item?.isHidden}
                onHandleTextChange={value => {
                  onHandleChangeDemographicInfo(
                    item.id,
                    value,
                    'value',
                    PersonaFieldCategoryTypeEnum.PERSONA_FIELD_SECTIONS,
                  );
                }}
                initValue={item.value || ''}
                customClass={'persona-editor-block'}
              />
            </div>
            <div
              className={
                'cursor-ns-resize absolute right-[0] bottom-[-2px] w-fit h-fit z-20 rotate-[225deg]'
              }
              onMouseDown={handleMouseDown}>
              <span className={'wm-arrow-back-ios'} />
            </div>
          </>
        ) : (
          <div className={'bg-[#f4f4f4] rounded-[0.2rem] mt-[8px]! h-[288px]'} onClick={onHandleToggleGalleryModal}>
            <ImageViewAndUpload
              hasResizedVersions={false}
              croppedArea={null}
              avatarKey={
                item?.attachment ? `${item?.attachment?.url}/large${item?.attachment?.key}` : ''
              }
              onlyView={false}
            />
          </div>
        )}
      </div>
    );
  },
);

export default SectionField;
