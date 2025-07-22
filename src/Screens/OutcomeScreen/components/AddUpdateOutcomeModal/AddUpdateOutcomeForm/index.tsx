import React, { ChangeEvent, FC, memo, useCallback, useEffect, useState } from 'react';

import './style.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import {
  GetMapColumnsForOutcomeQuery,
  useInfiniteGetMapColumnsForOutcomeQuery,
} from '@/api/infinite-queries/generated/getMapColumnsForOutcome.generated.ts';
import {
  GetMapPersonasForOutcomeQuery,
  useInfiniteGetMapPersonasForOutcomeQuery,
} from '@/api/infinite-queries/generated/getMapPersonasForOutcome.generated';
import {
  GetWorkspaceMapsQuery,
  useInfiniteGetWorkspaceMapsQuery,
} from '@/api/infinite-queries/generated/getWorkspaceMaps.generated.ts';
import {
  CreateUpdateOutcomeMutation,
  useCreateUpdateOutcomeMutation,
} from '@/api/mutations/generated/createUpdateOutcome.generated.ts';
import {
  GetColumnStepsQuery,
  useGetColumnStepsQuery,
} from '@/api/queries/generated/getColumnSteps.generated.ts';
import { OutcomeStatusEnum } from '@/api/types.ts';
import CustomDropDown from '@/Components/Shared/CustomDropDown';
import CustomInput from '@/Components/Shared/CustomInput';
import { WORKSPACE_MAPS_LIMIT } from '@/Constants/pagination.ts';
import { OutcomeType } from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/Outcomes/types.ts';
import { OUTCOME_VALIDATION_SCHEMA } from '@/Screens/OutcomeScreen/constants';
import { OutcomeFormType, OutcomeGroupOutcomeType } from '@/Screens/OutcomeScreen/types.ts';
import { useJourneyMapStore } from '@/Store/journeyMap.ts';
import { useUserStore } from '@/Store/user.ts';
import { DropdownSelectItemType, ObjectKeysType } from '@/types';
import { OutcomeLevelEnum } from '@/types/enum';

interface IAddUpdateOutcomeFormType {
  workspaceId: number;
  outcomeGroupId: number;
  defaultMapId: number | null;
  level: OutcomeLevelEnum;
  selectedOutcome: OutcomeGroupOutcomeType | OutcomeType | null;
  selectedColumnStepId?: {
    columnId: number;
    stepId: number;
  } | null;
  create: (data: OutcomeGroupOutcomeType) => void;
  update: (data: OutcomeGroupOutcomeType) => void;
  handleClose: () => void;
  handleChangeIsLoading?: () => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

const defaultPersonaOption = { id: 0, name: 'Overview', value: 'Overview' };

const AddUpdateOutcomeForm: FC<IAddUpdateOutcomeFormType> = memo(
  ({
    workspaceId,
    outcomeGroupId,
    defaultMapId,
    level,
    selectedOutcome,
    selectedColumnStepId,
    create,
    update,
    handleChangeIsLoading,
    formRef,
  }) => {
    const { user } = useUserStore();
    const { showToast } = useWuShowToast();

    const { selectedJourneyMapPersona } = useJourneyMapStore();

    const [currentColumnId, setCurrentColumnId] = useState<number | null>(
      selectedOutcome?.columnId || selectedColumnStepId?.columnId || null,
    );
    const [selectedMapId, setSelectedMapId] = useState<number | null>(defaultMapId);
    const [maps, setMaps] = useState<DropdownSelectItemType[]>([]);
    const [stages, setStages] = useState<DropdownSelectItemType[]>([]);
    const [steps, setSteps] = useState<DropdownSelectItemType[]>([]);
    const [personas, setPersonas] = useState<DropdownSelectItemType[]>([defaultPersonaOption]);

    const {
      handleSubmit,
      setValue,
      control,
      formState: { errors },
    } = useForm<OutcomeFormType>({
      resolver: yupResolver(OUTCOME_VALIDATION_SCHEMA),
      defaultValues: {
        name: selectedOutcome?.title || '',
        description: selectedOutcome?.description || '',
        map: defaultMapId,
        stage: selectedOutcome?.columnId || selectedColumnStepId?.columnId,
        step: selectedOutcome?.stepId || selectedColumnStepId?.stepId,
        persona: selectedOutcome?.personaId || selectedJourneyMapPersona?.id,
      },
    });

    const {
      data: dataMaps,
      isLoading: isLoadingMaps,
      isFetchingNextPage: isFetchingNextPageMaps,
      fetchNextPage: fetchNextPageGetMaps,
    } = useInfiniteGetWorkspaceMapsQuery<{ pages: Array<GetWorkspaceMapsQuery> }, Error>(
      {
        getWorkspaceMapsInput: {
          workspaceId,
          outcomeId: selectedOutcome?.id || null,
          limit: WORKSPACE_MAPS_LIMIT,
          offset: 0,
        },
      },
      {
        staleTime: 0,
        enabled: !!workspaceId,
        getNextPageParam: function (
          lastPage: GetWorkspaceMapsQuery,
          allPages: GetWorkspaceMapsQuery[],
        ) {
          return lastPage.getWorkspaceMaps.maps.length < WORKSPACE_MAPS_LIMIT
            ? undefined
            : allPages.length;
        },
        initialPageParam: 0,
      },
    );

    const { mutate: creatUpdateOutcome } = useCreateUpdateOutcomeMutation<
      Error,
      CreateUpdateOutcomeMutation
    >();

    const {
      data: dataStages,
      isLoading: isLoadingStages,
      isFetchingNextPage: isFetchingNextPageStages,
      fetchNextPage: fetchNextStages,
    } = useInfiniteGetMapColumnsForOutcomeQuery<
      { pages: Array<GetMapColumnsForOutcomeQuery> },
      Error
    >(
      {
        getMapColumnsForOutcomeInput: {
          mapId: selectedMapId!,
          limit: WORKSPACE_MAPS_LIMIT,
          outcomeId: selectedOutcome?.id || null,
          offset: 0,
        },
      },
      {
        enabled: !!selectedMapId,
        staleTime: 0,
        getNextPageParam: function (
          lastPage: GetMapColumnsForOutcomeQuery,
          allPages: GetMapColumnsForOutcomeQuery[],
        ) {
          return lastPage.getMapColumnsForOutcome.columns.length < WORKSPACE_MAPS_LIMIT
            ? undefined
            : allPages.length;
        },
        initialPageParam: 0,
      },
    );

    const {
      data: dataMapPersonas,
      isLoading: isLoadingMapPersonas,
      isFetchingNextPage: isFetchingNextPageMapPersonas,
      fetchNextPage: fetchNextMapPersonas,
    } = useInfiniteGetMapPersonasForOutcomeQuery<
      { pages: Array<GetMapPersonasForOutcomeQuery> },
      Error
    >(
      {
        getMapPersonasInput: {
          mapId: selectedMapId!,
          limit: WORKSPACE_MAPS_LIMIT,
          offset: 0,
        },
      },
      {
        enabled: !!selectedMapId,
        staleTime: 0,
        getNextPageParam: function (
          lastPage: GetMapPersonasForOutcomeQuery,
          allPages: GetMapPersonasForOutcomeQuery[],
        ) {
          return lastPage.getMapPersonasForOutcome.personas.length < WORKSPACE_MAPS_LIMIT
            ? undefined
            : allPages.length;
        },
        initialPageParam: undefined,
      },
    );

    const { data: dataSteps } = useGetColumnStepsQuery<GetColumnStepsQuery, Error>(
      {
        columnId: currentColumnId!,
      },
      {
        enabled: !!currentColumnId,
        staleTime: 0,
      },
    );

    const onHandleFetchStages = useCallback(
      (e: React.UIEvent<HTMLElement>) => {
        const bottom =
          e.currentTarget.scrollHeight <=
          e.currentTarget.scrollTop + e.currentTarget.clientHeight + 1;
        if (bottom && !isFetchingNextPageStages && !isLoadingStages) {
          fetchNextStages().then();
        }
      },
      [fetchNextStages, isFetchingNextPageStages, isLoadingStages],
    );

    const onHandleFetch = async (e: React.UIEvent<HTMLElement>) => {
      const bottom =
        e.currentTarget.scrollHeight <=
        e.currentTarget.scrollTop + e.currentTarget.clientHeight + 1;

      if (bottom && !isFetchingNextPageMaps && !isLoadingMaps) {
        await fetchNextPageGetMaps();
      }
    };

    const onHandleFetchPersonas = async (e: React.UIEvent<HTMLElement>) => {
      const bottom =
        e.currentTarget.scrollHeight <=
        e.currentTarget.scrollTop + e.currentTarget.clientHeight + 1;

      if (bottom && !isFetchingNextPageMapPersonas && !isLoadingMapPersonas) {
        await fetchNextMapPersonas();
      }
    };
    const onHandleSaveOutcome: SubmitHandler<OutcomeFormType> = useCallback(
      formNewData => {
        const { stage: stageId, map: mapId, step: stepId, persona: personaId } = formNewData;

        let requestData: ObjectKeysType = {
          title: formNewData.name,
          personaId: personaId ? +personaId : null,
          description: formNewData.description || '',
        };

        if (selectedOutcome) {
          requestData.id = selectedOutcome?.id;
          if (mapId) {
            type positionInputType = {
              mapId?: number;
              index?: number;
            };

            type columnOrStepChangeType = {
              columnId?: number;
              stepId?: number;
            };
            requestData.positionInput = {} as positionInputType;
            const columnOrStepChange: columnOrStepChangeType = {};

            if (+mapId !== defaultMapId) {
              (requestData.positionInput as positionInputType).mapId = +mapId!;
              columnOrStepChange.columnId = +stageId!;
              columnOrStepChange.stepId = +stepId!;
            } else if (stageId && stageId !== selectedOutcome?.columnId) {
              columnOrStepChange.columnId = +stageId!;
              columnOrStepChange.stepId = +stepId!;
            } else if (stepId && stepId !== selectedOutcome?.stepId) {
              columnOrStepChange.stepId = +stepId!;
            }
            if (Object.keys(columnOrStepChange).length) {
              (
                requestData.positionInput as {
                  positionChange?: columnOrStepChangeType;
                }
              ).positionChange = columnOrStepChange;
            }
          }
        } else {
          // CREATE MODE
          if (mapId) {
            requestData.positionInput = {
              mapId: +mapId!,
              columnId: +stageId!,
              stepId: +stepId!,
            };
          }

          requestData = {
            ...requestData,
            outcomeGroupId,
            workspaceId,
            personaId: personaId ? +personaId : selectedJourneyMapPersona?.id || null,
          };
        }
        if (handleChangeIsLoading) {
          handleChangeIsLoading();
        }
        creatUpdateOutcome(
          {
            createUpdateOutcomeInput: {
              [selectedOutcome ? 'updateOutcomeInput' : 'createOutcomeInput']: requestData,
            },
          },
          {
            onSuccess: response => {
              if (handleChangeIsLoading) {
                handleChangeIsLoading();
              }
              if (selectedOutcome) {
                update({
                  ...response?.createUpdateOutcome,
                  user: {
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                  },
                });
              } else {
                create({
                  ...response?.createUpdateOutcome,

                  user: {
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                  },
                });
              }
              setSelectedMapId(null);
            },
            onError: error => {
              showToast({
                variant: 'error',
                message: error?.message,
              });
            },
          },
        );
      },
      [
        selectedOutcome,
        handleChangeIsLoading,
        creatUpdateOutcome,
        defaultMapId,
        outcomeGroupId,
        workspaceId,
        selectedJourneyMapPersona?.id,
        update,
        user?.firstName,
        user?.lastName,
        create,
        showToast,
      ],
    );

    useEffect(() => {
      if (dataMaps) {
        const mapsData = dataMaps.pages[dataMaps.pages?.length - 1]?.getWorkspaceMaps?.maps.map(
          itm => ({
            id: itm?.id,
            name: itm?.title,
            label: '',
            value: String(itm?.id),
          }),
        );
        setMaps(prev => [...prev, ...mapsData]);
      }
    }, [dataMaps]);

    useEffect(() => {
      if (dataStages) {
        const newData = dataStages.pages[
          dataStages.pages?.length - 1
        ]?.getMapColumnsForOutcome?.columns?.map((itm: any) => ({
          id: itm?.id,
          name: itm?.label,
          value: String(itm?.id),
        }));

        setStages(prev => [...prev, ...newData]);
      }
    }, [dataStages]);

    useEffect(() => {
      if (dataMapPersonas) {
        const newData = dataMapPersonas.pages[
          dataMapPersonas.pages?.length - 1
        ]?.getMapPersonasForOutcome?.personas?.map((itm: any) => ({
          id: itm?.id,
          name: itm?.name,
          value: String(itm?.id),
        }));
        setPersonas(prev => [...prev, ...newData]);
      }
    }, [dataMapPersonas]);

    useEffect(() => {
      if (dataSteps) {
        setSteps(
          dataSteps.getColumnSteps?.map(itm => ({
            id: itm?.id,
            name: itm?.name,
            value: itm?.id,
          })) || [],
        );
      }
    }, [dataSteps]);

    useEffect(() => {
      if (selectedMapId) {
        setValue('map', selectedMapId);
      }
    }, [selectedMapId, setValue]);

    return (
      <form
        ref={formRef}
        data-testid="add-update-outcome-modal-test-id"
        onSubmit={handleSubmit(onHandleSaveOutcome)}
        className={'add-update-outcome-form'}>
        <div className={'add-update-outcome-form--content'}>
          <div className={'outcome-field'}>
            <div className={'outcome-field--content'}>
              <label className={'element-label'}>Name</label>
              <div className={'element-input'} data-testid="outcome-name-test-id">
                <Controller
                  name={'name'}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <CustomInput
                      inputType={'primary'}
                      id={'outcome-name'}
                      placeholder={'Text here'}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                />
              </div>
            </div>
            <span className={'validation-error'}>{errors?.name?.message}</span>
          </div>
          <div className={'outcome-description'} data-testid="outcome-description-test-id">
            <label className={'element-label'}>Description</label>
            <Controller
              name={'description'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  multiline={true}
                  minRows={4}
                  inputType={'primary'}
                  id={'outcome-description'}
                  placeholder={'Text here'}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
          <div className={'outcome-field'}>
            <div className={'outcome-field--content'}>
              <label className={'element-label'}>Status</label>
              <div className={'read-only-field'}>
                {selectedOutcome?.status || OutcomeStatusEnum.Backlog}
              </div>
            </div>
          </div>
          {level === OutcomeLevelEnum.WORKSPACE && (
            <div className={'outcome-field'}>
              <div className={'outcome-field--content'}>
                <label className={'element-label'}>Maps</label>
                <div className={'element-input'}>
                  <Controller
                    name={'map'}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomDropDown
                        name={'maps'}
                        placeholder={'Select'}
                        onScroll={onHandleFetch}
                        menuItems={maps}
                        onSelect={item => {
                          if (item?.id !== selectedMapId) {
                            setStages([]);
                            setSteps([]);
                            setPersonas([defaultPersonaOption]);
                            setSelectedMapId(item.id);
                            setValue('stage', null);
                          }
                        }}
                        onChange={onChange}
                        selectItemValue={value?.toString() || ''}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          )}
          <div className={'outcome-field'}>
            <div className={'outcome-field--content'}>
              <label className={'element-label'}>Stage</label>
              <div className={'element-input'}>
                <Controller
                  name={'stage'}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <CustomDropDown
                      name={'stages'}
                      placeholder={'Select'}
                      onScroll={onHandleFetchStages}
                      menuItems={stages}
                      onSelect={item => {
                        if (item.id !== currentColumnId) {
                          setValue('step', null);
                          setSteps([]);
                          setCurrentColumnId(item?.id);
                        }
                      }}
                      onChange={onChange}
                      selectItemValue={value?.toString() || ''}
                    />
                  )}
                />
              </div>
            </div>
            {errors?.stage?.message && (
              <span className={'validation-error'}>{errors?.stage?.message}</span>
            )}
          </div>
          <div className={'outcome-field'}>
            <div className={'outcome-field--content'}>
              <label className={'element-label'}>Steps</label>
              <div className={'element-input'}>
                <Controller
                  name={'step'}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <CustomDropDown
                      name={'steps'}
                      placeholder={'Select'}
                      onScroll={onHandleFetch}
                      menuItems={steps}
                      onChange={onChange}
                      selectItemValue={value?.toString()}
                    />
                  )}
                />
              </div>
            </div>
            {errors?.step?.message && (
              <span className={'validation-error'}>{errors?.step?.message}</span>
            )}
          </div>

          <div className={'outcome-field'}>
            <div className={'outcome-field--content'}>
              <label className={'element-label'}>Personas</label>

              <div className={'element-input'}>
                <Controller
                  name={'persona'}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <CustomDropDown
                      placeholder={'Select'}
                      onScroll={onHandleFetchPersonas}
                      menuItems={personas}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        if (e.target.value === 'Overview') {
                          onChange(null);
                        } else {
                          onChange(e.target.value);
                        }
                      }}
                      selectItemValue={value?.toString() || 'Overview'}
                    />
                  )}
                />
              </div>
            </div>
            {errors?.step?.message && (
              <span className={'validation-error'}>{errors?.persona?.message}</span>
            )}
          </div>
        </div>
      </form>
    );
  },
);
export default AddUpdateOutcomeForm;
