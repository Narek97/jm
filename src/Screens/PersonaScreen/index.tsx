import './style.scss';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

import PersonaHeader from './components/PersonaHeader';

import {
  CreateDemographicInfoMutation,
  useCreateDemographicInfoMutation,
} from '@/api/mutations/generated/createDemographicInfo.generated';
import {
  CreatePersonaSectionMutation,
  useCreatePersonaSectionMutation,
} from '@/api/mutations/generated/createPersonaSection.generated';
import {
  DeleteDemographicInfoMutation,
  useDeleteDemographicInfoMutation,
} from '@/api/mutations/generated/deleteDemographicInfo.generated';
import {
  UpdateDemographicInfoMutation,
  useUpdateDemographicInfoMutation,
} from '@/api/mutations/generated/updateDemographicInfo.generated';
import {
  UpdatePersonaMutation,
  useUpdatePersonaMutation,
} from '@/api/mutations/generated/updatePersona.generated';
import {
  GetPersonaByIdQuery,
  useGetPersonaByIdQuery,
} from '@/api/queries/generated/getPersonaById.generated';
import {
  GetPersonaDemographicInfosQuery,
  useGetPersonaDemographicInfosQuery,
} from '@/api/queries/generated/getPersonaDemographicInfos.generated.ts';
import {
  GetPersonaSectionsQuery,
  useGetPersonaSectionsQuery,
} from '@/api/queries/generated/getPersonaSections.generated.ts';
import { DemographicInfoTypeEnum } from '@/api/types.ts';
import CustomError from '@/Components/Shared/CustomError';
import CustomLoader from '@/Components/Shared/CustomLoader';
import { debounced400 } from '@/hooks/useDebounce';
import { useSetQueryDataByKey } from '@/hooks/useQueryKey.ts';
import PersonaLeftMenu from '@/Screens/PersonaScreen/components/PersonaLeftMenu';
import { PersonaDemographicInfoType } from '@/Screens/PersonaScreen/types.ts';
import { useBreadcrumbStore } from '@/store/breadcrumb.ts';
import { PersonaFieldCategoryTypeEnum } from '@/types/enum';
import { getDemographicFiledKey } from '@/utils/getDemographicFiledKey.ts';

const PersonaScreen = () => {
  const { workspaceId, personaId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/persona/$personaId/',
  });

  const queryClient = useQueryClient();
  const setPersona = useSetQueryDataByKey('GetPersonaById');
  const setDemographicInfos = useSetQueryDataByKey('GetPersonaDemographicInfos');

  const { showToast } = useWuShowToast();

  const { setBreadcrumbs } = useBreadcrumbStore();

  const hasSetBreadcrumbs = useRef(false);
  const personaRef = useRef<{
    getNextFreePosition: () => { x: number; y: number };
  } | null>(null);
  const rightSectionRef = useRef<HTMLDivElement | null>(null);
  const demographicInfoRef = useRef<HTMLDivElement | null>(null);

  const { mutate: mutateDemographicInfo } = useUpdateDemographicInfoMutation<
    Error,
    UpdateDemographicInfoMutation
  >();

  const { mutate: mutateCreateDemographicInfo, isPending: isLoadingCreateDemographicInfo } =
    useCreateDemographicInfoMutation<Error, CreateDemographicInfoMutation>();

  const { mutate: mutatePersona } = useUpdatePersonaMutation<Error, UpdatePersonaMutation>();

  const { mutate: mutateDeleteDemographicInfo, isPending: isLoadingDeleteDemographicInfo } =
    useDeleteDemographicInfoMutation<Error, DeleteDemographicInfoMutation>();

  const { mutate: mutatePersonaSection, isPending: isLoadingPersonaSection } =
    useCreatePersonaSectionMutation<Error, CreatePersonaSectionMutation>({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['GetPersonaSections'],
        });
        const objDiv = rightSectionRef.current;
        objDiv?.scrollTo({
          top: objDiv.scrollHeight + 128,
          behavior: 'smooth',
        });
      },
    });

  const {
    isFetching: isFetchingPersona,
    data: dataPersonaInfo,
    error: isErrorPersonaInfo,
  } = useGetPersonaByIdQuery<GetPersonaByIdQuery, Error>({
    getPersonaByIdInput: {
      personaId: +personaId,
    },
  });

  const personaInfo = useMemo(
    () => dataPersonaInfo?.getPersonaById || null,
    [dataPersonaInfo?.getPersonaById],
  );

  const {
    isFetching: isFetchingDemographicInfos,
    data: dataDemographicInfos,
    error: isErrorDemographicInfos,
  } = useGetPersonaDemographicInfosQuery<GetPersonaDemographicInfosQuery, Error>({
    getPersonaDemographicInfosInput: {
      personaId: +personaId,
    },
  });

  const demographicInfos = useMemo(() => {
    return {
      personaFieldSections:
        dataDemographicInfos?.getPersonaDemographicInfos.personaFieldSections || [],
      demographicInfoFields:
        dataDemographicInfos?.getPersonaDemographicInfos.demographicInfoFields || [],
    };
  }, [
    dataDemographicInfos?.getPersonaDemographicInfos.demographicInfoFields,
    dataDemographicInfos?.getPersonaDemographicInfos.personaFieldSections,
  ]);

  const { data: dataPersonaSections, isPending: isLoadingPersonaSections } =
    useGetPersonaSectionsQuery<GetPersonaSectionsQuery, Error>({
      getPersonaSectionsInput: {
        personaId: +personaId,
      },
    });

  const onHandleUpdateInfo = useCallback(
    (key: string, value: string) => {
      setPersona((oldData: any) => {
        if (oldData) {
          return {
            getPersonaById: {
              ...dataPersonaInfo?.getPersonaById,
              [key]: value,
            },
          };
        }
      });
      debounced400(() => {
        mutatePersona({
          updatePersonaInput: {
            personaId: +personaId,
            [key]: value,
          },
        });
      });
    },
    [dataPersonaInfo?.getPersonaById, mutatePersona, personaId, setPersona],
  );

  const onHandleUpdateSelectedGalleryItem = useCallback((value: number) => {
    console.log(value, 'value');
    // personaInfoState &&
    //   personaInfoState &&
    //   setPersonaInfoState(() => ({
    //     ...personaInfoState,
    //     attachment: { ...personaInfoState.attachment!, id: value },
    //   }));
  }, []);

  const onHandleChangeDemographicInfo = useCallback(
    (
      demographicInfoId: number,
      value: any,
      key: 'key' | 'value' | 'isHidden' | 'attachment' | 'height',
      categoryType: PersonaFieldCategoryTypeEnum,
    ) => {
      setDemographicInfos((oldData: any) => {
        if (oldData) {
          return {
            getPersonaDemographicInfos: {
              ...oldData.getPersonaDemographicInfos,
              [categoryType]: oldData.getPersonaDemographicInfos[categoryType].map(
                (item: PersonaDemographicInfoType) => {
                  if (item.id === demographicInfoId) {
                    item = {
                      ...item,
                      [key]: value,
                      ...(key === 'attachment'
                        ? {
                            croppedArea: value.croppedArea,
                          }
                        : {}),
                    };
                    debounced400(() => {
                      mutateDemographicInfo(
                        {
                          updateDemographicInfoInput: {
                            isHidden: item.isHidden as boolean,
                            id: item.id,
                            value: item.value as string,
                            key: item.key as string,
                            ...(key === 'attachment'
                              ? {
                                  attachmentId: value.id,
                                }
                              : key === 'height'
                                ? { height: value }
                                : {}),
                          },
                        },
                        {
                          onError: error => {
                            showToast({
                              variant: 'error',
                              message: error?.message,
                            });
                          },
                        },
                      );
                    });
                  }
                  return item;
                },
              ),
            },
          };
        }
      });
    },
    [mutateDemographicInfo, setDemographicInfos, showToast],
  );

  const onHandleAddNewDemographicInfo = useCallback(
    (name: string, type: DemographicInfoTypeEnum, value: string, callback?: () => void) => {
      mutateCreateDemographicInfo(
        {
          createDemographicInfoInput: {
            personaId: +personaId,
            key: name || 'untitled',
            value,
            type,
            height: type === DemographicInfoTypeEnum.Content ? 100 : null,
          },
        },
        {
          onSuccess: response => {
            const fieldType = response.createDemographicInfo.type;

            if (
              fieldType === DemographicInfoTypeEnum.Content ||
              fieldType === DemographicInfoTypeEnum.Image
            ) {
              setDemographicInfos((oldData: any) => {
                if (oldData) {
                  return {
                    getPersonaDemographicInfos: {
                      ...oldData.getPersonaDemographicInfos,
                      personaFieldSections: [
                        ...oldData.getPersonaDemographicInfos.personaFieldSections,
                        response.createDemographicInfo,
                      ],
                    },
                  };
                }
              });
            } else {
              setDemographicInfos((oldData: any) => {
                if (oldData) {
                  return {
                    getPersonaDemographicInfos: {
                      ...oldData.getPersonaDemographicInfos,
                      demographicInfoFields: [
                        ...oldData.getPersonaDemographicInfos.demographicInfoFields,
                        response.createDemographicInfo,
                      ],
                    },
                  };
                }
              });
            }
            // todo scroll to bottom not working
            setTimeout(() => {
              const objDiv = demographicInfoRef.current;
              objDiv?.scrollTo({
                top: objDiv.scrollHeight + 128,
                behavior: 'smooth',
              });
            }, 100);
            if (callback) {
              callback();
            }
          },
        },
      );
    },
    [mutateCreateDemographicInfo, personaId, setDemographicInfos],
  );

  const onHandleDeleteDemographicInfo = useCallback(
    (id: number, fieldType: DemographicInfoTypeEnum) => {
      mutateDeleteDemographicInfo(
        {
          id,
        },
        {
          onSuccess: response => {
            const key = getDemographicFiledKey(fieldType);

            console.log(response);
            setDemographicInfos((oldData: any) => {
              if (oldData) {
                return {
                  getPersonaDemographicInfos: {
                    ...oldData.getPersonaDemographicInfos,
                    [key]: oldData.getPersonaDemographicInfos[key].filter(
                      (section: { id: number }) => section.id !== response.deleteDemographicInfo,
                    ),
                  },
                };
              }
            });
          },
        },
      );
    },
    [mutateDeleteDemographicInfo, setDemographicInfos],
  );

  const onHandleAddSection = (layout: PersonSectionType | null) => {
    // const { x, y } = personaRef.current
    //   ? personaRef.current?.getNextFreePosition()
    //   : { x: 0, y: 0 };
    //
    // const newItem = {
    //   x: x,
    //   y: y,
    //   w: layout?.w || 1,
    //   h: layout?.h || 1,
    //   i: uuidv4(),
    //   color: layout?.color || "rgb(245, 245, 245)",
    //   content: layout?.content || "",
    // };
    //
    // mutatePersonaSection({
    //   createPersonaSectionInput: {
    //     personaId: +personaId,
    //     key:
    //       layout?.key ||
    //       `New card ${dataPersonaSections?.getPersonaSections.length}`,
    //     ...newItem,
    //   },
    // });
  };

  useEffect(() => {
    if (personaInfo && !hasSetBreadcrumbs.current) {
      setBreadcrumbs([
        {
          name: 'Workspaces',
          pathname: '/workspaces',
        },
        {
          name: personaInfo.workspaceName || '...',
          pathname: `/workspace/${personaInfo.workspaceId}/boards`,
        },
        {
          name: personaInfo.personaGroupName || '...',
          pathname: `/workspace/${personaInfo.workspaceId}/persona-group/${personaInfo.personaGroupId}`,
        },
        {
          name: personaInfo.name || '...',
          pathname: `/workspace/${personaInfo.workspaceId}/persona-group/${personaInfo.personaGroupId}/persona/${personaInfo.id}`,
        },
      ]);
      hasSetBreadcrumbs.current = true;
    }
  }, [personaInfo, setBreadcrumbs]);

  if (isFetchingPersona || isFetchingDemographicInfos) {
    return (
      <div className="persona-container">
        <CustomLoader />
      </div>
    );
  }

  if (isErrorPersonaInfo || isErrorDemographicInfos) {
    const errorMessage = isErrorPersonaInfo?.message || isErrorDemographicInfos?.message;
    return (
      <div className="persona-container">
        <CustomError error={errorMessage} />
      </div>
    );
  }

  return (
    <div className={'persona-container'}>
      <PersonaHeader
        personaInfo={dataPersonaInfo?.getPersonaById || null}
        isLoadingPersonaSection={isLoadingPersonaSection}
        workspaceId={workspaceId}
        onHandleUpdateInfo={onHandleUpdateInfo}
        onHandleAddSection={onHandleAddSection}
      />
      <div className={'persona-container--body'}>
        <div className={'persona-container--left-menu'}>
          <PersonaLeftMenu
            personaId={personaId}
            personaInfo={dataPersonaInfo?.getPersonaById || null}
            demographicInfos={demographicInfos}
            onHandleUpdateInfo={onHandleUpdateInfo}
            onHandleUpdateSelectedGalleryItem={onHandleUpdateSelectedGalleryItem}
            onHandleChangeDemographicInfo={onHandleChangeDemographicInfo}
            onHandleAddNewDemographicInfo={onHandleAddNewDemographicInfo}
            onHandleDeleteDemographicInfo={onHandleDeleteDemographicInfo}
            isLoadingCreateDemographicInfo={isLoadingCreateDemographicInfo}
            isLoadingDeleteDemographicInfo={isLoadingDeleteDemographicInfo}
            demographicInfoRef={demographicInfoRef}
          />
        </div>
        <div className={'persona-container--right-sections'} ref={rightSectionRef}>
          {/*<PersonaRightSections*/}
          {/*  ref={personaRef}*/}
          {/*  dataPersonaSections={*/}
          {/*    (dataPersonaSections?.getPersonaSections as Array<PersonSectionType>) ||*/}
          {/*    []*/}
          {/*  }*/}
          {/*  onHandleAddSection={onHandleAddSection}*/}
          {/*  isLoadingPersonaSections={isLoadingPersonaSections}*/}
          {/*/>*/}
        </div>
      </div>
    </div>
  );
};

export default PersonaScreen;
