import { ChangeEvent, FC, useState } from 'react';

import './style.scss';

import Image from 'next/image';

import { ClickAwayListener } from '@mui/material';

import CustomInput from '@/components/atoms/custom-input/custom-input';
import CustomError from '@/components/molecules/custom-error/custome-error';
import CustomLoader from '@/components/molecules/custom-loader/custom-loader';
import {
  GetNounProjectIconsQuery,
  useGetNounProjectIconsQuery,
} from '@/gql/queries/generated/getNounProjectIcons.generated';
import { debounced400 } from '@/hooks/useDebounce';
import { JourneyMapNounProjectIconsType } from '@/utils/ts/types/journey-map/journey-map-types';

interface ISearchNounProjectIcon {
  onIconSelect: (url: string, searchText: string) => void;
}

const SearchNounProjectIcon: FC<ISearchNounProjectIcon> = ({ onIconSelect }) => {
  const [iconSearchText, setIconSearchText] = useState<string>('');
  const [isOpenNounProjectIconsPopup, setIsOpenNounProjectIconsPopup] = useState<boolean>(false);
  const {
    data: dataNounProjectIcons,
    isLoading: isLoadingNounProjectIcons,
    error: errorNounProjectIcons,
  } = useGetNounProjectIconsQuery<GetNounProjectIconsQuery, Error>(
    {
      category: iconSearchText,
      limit: 100,
    },
    {
      enabled: !!iconSearchText,
    },
  );

  let nounProjectIcons = JSON.parse(dataNounProjectIcons?.getNounProjectIcons || 'null');

  const onHandleSearchIcons = (e: ChangeEvent<HTMLInputElement>) => {
    debounced400(() => {
      setIconSearchText(e.target.value);
      setIsOpenNounProjectIconsPopup(true);
    });
  };

  const onHandleIconSelect = (icon: JourneyMapNounProjectIconsType) => {
    onIconSelect(icon.thumbnail_url, iconSearchText);
  };

  return (
    <div className={'search-icon-section'}>
      <div>
        <CustomInput placeholder={'Look for an icon here'} onChange={onHandleSearchIcons} />
        {iconSearchText && isOpenNounProjectIconsPopup ? (
          <ClickAwayListener
            onClickAway={() => {
              setIsOpenNounProjectIconsPopup(false);
            }}>
            <ul className={'noun-project-icons-block'} data-testid={'noun-project-icons-test-id'}>
              {errorNounProjectIcons ? (
                <CustomError />
              ) : isLoadingNounProjectIcons ? (
                <CustomLoader />
              ) : (
                <>
                  {nounProjectIcons.icons?.length ? (
                    nounProjectIcons.icons.map((icon: JourneyMapNounProjectIconsType) => (
                      <li
                        key={icon.id}
                        data-testid={'noun-project-icon'}
                        className={'noun-project-icon'}
                        onClick={() => onHandleIconSelect(icon)}>
                        <Image
                          src={icon.thumbnail_url}
                          alt={icon.term}
                          width={100}
                          height={100}
                          style={{
                            width: '1rem',
                            height: '1rem',
                          }}
                        />
                      </li>
                    ))
                  ) : (
                    <span className={'no-result'}>No Result</span>
                  )}
                </>
              )}
            </ul>
          </ClickAwayListener>
        ) : null}
      </div>
    </div>
  );
};

export default SearchNounProjectIcon;
