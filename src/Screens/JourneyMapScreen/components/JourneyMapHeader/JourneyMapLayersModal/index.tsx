import { FC, useCallback, useEffect, useRef, useState } from 'react';

import './style.scss';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  useWuShowToast,
  WuButton,
  WuMenu,
  WuMenuItem,
  WuModal,
  WuModalHeader,
} from '@npm-questionpro/wick-ui-lib';
import { Controller, FieldErrors, useForm } from 'react-hook-form';

import LayersModalEmptyState from './EmptyState';
import StagesAndLanes from './StagesAndLanes';

import {
  CreateLayerMutation,
  useCreateLayerMutation,
} from '@/api/mutations/generated/createLayer.generated';
import {
  DeleteLayerMutation,
  useDeleteLayerMutation,
} from '@/api/mutations/generated/deleteLayer.generated';
import {
  UpdateLayerMutation,
  useUpdateLayerMutation,
} from '@/api/mutations/generated/updateLayer.generated.ts';
import { ActionEnum } from '@/api/types.ts';
import CustomInput from '@/Components/Shared/CustomInput';
import { queryClient } from '@/providers/constants.ts';
import { UPDATE_LAYER_VALIDATION_SCHEMA } from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/constants.tsx';
import { LayerFormType } from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/types.ts';
import { useSelectLayerForMap } from '@/Screens/JourneyMapScreen/hooks/useSelectLayerForMap.tsx';
import { LayerType } from '@/Screens/JourneyMapScreen/types.ts';
import { useLayerStore } from '@/store/layers.ts';
import { ErrorWithStatus } from '@/types';

interface IJourneyMapLayers {
  mapId: number;
  closeLayersModal: () => void;
  isOpenLayersModal: boolean;
}

interface StagesAndLanesComponent extends HTMLInputElement {
  getStepsData: () => any;
  resetStepsData: () => void;
  setLayerData: (data: LayerType) => void;
  getTagIds: () => void;
  getCurrentSelectedData: () => any;
}

const JourneyMapLayersModal: FC<IJourneyMapLayers> = ({
  mapId,
  closeLayersModal,
  isOpenLayersModal,
}) => {
  const { showToast } = useWuShowToast();

  const { selectLayerForJourneyMap } = useSelectLayerForMap();
  const { layers, currentLayer, setLayers, setCurrentLayer, setStagesStepsForLayer } =
    useLayerStore();

  const childRef = useRef<StagesAndLanesComponent>(null);
  const layersMenuRef = useRef<HTMLDivElement>(null);
  const hasSetLayer = useRef(false);

  const [isCreateMode, setIsCreateMode] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<LayerType | null>(null);

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<LayerFormType>({
    resolver: yupResolver(UPDATE_LAYER_VALIDATION_SCHEMA),
    defaultValues: {
      name: selectedLayer?.name || '',
      columnIds: selectedLayer?.columnIds || [],
      rowIds: selectedLayer?.rowIds || [],
      tagIds: selectedLayer?.tagIds || [],
      columnSelectedStepIds: null,
      isBase: false,
    },
  });

  const { mutate: updateLayer, isPending: isPendingUpdateLayer } = useUpdateLayerMutation<
    ErrorWithStatus,
    UpdateLayerMutation
  >();
  const { mutate: createLayer, isPending: isPendingCreateLayer } = useCreateLayerMutation<
    CreateLayerMutation,
    Error
  >();
  const { mutate: deleteLayer } = useDeleteLayerMutation<DeleteLayerMutation, Error>();

  const selectLayer = useCallback(
    (layer: LayerType, isBase: boolean) => {
      setSelectedLayer({ ...layer, isBase });
      reset({
        name: layer.name,
        columnIds: layer.columnIds || [],
        rowIds: layer.rowIds || [],
        tagIds: layer.tagIds || [],
        columnSelectedStepIds: layer.columnSelectedStepIds || null,
        isBase,
      });
    },
    [reset],
  );

  const addLayer = () => {
    const layerTitle = `New Layer ${layers?.length}`;
    if (childRef.current) {
      childRef.current.resetStepsData();
    }
    setSelectedLayer(null);
    setIsCreateMode(true);
    reset({
      name: layerTitle,
      columnIds: [],
      rowIds: [],
    });
  };

  const createNewLayer = ({
    rowIds,
    columnIds,
    tagIds,
    name,
    columnSelectedStepIds,
  }: LayerFormType) => {
    createLayer(
      {
        createLayerInput: {
          rowIds,
          columnIds,
          tagIds,
          columnSelectedStepIds: JSON.stringify(columnSelectedStepIds) as string,
          mapId: +mapId,
          name,
        },
      },
      {
        onSuccess: data => {
          const newLayer = {
            id: data.createLayer?.id,
            name,
            rowIds: rowIds,
            columnIds: columnIds,
            tagIds,
            columnSelectedStepIds: columnSelectedStepIds,
          };
          setLayers([...layers, newLayer]);
          selectLayer(newLayer, false);
          selectLayerForJourneyMap(newLayer, false);
          closeLayersModal();
        },
      },
    );
  };

  const onHandleDeleteLayer = useCallback(
    ({ id }: LayerType) => {
      deleteLayer(
        {
          id: id!,
        },
        {
          onSuccess: () => {
            setLayers(layers.filter(layer => layer.id !== id));
            if (selectedLayer?.id === id) {
              selectLayer(layers[1], false);
              if (childRef.current) {
                childRef.current.setLayerData(layers[1]);
              }
            }
            if (currentLayer?.id === id || layers.length === 1) {
              selectLayerForJourneyMap(layers[0], true);
            }
          },
        },
      );
    },
    [
      currentLayer?.id,
      deleteLayer,
      layers,
      selectLayer,
      selectLayerForJourneyMap,
      selectedLayer?.id,
      setLayers,
    ],
  );

  const getAddAndRemoveLists = (updatedArray: number[], initArray: number[]) => {
    const remove = initArray.filter(stage => !updatedArray.includes(stage));
    const add = updatedArray.filter(stage => !initArray.includes(stage));
    return { add, remove };
  };

  const onError = (errors: FieldErrors<LayerFormType>) => {
    if (errors['columnIds'] || errors['rowIds']) {
      showToast({
        message: 'Columns and Rows must always have at least one option selected.',
        variant: 'info',
      });
    }
  };

  const applyLayer = (formData: LayerFormType) => {
    if (childRef.current) {
      const stepsData = !selectedLayer?.isBase ? childRef.current.getStepsData() : null;
      const lanesData = getAddAndRemoveLists(formData.rowIds, selectedLayer?.rowIds || []);
      const stagesData = getAddAndRemoveLists(formData.columnIds, selectedLayer?.columnIds || []);

      setSelectedLayer((prev: LayerType | null) => ({
        ...prev!,
        rowIds: formData?.rowIds,
        columnIds: formData?.columnIds,
        tagIds: formData.tagIds,
      }));

      if (selectedLayer?.id) {
        updateLayer(
          {
            updateLayerInput: {
              columnSelectedStepIds: JSON.stringify(stepsData),
              name: formData.name,
              id: currentLayer.id,
              columnsChange: stagesData,
              rowsChange: lanesData,
              tagIds: formData.tagIds,
            },
          },
          {
            onSuccess: async data => {
              setLayers(
                layers?.map(layer => {
                  if (layer?.id === selectedLayer?.id) {
                    return {
                      ...layer,
                      ...selectedLayer,
                      name: formData.name,
                      rowIds: data?.updateLayer?.rowIds || [],
                      columnIds: data?.updateLayer?.columnIds || [],
                      tagIds: formData.tagIds,
                      columnSelectedStepIds: data.updateLayer?.columnSelectedStepIds as any,
                    };
                  }
                  return layer;
                }),
              );

              if (currentLayer?.id === selectedLayer?.id) {
                setCurrentLayer({
                  ...currentLayer,
                  rowIds: data?.updateLayer?.rowIds || [],
                  columnIds: data?.updateLayer?.columnIds || [],
                  tagIds: formData.tagIds,
                });
              }
              await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['GetJourneyMapRows.infinite'] }),
                queryClient.invalidateQueries({ queryKey: ['GetJourneyMap'] }),
              ]);
              closeLayersModal();
            },
            onError: error => {
              if (error.message) {
                showToast({
                  variant: 'error',
                  message: error.message,
                });
              }
            },
          },
        );
      } else {
        createNewLayer({
          name: formData?.name || '',
          columnIds: selectedLayer?.columnIds || [],
          rowIds: selectedLayer?.rowIds || [],
          tagIds: selectedLayer?.tagIds || [],
          columnSelectedStepIds: stepsData,
          isBase: false,
        });
      }
    }
  };

  useEffect(() => {
    if (!hasSetLayer.current && layers?.length > 1) {
      setSelectedLayer(layers[1]);
      hasSetLayer.current = true;
    }
  }, [layers]);

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({ queryKey: ['GetJourneyMapColumnSteps'] }).then();
      setStagesStepsForLayer({});
    };
  }, [setStagesStepsForLayer]);

  return (
    <WuModal
      maxHeight="100%"
      maxWidth="max-content"
      open={isOpenLayersModal}
      onOpenChange={closeLayersModal}>
      <WuModalHeader>Layers</WuModalHeader>
      <div>
        <form
          className={'journey-map--layers-modal'}
          data-testid="update-layer-modal"
          onSubmit={handleSubmit(applyLayer, onError)}>
          <div className={'journey-map--layers-modal--content'}>
            <div data-testid={'layers-menu'} className={'journey-map--layers-modal--content--left'}>
              <div
                data-testid="layers-modal-menu-test-id"
                className={'journey-map--layers-modal--content--left-menu'}
                ref={layersMenuRef}>
                {layers?.map((layer, index) => {
                  if (index > 0) {
                    return (
                      <div
                        key={layer.id}
                        data-testid={`layer-${layer.id}`}
                        className={`journey-map--layers-modal--content--left-menu-item  ${layer?.id === selectedLayer?.id ? 'selected-menu-item' : ''}`}
                        onClick={() => {
                          selectLayer(layer, index === 0);
                          if (childRef.current) {
                            childRef.current.setLayerData(layer);
                          }
                        }}>
                        {layer?.name}
                        <div
                          data-testid={`layer-menu`}
                          className={'journey-map--layers-modal--content--left-menu-item--menu'}>
                          <WuMenu
                            align="end"
                            className="w-[6.5rem]"
                            Trigger={<span className="wm-more-vert"></span>}>
                            <WuMenuItem
                              className="cursor-pointer"
                              onSelect={() => {
                                onHandleDeleteLayer(layer);
                              }}>
                              <span className="wm-delete" data-testid={`layer-delete-option`} />
                              Delete
                            </WuMenuItem>
                          </WuMenu>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
              <button
                onClick={addLayer}
                type={'button'}
                data-testid={'add-new-layer'}
                className={'add-new-layer'}>
                <span className={'add-new-layer--icon'}>
                  <span className={'wm-add'} />
                </span>
                Add layer
              </button>
            </div>
            <div className={'journey-map--layers-modal--content--right'}>
              {layers?.length > 1 || isCreateMode ? (
                <>
                  <div className={'layers-title'}>
                    <div className={'layers-title--input'}>
                      <Controller
                        name={'name'}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <CustomInput
                            value={value || ''}
                            data-testid="layer-title"
                            id={'layer-title'}
                            sxStyles={{
                              '&:hover': {
                                '& .MuiInput-underline::before': {
                                  borderBottom: `1px solid #D8D8D8 !important`,
                                },
                              },
                              '& .MuiInput-underline:after': {
                                borderBottom: `1px solid #1B87E6`,
                              },
                              background: '#ffffff',
                              '& .MuiInput-input': {
                                fontSize: '12px',
                                background: '#F5F5F5',
                              },

                              '& .MuiInput-underline::before': {
                                borderBottom: `1px solid #D8D8D8`,
                              },
                            }}
                            onChange={onChange}
                            onFocus={() => {}}
                            onBlur={() => {}}
                            onKeyDown={event => {
                              if (event.keyCode === 13) {
                                event.preventDefault();
                                (event.target as HTMLElement).blur();
                              }
                            }}
                          />
                        )}
                      />
                      {errors['name']?.message && (
                        <span className={'validation-error'}>
                          {(errors && errors['name']?.message) || ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <StagesAndLanes
                    mode={selectedLayer?.id ? ActionEnum.Update : ActionEnum.Add}
                    updatesCurrentLayer={data => {
                      setSelectedLayer((prev: LayerType | null) => ({
                        ...prev!,
                        ...data,
                      }));
                    }}
                    control={control}
                    setValue={(
                      name: keyof LayerFormType,
                      value: LayerFormType[keyof LayerFormType],
                    ) => {
                      setValue(name, value);
                      trigger(name).then();
                    }}
                    selectedLayer={selectedLayer}
                    ref={childRef}
                  />
                </>
              ) : (
                <LayersModalEmptyState addLayer={addLayer} />
              )}
            </div>
          </div>
          <div className={'base-modal-footer'}>
            <button className={'base-modal-footer--cancel-btn'} onClick={closeLayersModal}>
              Back
            </button>
            <WuButton
              Icon={<span className="wm-add" />}
              disabled={
                (layers?.length === 1 && !isCreateMode) ||
                isPendingUpdateLayer ||
                isPendingCreateLayer
              }
              type={'submit'}
              data-testid={'apply-layer-button'}>
              Apply
            </WuButton>
          </div>
        </form>
      </div>
    </WuModal>
  );
};

export default JourneyMapLayersModal;
