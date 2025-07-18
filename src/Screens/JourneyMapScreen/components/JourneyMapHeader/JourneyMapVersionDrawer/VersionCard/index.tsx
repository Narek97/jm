import { FC, useCallback, useMemo, useRef, useState } from 'react';

import './style.scss';

import { ClickAwayListener } from '@mui/material';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import { JOURNEY_MAP_VERSION_CARD_OPTIONS } from '../../constants';

import { GetMapVersionsQuery } from '@/api/infinite-queries/generated/getMapVersions.generated.ts';
import {
  UpdateMapVersionNameMutation,
  useUpdateMapVersionNameMutation,
} from '@/api/mutations/generated/updateMapVersionName.generated.ts';
import CustomInput from '@/Components/Shared/CustomInput';
import CustomLongMenu from '@/Components/Shared/CustomLongMenu';
import { debounced400 } from '@/hooks/useDebounce.ts';
import { useSetQueryDataByKey } from '@/hooks/useQueryKey';
import { MapVersionType } from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { MenuViewTypeEnum } from '@/types/enum.ts';
import { isDateFormat } from '@/utils/isDateFormat.ts';

dayjs.extend(fromNow);

interface IVersionCard {
  version: MapVersionType;
  onHandleRestoreVersion: (version: MapVersionType) => void;
  onHandleSelectPreliminaryVersion: (version: MapVersionType) => void;
  onHandleDeleteVersion: (versionId: number) => void;
}

const VersionCard: FC<IVersionCard> = ({
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
    <ClickAwayListener onClickAway={() => setIsEditName(false)}>
      <div className={'version-card'}>
        <div>
          {isEditName ? (
            <CustomInput
              inputRef={inputRef}
              inputType={'secondary'}
              type="text"
              value={versionName}
              onChange={e => onHandleEditName(e.target.value)}
            />
          ) : (
            <span
              onClick={() => onHandleSelectPreliminaryVersion(version)}
              className={'version-card--title'}>
              {versionName}
            </span>
          )}
        </div>
        <div>
          {journeyMapVersion?.id !== version.id && (
            <CustomLongMenu
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
    </ClickAwayListener>
  );
};

export default VersionCard;
