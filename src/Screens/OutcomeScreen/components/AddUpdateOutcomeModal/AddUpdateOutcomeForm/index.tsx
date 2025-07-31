import React, { FC, memo, useCallback, useEffect, useState } from 'react';

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
import BaseWuInput from '@/Components/Shared/BaseWuInput';
import BaseWuSelect from '@/Components/Shared/BaseWuSelect';
import BaseWuTextarea from '@/Components/Shared/BaseWuTextarea';
import { WORKSPACE_MAPS_LIMIT } from '@/Constants/pagination.ts';
import { OutcomeType } from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/Outcomes/types.ts';
import { OUTCOME_VALIDATION_SCHEMA } from '@/Screens/OutcomeScreen/constants';
import {
  ColumnStepsType,
  MapColumnsForOutcomeType,
  MapPersonasForOutcomeType,
  OutcomeFormType,
  OutcomeGroupOutcomeType,
  WorkspaceMapsType,
} from '@/Screens/OutcomeScreen/types.ts';
import { useJourneyMapStore } from '@/Store/journeyMap.ts';
import { useUserStore } from '@/Store/user.ts';
import { ObjectKeysType } from '@/types';
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
    const [maps, setMaps] = useState<WorkspaceMapsType[]>([]);
    const [stages, setStages] = useState<MapColumnsForOutcomeType[]>([]);
    const [steps, setSteps] = useState<ColumnStepsType[]>([]);
    const [personas, setPersonas] = useState<MapPersonasForOutcomeType[]>([defaultPersonaOption]);

    const {
      handleSubmit,
      setValue,
      control,
      watch,
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

    const selectedMapIdWatch = watch('map');
    const selectedStageIdWatch = watch('stage');

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

    const onHandleFetchSteps = async (e: React.UIEvent<HTMLElement>) => {
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
        const mapsData = dataMaps.pages[dataMaps.pages?.length - 1]?.getWorkspaceMaps.maps.map(
          m => {
            return {
              id: m?.id,
              title: m?.title || 'Untitled',
            };
          },
        );
        setMaps(prev => [...prev, ...mapsData]);
      }
    }, [dataMaps]);

    useEffect(() => {
      if (dataStages) {
        const newData =
          dataStages.pages[dataStages.pages?.length - 1]?.getMapColumnsForOutcome?.columns;

        setStages(prev => [...prev, ...newData]);
      }
    }, [dataStages]);

    useEffect(() => {
      if (dataMapPersonas) {
        const newData =
          dataMapPersonas.pages[dataMapPersonas.pages?.length - 1]?.getMapPersonasForOutcome
            ?.personas;
        setPersonas(prev => [...prev, ...newData]);
      }
    }, [dataMapPersonas]);

    useEffect(() => {
      if (dataSteps) {
        setSteps(dataSteps.getColumnSteps || []);
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
        <div className={'flex flex-col gap-[1.125rem]'}>
          <div>
            <label className="text-[0.75rem]">Name</label>
            <div data-testid="outcome-name-test-id">
              <Controller
                name={'name'}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <BaseWuInput
                    id={'outcome-name'}
                    placeholder={'Text here'}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </div>
            <span className={'validation-error'}>{errors?.name?.message}</span>
          </div>
          <div data-testid="outcome-description-test-id">
            <label className="text-[0.75rem]">Description</label>
            <Controller
              name={'description'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <BaseWuTextarea
                  rows={4}
                  id={'outcome-description'}
                  placeholder={'Text here'}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
          <div className={'flex items-center justify-center'}>
            <label className="text-[0.75rem] w-20">Status</label>
            <div className={'flex-1 text-[0.75rem]'}>
              {selectedOutcome?.status || OutcomeStatusEnum.Backlog}
            </div>
          </div>
          {level === OutcomeLevelEnum.WORKSPACE && (
            <div className={'flex items-center justify-center'}>
              <label className="text-[0.75rem] w-20">Maps</label>
              <div className={'flex-1 text-[0.75rem]'}>
                <Controller
                  name={'map'}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <BaseWuSelect<WorkspaceMapsType>
                      data={maps}
                      defaultValue={maps.find(m => m.id === value)}
                      onSelect={data => {
                        onChange((data as WorkspaceMapsType).id);
                        if ((data as WorkspaceMapsType).id !== selectedMapId) {
                          setStages([]);
                          setSteps([]);
                          setPersonas([defaultPersonaOption]);
                          setSelectedMapId((data as WorkspaceMapsType).id);
                          setValue('stage', null);
                        }
                      }}
                      accessorKey={{
                        label: 'title',
                        value: 'id',
                      }}
                      name={'map'}
                      placeholder={'Select'}
                      // onScroll={onHandleFetch}
                    />
                  )}
                />
              </div>
            </div>
          )}
          <div>
            <div className={'flex items-center justify-center'}>
              <label className="text-[0.75rem] w-20">Stage</label>
              <div className={'flex-1 text-[0.75rem]'}>
                <Controller
                  name={'stage'}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <BaseWuSelect<MapColumnsForOutcomeType>
                      data={stages}
                      defaultValue={stages.find(s => s.id === value)}
                      onSelect={data => {
                        onChange((data as MapColumnsForOutcomeType).id);
                        if ((data as MapColumnsForOutcomeType).id !== currentColumnId) {
                          setValue('step', null);
                          setSteps([]);
                          setCurrentColumnId((data as MapColumnsForOutcomeType).id);
                        }
                      }}
                      accessorKey={{
                        label: 'label',
                        value: 'id',
                      }}
                      name={'stage'}
                      placeholder={'Select'}
                      disabled={!selectedMapIdWatch}
                      onScroll={onHandleFetchStages}
                    />
                  )}
                />
              </div>
            </div>
            {errors?.stage?.message && (
              <span className={'validation-error ml-20!'}>{errors?.stage?.message}</span>
            )}
          </div>

          <div>
            <div className={'flex items-center justify-center'}>
              <label className="text-[0.75rem] w-20">Steps</label>
              <div className={'flex-1 text-[0.75rem]'}>
                <Controller
                  name={'step'}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <BaseWuSelect<ColumnStepsType>
                      data={steps}
                      defaultValue={steps.find(s => s.id === value)}
                      onSelect={data => {
                        onChange((data as ColumnStepsType).id);
                      }}
                      accessorKey={{
                        label: 'name',
                        value: 'id',
                      }}
                      name={'steps'}
                      placeholder={'Select'}
                      disabled={!selectedStageIdWatch}
                      onScroll={onHandleFetchSteps}
                    />
                  )}
                />
              </div>
            </div>
            {errors?.step?.message && (
              <span className={'validation-error ml-20!'}>{errors?.step?.message}</span>
            )}
          </div>

          <div>
            <div className={'flex items-center justify-center'}>
              <label className="text-[0.75rem] w-20">Personas</label>
              <div className={'flex-1 text-[0.75rem]'}>
                <Controller
                  name={'persona'}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <BaseWuSelect<MapPersonasForOutcomeType>
                      data={personas}
                      defaultValue={personas.find(p => p.id === value) || personas[0]}
                      onSelect={data => {
                        onChange((data as MapPersonasForOutcomeType).id);
                        if ((data as MapPersonasForOutcomeType).name === 'Overview') {
                          onChange(null);
                        } else {
                          onChange((data as MapPersonasForOutcomeType).id);
                        }
                      }}
                      accessorKey={{
                        label: 'name',
                        value: 'id',
                      }}
                      name={'persona'}
                      placeholder={'Select'}
                      onScroll={onHandleFetchPersonas}
                    />
                  )}
                />
              </div>
            </div>
            {errors?.step?.message && (
              <span className={'validation-error ml-20!'}>{errors?.persona?.message}</span>
            )}
          </div>
        </div>
      </form>
    );
  },
);
export default AddUpdateOutcomeForm;
