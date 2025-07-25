import { FC, useCallback, useMemo, useRef, useState } from 'react';

import './style.scss';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import { JOURNEY_MAP_VERSION_CARD_OPTIONS } from '../../constants';

import { GetMapVersionsQuery } from '@/api/infinite-queries/generated/getMapVersions.generated.ts';
import {
  UpdateMapVersionNameMutation,
  useUpdateMapVersionNameMutation,
} from '@/api/mutations/generated/updateMapVersionName.generated.ts';
import BaseWuInput from '@/Components/Shared/BaseWuInput';
import CustomClickAwayListener from '@/Components/Shared/CustomClickAwayListener';
import CustomLongMenu from '@/Components/Shared/CustomLongMenu';
import { debounced400 } from '@/Hooks/useDebounce.ts';
import { useSetQueryDataByKey } from '@/Hooks/useQueryKey';
import { MapVersionType } from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/types.ts';
import { useJourneyMapStore } from '@/Store/journeyMap.ts';
import { MenuViewTypeEnum } from '@/types/enum.ts';
import { isDateFormat } from '@/utils/isDateFormat.ts';

dayjs.extend(fromNow);

interface IVersionCard {
  isDisabled: boolean;
  version: MapVersionType;
  onHandleRestoreVersion: (version: MapVersionType) => void;
  onHandleSelectPreliminaryVersion: (version: MapVersionType) => void;
  onHandleDeleteVersion: (versionId: number) => void;
}

const VersionCard: FC<IVersionCard> = ({
  isDisabled,
  version,
  onHandleRestoreVersion,
  onHandleDeleteVersion,
  onHandleSelectPreliminaryVersion,
}) => {
  const { showToast } = useWuShowToast();

  const { journeyMapVersion } = useJourneyMapStore();

  const [isEditName, setIsEditName] = useState<boolean>(false);
  const [versionName, setVersionName] = useState<string>(
    isDateFormat(version.versionName, 'MMMM D, h:mm A')
      ? dayjs(version.versionName).format('MMMM D, h:mm A')
      : version.versionName,
  );

  const setVersionsQueryData = useSetQueryDataByKey('GetMapVersions.infinite');

  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate } = useUpdateMapVersionNameMutation<Error, UpdateMapVersionNameMutation>();

  const onHandleEditName = (name: string) => {
    setVersionName(name);
    debounced400(() => {
      mutate(
        {
          updateMapVersionInput: {
            versionId: version.id,
            versionName: name,
          },
        },
        {
          onSuccess: () => {
            setVersionsQueryData((oldData: any) => {
              if (oldData) {
                const updatedPages = (oldData.pages as Array<GetMapVersionsQuery>).map(page => {
                  return {
                    ...page,
                    getMapVersions: {
                      ...page.getMapVersions,
                      mapVersions: page.getMapVersions.mapVersions.map(oldVersion => {
                        if (oldVersion.id === version.id) {
                          oldVersion.versionName = name;
                        }
                        return oldVersion;
                      }),
                    },
                  };
                });

                return {
                  ...oldData,
                  pages: updatedPages,
                };
              }
            });
          },
          onError: error => {
            setVersionName(version.versionName);
            showToast({
              variant: 'error',
              message: error?.message,
            });
          },
        },
      );
    });
  };

  const onHandleEdit = useCallback(() => {
    setIsEditName(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  const onHandleRestore = useCallback(() => {
    onHandleRestoreVersion(version);
  }, [onHandleRestoreVersion, version]);

  const onHandleDelete = useCallback(() => {
    onHandleDeleteVersion(version.id);
  }, [onHandleDeleteVersion, version.id]);

  const options = useMemo(() => {
    return JOURNEY_MAP_VERSION_CARD_OPTIONS({
      onHandleEdit,
      onHandleRestore,
      onHandleDelete,
    });
  }, [onHandleDelete, onHandleEdit, onHandleRestore]);

  return (
    <CustomClickAwayListener onClickAway={() => setIsEditName(false)}>
      <div
        className={`flex items-center justify-between m-3 px-2 py-2 leading-6 ${isDisabled ? 'cursor-not-allowed text-[#878f99] hover:bg-transparent' : 'cursor-pointer text-[#545e6b] hover:bg-[#f5f5f5]'}`}>
        <div>
          {isEditName ? (
            <BaseWuInput
              disabled={isDisabled}
              inputRef={inputRef}
              type="text"
              value={versionName}
              onChange={e => onHandleEditName(e.target.value)}
            />
          ) : (
            <span
              onClick={() => onHandleSelectPreliminaryVersion(version)}
              className={'version-card--title'}>
              {versionName} {isDisabled && `(version not available)`}
            </span>
          )}
        </div>
        <div>
          {journeyMapVersion?.id !== version.id && !isDisabled && (
            <CustomLongMenu
              disabled={isDisabled}
              options={options}
              type={MenuViewTypeEnum.VERTICAL}
              isDefaultOpen={true}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            />
          )}
        </div>
      </div>
    </CustomClickAwayListener>
  );
};

export default VersionCard;
