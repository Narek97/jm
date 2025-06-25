import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

import './style.scss';

import { ClickAwayListener } from '@mui/material';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import CustomInput from '@/components/atoms/custom-input/custom-input';
import CustomLongMenu from '@/components/atoms/custom-long-menu/custom-long-menu';
import { GetMapVersionsQuery } from '@/gql/infinite-queries/generated/getMapVersions.generated';
import {
  UpdateMapVersionNameMutation,
  useUpdateMapVersionNameMutation,
} from '@/gql/mutations/generated/updateMapVersionName.generated';
import { debounced400 } from '@/hooks/useDebounce';
import { useSetQueryDataByKey } from '@/hooks/useQueryKey';
import { journeyMapVersionState } from '@/store/atoms/journeyMap.atom';
import { snackbarState } from '@/store/atoms/snackbar.atom';
import { JOURNEY_MAP_VERSION_CARD_OPTIONS } from '@/utils/constants/options';
import { isDateFormat } from '@/utils/helpers/general';
import { menuViewTypeEnum } from '@/utils/ts/enums/global-enums';
import { MapVersionType } from '@/utils/ts/types/journey-map/journey-map-types';

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
  const [isEditName, setIsEditName] = useState<boolean>(false);
  const [versionName, setVersionName] = useState<string>(
    isDateFormat(version.versionName, 'MMMM D, h:mm A')
      ? dayjs(version.versionName).format('MMMM D, h:mm A')
      : version.versionName,
  );

  const journeyMapVersion = useRecoilValue(journeyMapVersionState);

  const setSnackbar = useSetRecoilState(snackbarState);

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
            });
          },
          onError: error => {
            setVersionName(version.versionName);
            setSnackbar(prev => ({
              ...prev,
              open: true,
              type: 'error',
              message: error.message,
            }));
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
              type={menuViewTypeEnum.VERTICAL}
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
