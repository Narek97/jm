import { ChangeEvent, FC, useState } from 'react';

import './style.scss';

import { ClickAwayListener } from '@mui/material';

import {
  GetNounProjectIconsQuery,
  useGetNounProjectIconsQuery,
} from '@/api/queries/generated/getNounProjectIcons.generated';
import CustomError from '@/Components/Shared/CustomError';
import CustomInput from '@/Components/Shared/CustomInput';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { NOUN_PROJECT_ICONS_LIMIT } from '@/constants/pagination';
import { debounced400 } from '@/hooks/useDebounce';
import { JourneyMapNounProjectIconsType } from '@/types';

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
      limit: NOUN_PROJECT_ICONS_LIMIT,
    },
    {
      enabled: !!iconSearchText,
    },
  );

  const nounProjectIcons = JSON.parse(dataNounProjectIcons?.getNounProjectIcons || 'null');

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
    <div className={'search-icon-section'} data-testid="search-icon-section-id">
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
                <WuBaseLoader />
              ) : (
                <>
                  {nounProjectIcons.icons?.length ? (
                    nounProjectIcons.icons.map((icon: JourneyMapNounProjectIconsType) => (
                      <li
                        key={icon.id}
                        className={'noun-project-icon'}
                        onClick={() => onHandleIconSelect(icon)}>
                        <img
                          src={icon.thumbnail_url}
                          alt={icon.term}
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
