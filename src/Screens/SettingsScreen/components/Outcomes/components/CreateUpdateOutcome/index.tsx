import { FC, useCallback, useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import './style.scss';
import { WuButton, WuInput } from '@npm-questionpro/wick-ui-lib';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { OUTCOMES_FORM_ELEMENTS, OUTCOMES_VALIDATION_SCHEMA } from '../../constants';
import PinPersona from '../PinPersona';

import { useOutcomePinBoardsStore } from '@/Store/outcomePinBoards';
import { useOutcomePinnedBoardIdsStore } from '@/Store/outcomePinBoardsIds';
import { CreatUpdateFormGeneralType } from '@/types';

interface ICreateUpdateOutcome {
  formData: {
    id: number;
    name: string;
    pluralName: string;
  } | null;
  isOpenCreateUpdateItem: boolean;
  isLoading: boolean;
  onHandleCreateFunction: (data: CreatUpdateFormGeneralType, reset: () => void) => void;
  onHandleUpdateFunction: (data: CreatUpdateFormGeneralType, reset: () => void) => void;
  onToggleCreateUpdateFunction: () => void;
}

const defaultValues = { name: '', pluralName: '' };

const CreateUpdateOutcome: FC<ICreateUpdateOutcome> = ({
  onHandleCreateFunction,
  formData,
  onHandleUpdateFunction,
  isOpenCreateUpdateItem,
  isLoading,
  onToggleCreateUpdateFunction,
}) => {
  const { outcomePinnedBoardIds } = useOutcomePinnedBoardIdsStore();
  const { setSelectedIdList } = useOutcomePinBoardsStore();

  const [pinnedUnpinnedBoardIds, setPinnedUnpinnedBoardIds] = useState<{
    pinned: number[];
  }>({
    pinned: [],
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<{ name: string; pluralName: string }>({
    resolver: yupResolver(OUTCOMES_VALIDATION_SCHEMA),
    defaultValues,
  });

  const updatePinnedBoardsList = useCallback((data: { pinned: number[] }) => {
    setPinnedUnpinnedBoardIds(data);
  }, []);

  const onSaveOutcome: SubmitHandler<CreatUpdateFormGeneralType> = useCallback(
    data => {
      const savedData = {
        ...data,
        connectBoardIds: pinnedUnpinnedBoardIds.pinned,
      };

      if (formData) {
        if (data.id) {
          const outcomeGroupId = data.id as string;
          const connectBoardIds =
            outcomePinnedBoardIds[outcomeGroupId]?.selected?.filter(
              (id: string) => !outcomePinnedBoardIds[outcomeGroupId].default.includes(id),
            ) || [];
          const disconnectBoardIds =
            outcomePinnedBoardIds[data.id as string]?.default?.filter(
              (id: string) => !outcomePinnedBoardIds[outcomeGroupId].selected.includes(id),
            ) || [];
          onHandleUpdateFunction({ ...savedData, connectBoardIds, disconnectBoardIds }, () =>
            reset(defaultValues),
          );
        }
      } else {
        onHandleCreateFunction(
          {
            ...savedData,
            connectBoardIds: outcomePinnedBoardIds['new']?.selected || [],
          },
          () => reset(defaultValues),
        );
      }
      setSelectedIdList([]);
    },
    [
      formData,
      onHandleCreateFunction,
      onHandleUpdateFunction,
      outcomePinnedBoardIds,
      pinnedUnpinnedBoardIds,
      reset,
      setSelectedIdList,
    ],
  );

  useEffect(() => {
    if (formData) {
      reset(formData);
    }
  }, [formData, reset]);

  return (
    <div className={'create-update-outcome-form-block'}>
      <form
        data-testid="create-update-outcome-form-block-test-id"
        className={`create-update-outcome-form-block--content ${
          isOpenCreateUpdateItem ? 'create-update-outcome-form-block--open-content' : ''
        }`}
        onSubmit={handleSubmit(onSaveOutcome)}>
        {OUTCOMES_FORM_ELEMENTS.map(outcomeElement => (
          <div
            className={'create-update-outcome-form-block--content-input'}
            key={outcomeElement.name}>
            <Controller
              name={outcomeElement.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <WuInput
                  data-testid="create-update-outcome-form-input"
                  className={errors[outcomeElement.name]?.message ? 'create-user--error-input' : ''}
                  maxLength={50}
                  placeholder={outcomeElement.placeholder}
                  id={outcomeElement.name}
                  type={outcomeElement.type}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            {isOpenCreateUpdateItem &&
              outcomeElement?.name &&
              errors[outcomeElement.name]?.message && (
                <span className={'validation-error'}>
                  {(errors && errors[outcomeElement.name]?.message) || ''}
                </span>
              )}
          </div>
        ))}
        <PinPersona updatePinnedBoardsList={updatePinnedBoardsList} outcomeGroupId={formData?.id} />
        <div>
          <WuButton
            data-testid="create-update-item-open-btn-test-id"
            className={`create-update-outcome-form-block--content-save-btn ${
              !isOpenCreateUpdateItem
                ? 'create-update-outcome-form-block--content--closed-mode'
                : ''
            }`}
            type={'submit'}
            loading={isLoading}>
            Save
          </WuButton>
        </div>
      </form>
      {isOpenCreateUpdateItem && (
        <div className={'close-form'}>
          <WuButton
            aria-label={'close-button'}
            className={'close-form--btn'}
            onClick={() => onToggleCreateUpdateFunction()}
            Icon={<span className="wm-close" />}
            variant="iconOnly"
          />
        </div>
      )}
      <WuButton
        data-testid="create-update-item-open-btn-test-id"
        Icon={<span className="wm-add" />}
        iconPosition="left"
        className={`create-update-outcome-form-block--open-btn ${
          isOpenCreateUpdateItem && 'create-update-outcome-form-block--open-btn--closed-mode'
        }`}
        variant="primary"
        onClick={() => {
          onToggleCreateUpdateFunction();
          reset(defaultValues);
        }}>
        Create outcomes
      </WuButton>
    </div>
  );
};

export default CreateUpdateOutcome;
