import React, { FC, useCallback, useEffect, useState } from 'react';

import './style.scss';

import { yupResolver } from '@hookform/resolvers/yup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { useWuShowToast, WuButton } from '@npm-questionpro/wick-ui-lib';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { CREATE_LINK_VALIDATION_SCHEMA } from '../constants';
import { LinkFormType, LinkType } from '../types';

import {
  GetLinkMapsByBoardQuery,
  useInfiniteGetLinkMapsByBoardQuery,
} from '@/api/infinite-queries/generated/getLinkMapsByBoard.generated';
import {
  CreateMapLinkMutation,
  useCreateMapLinkMutation,
} from '@/api/mutations/generated/createLink.generated';
import {
  UpdateMapLinkMutation,
  useUpdateMapLinkMutation,
} from '@/api/mutations/generated/updateLink.generated.ts';
import { AddLinkInput, EditLinkInput, LinkTypeEnum } from '@/api/types';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import CustomDropDown from '@/Components/Shared/CustomDropDown';
import CustomInput from '@/Components/Shared/CustomInput';
import { querySlateTime } from '@/constants';
import { JOURNEY_MAP_LINKS_MAPS_LIMIT } from '@/constants/pagination';
import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { useUndoRedoStore } from '@/store/undoRedo.ts';
import { DropdownSelectItemType } from '@/types';
import { ActionsEnum, JourneyMapRowTypesEnum } from '@/types/enum.ts';

interface ICreateUpdateLinkModal {
  selectedRowId: number;
  selectedStepId: number;
  boardId: number;
  link: LinkType | null;
  isOpen: boolean;
  handleClose: () => void;
}

const CreateUpdateLinkModal: FC<ICreateUpdateLinkModal> = ({
  selectedRowId,
  selectedStepId,
  boardId,
  link,
  isOpen,
  handleClose,
}) => {
  const { updateMapByType } = useUpdateMap();
  const { showToast } = useWuShowToast();

  const { selectedJourneyMapPersona } = useJourneyMapStore();
  const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();

  const [collapsed, setCollapsed] = useState<boolean>(link?.type === LinkTypeEnum.External);
  const [boardMaps, setBoardMaps] = useState<Array<DropdownSelectItemType>>([]);

  const {
    data: dataMaps,
    isFetching: isFetchingMaps,
    hasNextPage: hasNextMapMaps,
    fetchNextPage: fetchNextMapMaps,
  } = useInfiniteGetLinkMapsByBoardQuery<{ pages: Array<GetLinkMapsByBoardQuery> }, Error>(
    {
      getMapsInput: {
        boardId,
        offset: 0,
        limit: JOURNEY_MAP_LINKS_MAPS_LIMIT,
      },
    },
    {
      staleTime: querySlateTime,
      getNextPageParam: function (
        lastPage: GetLinkMapsByBoardQuery,
        allPages: GetLinkMapsByBoardQuery[],
      ) {
        if (
          !lastPage.getLinkMapsByBoard.maps ||
          lastPage.getLinkMapsByBoard.maps.length < JOURNEY_MAP_LINKS_MAPS_LIMIT
        ) {
          return undefined;
        }
        return {
          getMapsInput: {
            boardId,
            offset: 0,
            limit: allPages.length * JOURNEY_MAP_LINKS_MAPS_LIMIT,
          },
        };
      },
      initialPageParam: 0,
    },
  );

  const { mutate: mutateCreateLink, isPending: isLoadingCreateLink } = useCreateMapLinkMutation<
    Error,
    CreateMapLinkMutation
  >({
    onError: error => {
      showToast({
        variant: 'error',
        message: error?.message,
      });
    },
  });

  const { mutate: mutateUpdateLink, isPending: isLoadingUpdateLink } = useUpdateMapLinkMutation<
    Error,
    UpdateMapLinkMutation
  >({
    onError: error => {
      showToast({
        variant: 'error',
        message: error?.message,
      });
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LinkFormType>({
    resolver: yupResolver(CREATE_LINK_VALIDATION_SCHEMA),
    defaultValues: {
      type: link?.type || LinkTypeEnum.Journey,
      linkedMapId: link?.linkedJourneyMapId,
      title: link?.title || '',
      url: link?.url || '',
    },
  });

  const toggleCollapsed = useCallback(() => {
    setCollapsed(previouslyCollapsed => !previouslyCollapsed);
  }, []);

  const onHandleFetchMaps = useCallback(
    async (e: React.UIEvent<HTMLElement>) => {
      const bottom =
        e.currentTarget.scrollHeight <=
        e.currentTarget.scrollTop + e.currentTarget.clientHeight + 100;

      if (bottom && !isFetchingMaps && hasNextMapMaps) {
        await fetchNextMapMaps();
      }
    },
    [fetchNextMapMaps, hasNextMapMaps, isFetchingMaps],
  );

  const onHandleSaveLink = (formData: LinkFormType) => {
    if (link) {
      const linkInout: EditLinkInput = {
        id: link.id,
        type: formData.type as LinkTypeEnum,
      };

      if (formData.type === LinkTypeEnum.External) {
        linkInout.title = formData.title;
        linkInout.url = formData.url;
      } else {
        linkInout.linkedMapId = formData.linkedMapId;
      }

      mutateUpdateLink(
        {
          editLinkInput: linkInout,
        },
        {
          onSuccess: response => {
            const data = {
              stepId: selectedStepId,
              ...response.editLink,
            };

            updateMapByType(JourneyMapRowTypesEnum.LINKS, ActionsEnum.UPDATE, data);
            updateRedoActions([]);
            updateUndoActions([
              ...undoActions,
              {
                id: uuidv4(),
                type: JourneyMapRowTypesEnum.LINKS,
                action: ActionsEnum.UPDATE,
                data: {
                  ...data,
                  previousTitle: link?.title,
                  previousType: link?.type,
                  previousMapPersonaImages: link?.mapPersonaImages,
                  previousLinkedJourneyMapId: link?.linkedJourneyMapId,
                  previousIcon: link?.icon,
                  previousUrl: link?.url,
                },
              },
            ]);
            handleClose();
          },
        },
      );
    } else {
      const linkInput: AddLinkInput = {
        personaId: selectedJourneyMapPersona?.id || null,
        stepId: selectedStepId,
        rowId: selectedRowId,
        type: formData.type as LinkTypeEnum,
      };

      if (formData.type === LinkTypeEnum.External) {
        linkInput.title = formData.title;
        linkInput.url = formData.url;
      } else {
        linkInput.linkedMapId = formData.linkedMapId;
      }
      mutateCreateLink(
        {
          addLinkInput: linkInput,
        },
        {
          onSuccess: response => {
            const data = {
              stepId: selectedStepId,
              ...response.addLink,
            };

            updateMapByType(JourneyMapRowTypesEnum.LINKS, ActionsEnum.CREATE, data);
            updateRedoActions([]);
            updateUndoActions([
              ...undoActions,
              {
                id: uuidv4(),
                type: JourneyMapRowTypesEnum.LINKS,
                action: ActionsEnum.DELETE,
                data,
              },
            ]);
            handleClose();
          },
        },
      );
    }
  };

  useEffect(() => {
    if (dataMaps) {
      const mapsArray = dataMaps.pages.map(page => page.getLinkMapsByBoard.maps).flat();
      const transformedArray = mapsArray.map(map => {
        return {
          id: map.mapId,
          name: map.title,
          value: map.mapId,
        };
      });
      setBoardMaps(transformedArray);
    }
  }, [dataMaps]);

  return (
    <BaseWuModal
      headerTitle={link ? 'Update' : 'Create'}
      modalSize={'md'}
      isOpen={isOpen}
      isProcessing={isLoadingCreateLink || isLoadingUpdateLink}
      handleClose={handleClose}
      canCloseWithOutsideClick={true}
      ModalConfirmButton={
        <WuButton
          type={'submit'}
          form="linkform"
          data-testid={'create-update-link-btn-test-id'}
          disabled={isLoadingCreateLink || isLoadingUpdateLink}>
          Save
        </WuButton>
      }>
      <div className={'create-update-link-modal'}>
        <form
          className={'create-update-link-modal--form'}
          onSubmit={handleSubmit(onHandleSaveLink)}
          id="linkform">
          <div className={'create-update-link-modal--row'}>
            <label className={'create-update-link-modal--row--title'}>Type</label>
            <div className={'create-update-link-modal--row--item'}>
              <Controller
                name="type"
                control={control}
                render={({ field: { onChange } }) => (
                  <Stack
                    width={'fit-content'}
                    direction="row"
                    component="label"
                    alignItems="center"
                    justifyContent="center">
                    <span data-testid={'journey-link-switch-test-id'}>Link a journey</span>
                    <Switch
                      disabled={isLoadingCreateLink || isLoadingUpdateLink}
                      checked={collapsed}
                      onChange={() => {
                        onChange(collapsed ? LinkTypeEnum.Journey : LinkTypeEnum.External);
                        toggleCollapsed();
                      }}
                    />
                    <span data-testid={'external-link-switch-test-id'}>External link</span>
                  </Stack>
                )}
              />
            </div>
          </div>

          {collapsed ? (
            <>
              <div className={'create-update-link-modal--row'}>
                <label
                  className={'create-update-link-modal--row--title'}
                  data-testid={'create-update-link-label-label-test-id'}>
                  Label
                </label>
                <div className={'create-update-link-modal--row--item'}>
                  <Controller
                    name={'title'}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomInput
                        inputType={'primary'}
                        data-testid="create-update-link-label-input-test-id"
                        placeholder={'Add label'}
                        onChange={onChange}
                        disabled={isLoadingCreateLink || isLoadingUpdateLink}
                        value={value}
                      />
                    )}
                  />
                </div>
              </div>
              <div className={'create-update-link-modal--row'}>
                <label
                  className={'create-update-link-modal--row--title'}
                  data-testid={'create-update-link-url-label-test-id'}>
                  URL
                </label>
                <div className={'create-update-link-modal--row--item'}>
                  <Controller
                    name={'url'}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomInput
                        inputType={'primary'}
                        data-testid="create-update-link-url-input-test-id"
                        placeholder={'Add url'}
                        onChange={onChange}
                        disabled={isLoadingCreateLink || isLoadingUpdateLink}
                        value={value}
                      />
                    )}
                  />
                  {errors?.url?.message && (
                    <span className={'validation-error'} data-testid={'url-error-test-id'}>
                      {errors?.url?.message}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className={'create-update-link-modal--row'}>
              <label
                className={'create-update-link-modal--row--title'}
                data-testid={'create-update-link-journey-label-test-id'}>
                Journey
              </label>
              <div className={'create-update-link-modal--row--item'}>
                <Controller
                  name={'linkedMapId'}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <CustomDropDown
                      name={'maps'}
                      placeholder={'Select'}
                      onScroll={onHandleFetchMaps}
                      menuItems={boardMaps}
                      onChange={onChange}
                      disabled={isLoadingCreateLink || isLoadingUpdateLink || isFetchingMaps}
                      selectItemValue={value?.toString() || ''}
                    />
                  )}
                />
                {errors?.linkedMapId?.message && (
                  <span className={'validation-error'} data-testid={'map-error-test-id'}>
                    {errors?.linkedMapId?.message}
                  </span>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </BaseWuModal>
  );
};

export default CreateUpdateLinkModal;
