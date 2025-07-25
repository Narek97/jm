import React, { FC, useCallback, useEffect, useState } from 'react';

import './style.scss';

import { yupResolver } from '@hookform/resolvers/yup';
import { useWuShowToast, WuButton, WuToggle } from '@npm-questionpro/wick-ui-lib';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { CREATE_LINK_VALIDATION_SCHEMA } from '../constants';
import { LinkFormType, LinkMapsByBoardType, LinkType } from '../types';

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
import BaseWuInput from '@/Components/Shared/BaseWuInput';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import BaseWuSelect from '@/Components/Shared/BaseWuSelect';
import { querySlateTime } from '@/Constants';
import { JOURNEY_MAP_LINKS_MAPS_LIMIT } from '@/Constants/pagination';
import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap';
import { useJourneyMapStore } from '@/Store/journeyMap.ts';
import { useUndoRedoStore } from '@/Store/undoRedo.ts';
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
  const [boardMaps, setBoardMaps] = useState<Array<LinkMapsByBoardType>>([]);

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
      setBoardMaps(mapsArray);
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
            <div className={'w-[calc(100%-4rem)] flex-[1] flex items-center'}>
              <Controller
                name="type"
                control={control}
                render={({ field: { onChange } }) => (
                  <>
                    <span data-testid={'journey-link-switch-test-id'} className="!mr-3">
                      Link a journey
                    </span>
                    <WuToggle
                      disabled={isLoadingCreateLink || isLoadingUpdateLink}
                      checked={collapsed}
                      onChange={() => {
                        onChange(collapsed ? LinkTypeEnum.Journey : LinkTypeEnum.External);
                        toggleCollapsed();
                      }}
                    />
                    <span data-testid={'external-link-switch-test-id'}>External link</span>
                  </>
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
                <div className={'w-[calc(100%-4rem)] flex-[1] flex items-center'}>
                  <Controller
                    name={'title'}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <BaseWuInput
                        data-testid="create-update-link-label-input-test-id"
                        placeholder={'Add label'}
                        onChange={onChange}
                        disabled={isLoadingCreateLink || isLoadingUpdateLink}
                        value={value || ''}
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
                <div className={'w-[calc(100%-4rem)] flex-[1] flex items-center'}>
                  <Controller
                    name={'url'}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <BaseWuInput
                        data-testid="create-update-link-url-input-test-id"
                        placeholder={'Add url'}
                        onChange={onChange}
                        disabled={isLoadingCreateLink || isLoadingUpdateLink}
                        value={value || ''}
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
              <div className={'w-[calc(100%-4rem)]'}>
                <Controller
                  name={'linkedMapId'}
                  control={control}
                  render={({ field: { onChange } }) => (
                    <BaseWuSelect<LinkMapsByBoardType>
                      name={'maps'}
                      placeholder={'Select'}
                      accessorKey={{
                        label: 'name',
                        value: 'id',
                      }}
                      data={boardMaps}
                      onSelect={data => {
                        onChange((data as LinkMapsByBoardType).mapId);
                      }}
                      disabled={isLoadingCreateLink || isLoadingUpdateLink || isFetchingMaps}
                      // onScroll={onHandleFetchMaps}
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
