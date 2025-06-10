import React, { FC, memo, useRef, useState } from 'react';

import './style.scss';
import { DraggableProvided } from '@hello-pangea/dnd';
import { WuButton, WuTooltip } from '@npm-questionpro/wick-ui-lib';

import ImageViewAndUpload from './ImageViewAndUpload';

import { DemographicInfoTypeEnum } from '@/api/types';
import CustomInput from '@/Components/Shared/CustomInput';
import PersonaEditor from '@/Components/Shared/Editors/PersonaEditor';
import { debounced400 } from '@/hooks/useDebounce.ts';
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
        className={`field-section ${item?.isHidden ? 'hidden-field' : ''}`}>
        <span className={'field-section--drag'} {...provided.dragHandleProps}>
          <span className={'wm-drag-indicator'} />
        </span>
        <div className={'field-section-header'}>
          <div className={'field-section-header--input'}>
            <CustomInput
              inputRef={ref}
              placeholder={'label'}
              inputType={'secondary'}
              value={item.key}
              disabled={item?.isHidden}
              sxStyles={{
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
          <div className={'field-section-header--options-block'}>
            <WuTooltip
              className="wu-tooltip-content"
              content={`${item.isHidden ? 'Show' : 'Hide'} demographic`}
              dir="ltr"
              duration={200}
              position="bottom">
              <button
                onClick={() => {
                  onHandleChangeDemographicInfo(
                    item.id,
                    !item.isHidden,
                    'isHidden',
                    PersonaFieldCategoryTypeEnum.PERSONA_FIELD_SECTIONS,
                  );
                }}
                className={'hide-show-info-button'}
                data-testid={`item-${item.id}-hide-show`}>
                {item.isHidden ? (
                  <span
                    className={'wm-eye-tracking'}
                    data-testid={`pin-persona-info-${item.id}-${index}-eye-test-id`}
                  />
                ) : (
                  <span
                    className={'wm-eye-tracking'}
                    data-testid={`pin-persona-${item.id}-info-${index}-close-eye-test-id`}
                  />
                )}
              </button>
            </WuTooltip>
            <WuButton
              className={'delete-section'}
              onClick={() => onHandleDeleteDemographicInfoItem(item)}
              Icon={<span className="wm-delete" />}
              variant="iconOnly"
            />
          </div>
        </div>

        {type === DemographicInfoTypeEnum.Content ? (
          <>
            <div
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
            <div className={'filter-section-resize'} onMouseDown={handleMouseDown}>
              <span className={'wm-arrow-back-ios'} />
            </div>
          </>
        ) : (
          <div className={'image-field-section'} onClick={onHandleToggleGalleryModal}>
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
