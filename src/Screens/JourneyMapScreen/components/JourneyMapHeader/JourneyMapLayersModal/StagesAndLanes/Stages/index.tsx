import React, {
  FC,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import './style.scss';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

import {
  GetJourneyMapColumnStepsQuery,
  useGetJourneyMapColumnStepsQuery,
} from '@/api/queries/generated/getJourneyMapColumnSteps.generated';
import { ActionEnum } from '@/api/types.ts';
import CustomCheckboxIcon from '@/Components/Shared/CustomCheckboxIcon';
import CustomLoader from '@/Components/Shared/CustomLoader';
import { LayerFormType } from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/types.ts';
import { LayerType } from '@/Screens/JourneyMapScreen/types.ts';
import { useLayerStore } from '@/store/layers.ts';
import { ObjectKeysType } from '@/types';
import { getGroupedIds } from '@/utils/getGroupedIds.ts';

interface IStages {
  ref: React.Ref<HTMLDivElement>;
  mapId: number;
  unSelectStyles: ObjectKeysType;
  mode: ActionEnum;
  updatesCurrentLayer: ({ columnIds, rowIds }: { columnIds?: number[]; rowIds?: number[] }) => void;
  setValue: (name: keyof LayerFormType, value: LayerFormType[keyof LayerFormType]) => void;
  defaultSelectedStages: number[];
  stepsData: ObjectKeysType;
  checkboxSxStyles: ObjectKeysType;
  handleUpdateIsComponentRendered: (data: boolean) => void;
}

const Stages: FC<IStages & { ref: any }> = forwardRef(
  (
    {
      mapId,
      unSelectStyles,
      mode,
      updatesCurrentLayer,
      setValue,
      checkboxSxStyles,
      handleUpdateIsComponentRendered,
    },
    ref,
  ) => {
    const { showToast } = useWuShowToast();

    const { stagesAndLanesForLayer, stagesStepsForLayer, setStagesStepsForLayer } = useLayerStore();

    const [expendedList, setExpendedList] = useState<number[]>([]);
    const [currentCheckedStages, setCurrentCheckedStages] = useState<number[]>([]);
    const [currentCheckedSteps, setCurrentCheckedSteps] = useState<number[]>([]);
    const [isAllIdsSelectedStages, setIsAllIdsSelectedStages] = useState<boolean>(false);
    const [currentColumnIds, setCurrentColumnIds] = useState<number[]>([]);

    const { data: dataJourneyMapColumnSteps, isFetching } = useGetJourneyMapColumnStepsQuery<
      GetJourneyMapColumnStepsQuery,
      Error
    >(
      {
        getJourneyMapColumnStepsInput: {
          mapId: +mapId,
          columnIds: currentColumnIds,
        },
      },
      {
        enabled: !!currentColumnIds.length && !stagesStepsForLayer[currentColumnIds[0]],
      },
    );

    const getSelectedData = () => {
      const result: ObjectKeysType = {};
      for (const columnId in stagesStepsForLayer) {
        const filteredIds = stagesStepsForLayer[columnId]
          .filter(item => currentCheckedSteps.includes(item.id))
          .map(item => item.id);

        if (filteredIds.length) {
          result[columnId] = [...filteredIds];
        }
      }

      return result;
    };

    // todo check  stagesStepsData = stagesStepsForLayer,
    const handleSelectStage = (
      id: number,
      isSelected: boolean,
      stagesStepsData = stagesStepsForLayer,
    ) => {
      const result: number[][] = getGroupedIds(stagesAndLanesForLayer?.stages || []);
      const stageGroupIds = result?.find(itm => itm.includes(id)) || [id];
      let currentSelectedStagesData = [...currentCheckedStages];

      const updatedObject: ObjectKeysType = {};
      const affectedIds: number[] = [];
      stageGroupIds.forEach(groupId => {
        if (stagesStepsData[groupId]) {
          const steps = stagesStepsData[groupId].map(step => step.id);
          affectedIds.push(...steps);
          updatedObject[groupId] = isSelected ? steps : [];
        }
      });

      currentSelectedStagesData = isSelected
        ? [...new Set([...currentSelectedStagesData, ...stageGroupIds])]
        : currentSelectedStagesData.filter(itm => !stageGroupIds.includes(itm));

      setCurrentCheckedSteps(prev =>
        isSelected ? [...prev, ...affectedIds] : prev.filter(itm => !affectedIds.includes(itm)),
      );

      if (stageGroupIds?.length > 1) {
        showToast({
          message: 'The selected stages contain merged items.',
          variant: 'info',
        });
      }

      setValue('columnIds', currentSelectedStagesData);
      const isAllIdsSelected =
        currentSelectedStagesData?.length === stagesStepsForLayer.stages?.length;
      setIsAllIdsSelectedStages(isAllIdsSelected);
      setCurrentCheckedStages(currentSelectedStagesData);
      if (mode === ActionEnum.Add) {
        updatesCurrentLayer({ columnIds: currentSelectedStagesData });
      }
    };

    const areIdsFromDifferentColumns = (selectedIds: number[], data: ObjectKeysType) => {
      const columnSet = new Set();
      for (const columnKey in data) {
        if (Array.isArray(data[columnKey])) {
          for (const item of data[columnKey]) {
            if (selectedIds.some(id => item.mergedIds.includes(id))) {
              columnSet.add(columnKey);
            }
          }
        }
      }
      return columnSet.size > 1;
    };

    const handleSelectStep = (id: number, isSelected: boolean, columnId: number) => {
      const stepsArray: any[] = Object.values(stagesStepsForLayer).flat();
      const result: number[][] = getGroupedIds(stepsArray || []);
      const stepIdGroups = result?.find(itm => itm.includes(id)) || [id];

      let currentSelectedStepsData = [...currentCheckedSteps];
      if (!isSelected) {
        currentSelectedStepsData = currentSelectedStepsData.filter(
          itm => !stepIdGroups.includes(itm),
        );
      } else {
        currentSelectedStepsData = [...currentSelectedStepsData, ...stepIdGroups];
      }

      const columnStepGroups = stagesStepsForLayer[columnId].map(itm => itm.id);

      if (stepIdGroups?.length > 1) {
        showToast({
          message: 'The selected stages contain merged items.',
          variant: 'info',
        });
      }

      const selectedStepsCurrentColumn = columnStepGroups.filter(item =>
        currentSelectedStepsData.includes(item),
      );

      const hasDifferenceColumns = areIdsFromDifferentColumns(stepIdGroups, stagesStepsForLayer);

      if (
        selectedStepsCurrentColumn.length === 0 ||
        (stepIdGroups.length > 1 && hasDifferenceColumns)
      ) {
        // IT IS ONLY 1 STEPS  -> need reset merged items
        handleSelectStage(columnId, isSelected, stagesStepsForLayer);
      } else if (selectedStepsCurrentColumn.length > 0) {
        const isStageSelected = currentCheckedStages.some(itm => itm === columnId);
        if (!isStageSelected) {
          handleSelectStage(columnId, true, stagesStepsForLayer);
        } else {
          // NEED TO ADD OR FILTER BY COLUMN__ID
          setCurrentCheckedSteps(currentSelectedStepsData);
        }
      }
    };

    const handleAccordionChange =
      (columnId: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        const result: number[][] = getGroupedIds(stagesAndLanesForLayer?.stages || []);
        const group = result?.find(itm => itm.includes(columnId)) || [columnId];
        setCurrentColumnIds(group);
        if (isExpanded) {
          setExpendedList(prev => {
            const uniqueIds = new Set([...prev, ...group]); // Merge and remove duplicates
            return Array.from(uniqueIds);
          });
        } else {
          setExpendedList(prev => prev.filter(id => !group.includes(id))); // Remove IDs in group
        }
      };

    const handleSelectAllStage = (isSelectAll: boolean) => {
      const extractedIdsFromAllOpenedSteps = Object.values(stagesStepsForLayer)
        .flat()
        .map(item => item.id);
      setCurrentCheckedSteps(isSelectAll ? extractedIdsFromAllOpenedSteps : []);
      setIsAllIdsSelectedStages(isSelectAll);
      if (stagesAndLanesForLayer?.stages) {
        const stages = isSelectAll ? stagesAndLanesForLayer.stages.map(itm => itm?.id) : [];
        setCurrentCheckedStages(stages);
        if (mode === ActionEnum.Add) {
          updatesCurrentLayer({ columnIds: stages });
        }
        setValue('columnIds', stages);
      }
    };

    useImperativeHandle(ref, () => ({
      getStagesData: () => currentCheckedStages,
      getStepsData: () => getSelectedData(),
      resetStepsData: () => {
        setExpendedList([]);
        setIsAllIdsSelectedStages(false);
        setCurrentCheckedStages([]);
        setCurrentCheckedSteps([]);
      },
      setLayerData: setLayerData,
    }));

    const setLayerData = useCallback(
      (data: LayerType) => {
        const isAllSelected =
          !!stagesAndLanesForLayer?.stages?.length &&
          stagesAndLanesForLayer?.stages?.length === data.columnIds?.length;
        setIsAllIdsSelectedStages(isAllSelected);
        setCurrentCheckedStages(data.columnIds || []);
        let result: number[] = [
          ...new Set(Object.values((data.columnSelectedStepIds as number[]) || []).flat()),
        ];
        currentCheckedStages.forEach(checkedItem => {
          if (
            stagesStepsForLayer[checkedItem] &&
            ((data.columnSelectedStepIds && !data.columnSelectedStepIds[checkedItem]) ||
              !data.columnSelectedStepIds)
          ) {
            const defaultCheckedStpIds = stagesStepsForLayer[checkedItem].map(item => item.id);
            result = [...result, ...defaultCheckedStpIds];
          }
        });
        setCurrentCheckedSteps(result);
      },
      [currentCheckedStages, stagesAndLanesForLayer?.stages?.length, stagesStepsForLayer],
    );

    useEffect(() => {
      if (dataJourneyMapColumnSteps) {
        const updatedData = {
          ...stagesStepsForLayer,
          ...dataJourneyMapColumnSteps.getJourneyMapColumnSteps.stepsByColumnId,
        };
        setStagesStepsForLayer(updatedData);
        setCurrentColumnIds([]);
        handleSelectStage(currentColumnIds[0], true, updatedData);
      }
    }, [
      currentColumnIds,
      dataJourneyMapColumnSteps,
      handleSelectStage,
      setStagesStepsForLayer,
      stagesStepsForLayer,
    ]);

    useEffect(() => {
      handleUpdateIsComponentRendered(true);
    }, [handleUpdateIsComponentRendered]);

    return (
      <div className={'rows'}>
        <FormControlLabel
          className={'all-columns-option'}
          label={'Stages'}
          sx={{
            color: '#545E6B',
            '& .MuiFormControlLabel-label': {
              fontSize: '12px',
              marginLeft: '16px',
              color: '#545E6B',
              fontWeight: '500',
            },
          }}
          control={
            <Checkbox
              data-testid={'all-stages'}
              onChange={() => {
                const isPartialSelection =
                  currentCheckedStages?.length > 0 &&
                  currentCheckedStages.length < stagesAndLanesForLayer?.stages.length;
                handleSelectAllStage(!(isPartialSelection || isAllIdsSelectedStages));
              }}
              icon={
                currentCheckedStages?.length > 0 &&
                currentCheckedStages.length < stagesAndLanesForLayer?.stages.length ? (
                  // todo
                  <span className={'wm-checklist'} />
                ) : (
                  <CustomCheckboxIcon />
                )
              }
              value={isAllIdsSelectedStages}
              checked={isAllIdsSelectedStages}
              sx={
                currentCheckedStages?.length > 0 &&
                currentCheckedStages.length < stagesAndLanesForLayer?.stages.length
                  ? unSelectStyles
                  : checkboxSxStyles
              }
            />
          }
        />
        <div data-testid={'layer-columns'} className={'rows-content'}>
          {stagesAndLanesForLayer.stages?.map(column => (
            <Accordion
              key={column.id}
              disableGutters
              expanded={expendedList.some(itm => itm === column.id)}
              onChange={handleAccordionChange(column.id)}
              sx={{
                boxShadow: 'none',
                '&::before': {
                  backgroundColor: '#d8d8d8',
                  borderRadius: '0',
                },
                borderBottom: '1px solid #d8d8d8',
                '&:last-of-type': {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
                borderRadius: '0',
              }}>
              <AccordionSummary
                expandIcon={<span className={'wm-keyboard-arrow-down'} />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    padding: '0 !important',
                    margin: '0 !important',
                    alignItems: 'center',
                    overflow: 'hidden',
                    backgroundColor: 'transparent',
                    borderBottom: 'none',
                  },
                  '& .MuiFormControlLabel-root': {
                    borderBottom: 'none !important',
                  },
                  borderBottom: 'none',
                  padding: '0 8px 0 0 !important',
                  minHeight: 'unset',
                }}>
                <FormControlLabel
                  key={column.id}
                  label={column?.label}
                  onClick={e => e.preventDefault()}
                  sx={{
                    color: '#545E6B',
                    '& .MuiFormControlLabel-label': {
                      fontSize: '12px',
                      marginLeft: '16px',
                    },
                  }}
                  control={
                    <Checkbox
                      icon={<CustomCheckboxIcon />}
                      checked={currentCheckedStages?.some(item => item === +column?.id)}
                      onClick={e => e.stopPropagation()}
                      onChange={() => {
                        handleSelectStage(
                          +column?.id,
                          !currentCheckedStages?.some(item => item === +column?.id),
                        );
                      }}
                      sx={checkboxSxStyles}
                    />
                  }
                />
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  '& .MuiFormControlLabel-root': {
                    borderBottom: 'none !important',
                  },
                }}>
                <div className={'columns-content-summary'}>
                  {currentColumnIds.includes(column.id) && isFetching && <CustomLoader />}
                  {stagesStepsForLayer[column.id]?.map((stepItem: any) => (
                    <FormControlLabel
                      key={stepItem.id}
                      label={stepItem?.name?.trim() || 'Untitled'}
                      onClick={e => e.preventDefault()}
                      sx={{
                        color: '#545E6B',
                        '& .MuiFormControlLabel-label': {
                          fontSize: '12px',
                          marginLeft: '16px',
                        },
                      }}
                      control={
                        <Checkbox
                          icon={<CustomCheckboxIcon />}
                          checked={currentCheckedSteps?.some(item => item === +stepItem?.id)}
                          onClick={e => e.stopPropagation()}
                          onChange={() => {
                            handleSelectStep(
                              +stepItem?.id,
                              !currentCheckedSteps?.some(item => item === +stepItem?.id),
                              column.id,
                            );
                          }}
                          sx={checkboxSxStyles}
                        />
                      }
                    />
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    );
  },
);

export default Stages;
