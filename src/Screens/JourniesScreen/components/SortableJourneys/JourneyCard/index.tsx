import { ChangeEvent, FC, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { WuTooltip } from '@npm-questionpro/wick-ui-lib';
import { useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import BaseWuInput from '@/Components/Shared/BaseWuInput';
import BaseWuMenu from '@/Components/Shared/BaseWuMenu';
import CustomClickAwayListener from '@/Components/Shared/CustomClickAwayListener';
import DragHandle from '@/Components/Shared/DragHandle';
import PersonaImages from '@/Features/PersonaImages';
import { JourneyMapNameChangeType, JourneyType } from '@/Screens/JourniesScreen/types.ts';
import { PersonaType } from '@/Screens/PersonaGroupScreen/types.ts';
import { MenuOptionsType } from '@/types';
import { JourneyViewTypeEnum, SelectedPersonasViewModeEnum } from '@/types/enum.ts';

dayjs.extend(fromNow);

interface IJourneyCard {
  map: JourneyType;
  viewType: JourneyViewTypeEnum;
  boardId: number;
  options: Array<MenuOptionsType<JourneyType>>;
  onNameChange?: (data: JourneyMapNameChangeType) => void;
  sortableAttributes?: ReturnType<typeof useSortable>['attributes'];
  sortableListeners?: ReturnType<typeof useSortable>['listeners'];
}

const JourneyCard: FC<IJourneyCard> = ({
  map,
  viewType,
  boardId,
  options,
  onNameChange,
  sortableAttributes,
  sortableListeners,
}) => {
  const navigate = useNavigate();
  const [selectedPersonas, setSelectedPersonas] = useState<PersonaType[]>([]);
  const [isEditName, setIsEditName] = useState<boolean>(false);
  const [cardName, setCardName] = useState(map.title?.trim() || 'Untitled');

  const inputRef = useRef<HTMLInputElement>(null);

  const onHandleNavigateJourneyMap = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!isEditName) {
        e.stopPropagation();
        navigate({
          to: `/board/${boardId}/journey-map/${map.id}`,
        }).then();
      }
    },
    [boardId, isEditName, map?.id, navigate],
  );

  const onHandleEdit = useCallback(() => {
    setIsEditName(prev => !prev);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  const onHandleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setCardName(newValue);
      if (onNameChange) {
        onNameChange({ newValue, mapId: map.id });
      }
    },
    [map.id, onNameChange],
  );

  // todo remove selectedPersonas state use useSetQueryDataByKey
  useEffect(() => {
    setSelectedPersonas(map?.selectedPersonas as PersonaType[]);
  }, [map?.selectedPersonas]);

  return (
    <>
      <div
        onClick={onHandleNavigateJourneyMap}
        className={`bg-white relative text-[var(--base-gray-color)] bg-[var(--base-white-color)] px-6 py-2
         !border-l-[0.0625rem]  ${
           viewType === JourneyViewTypeEnum.BOARD
             ? 'w-[15rem] h-[8.5rem] border-l-[0.0625rem]  '
             : ''
         }  hover:!border-[var(--primary)] hover:border-l-[0.375rem] group border border-[#e5e7eb] border-l-[0.375rem] rounded`}
        data-testid={`journey-card-${map?.id}`}>
        {viewType === JourneyViewTypeEnum.STANDARD && (
          <>
            <DragHandle {...sortableAttributes} {...sortableListeners} />
            <div className={'absolute right-2 top-2'}>
              <BaseWuMenu
                item={map}
                options={[
                  {
                    icon: <span className={'wm-edit'} />,
                    name: 'Rename',
                    onClick: onHandleEdit,
                  },
                  ...options,
                ]}
              />
            </div>
          </>
        )}

        <WuTooltip className="break-all" content={cardName}>
          <div className={'leading-8 max-w-full truncate'}>
            {isEditName ? (
              <CustomClickAwayListener onClickAway={() => setIsEditName(false)}>
                <div
                  className={'w-fit max-w-[90%] truncate font-medium text-[var(--primary)]'}
                  data-testid={'journey-card-name-input-test-id'}>
                  <BaseWuInput
                    value={cardName}
                    onChange={onHandleNameChange}
                    inputRef={inputRef}
                    // onClick={e => e.stopPropagation()} todo onKeyDown
                    // onKeyDown={event => {
                    //   if (event.keyCode === 13) {
                    //     event.preventDefault();
                    //     (event.target as HTMLElement).blur();
                    //   }
                    // }}
                  />
                </div>
              </CustomClickAwayListener>
            ) : (
              <p
                className={'w-fit max-w-[90%] truncate font-medium text-[var(--primary)]'}
                data-testid={'journey-card-name-text-test-id'}>
                {cardName}
              </p>
            )}
          </div>
        </WuTooltip>
        <div
          className={`${
            viewType === JourneyViewTypeEnum.BOARD ? 'flex flex-col-reverse' : ''
          }`}>
          {viewType === JourneyViewTypeEnum.STANDARD && (
            <div className={'text-xs leading-4'}>
              <div>
                {map?.owner?.firstName} {map?.owner?.lastName}
              </div>
              <div> {dayjs(map?.createdAt)?.format('MMM D, YYYY')}</div>
            </div>
          )}
          <div className={'flex items-center text-[0.75rem] min-h-[1.5rem] gap-[0.2rem] mt-[0.2rem] justify-start'}>
            {map?.childMaps && map?.childMaps?.length > 0 && (
              <>
                <span className={'wc-level-child'} />
                {map?.childMaps?.length} Child maps
              </>
            )}
          </div>

          <div className={'h-8 !mb-[2.2rem] !my-[0.3rem]'}>
            <PersonaImages
              mapId={map?.id}
              viewMode={SelectedPersonasViewModeEnum.MAP}
              personas={selectedPersonas}
              disconnectPersona={personaId => {
                setSelectedPersonas(prev => prev.filter(itm => itm?.id !== personaId));
              }}
            />
          </div>
          <div className={'text-[0.75rem] !my-[0.3rem]'}>
            Last updated {dayjs(map?.updatedAt)?.format('MMM D, YYYY')}
          </div>
        </div>
      </div>
    </>
  );
};

export default JourneyCard;
