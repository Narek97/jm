import { FC, useCallback, useMemo } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { INTERVIEW_CARD_OPTIONS } from '../../constants';
import { InterviewType } from '../../types';

import BaseWuMenu from '@/Components/Shared/BaseWuMenu';

interface IInterviewCard {
  interview: InterviewType;
  onHandleView: (interview?: InterviewType) => void;
  onHandleDelete: (interview?: InterviewType) => void;
}

const InterviewCard: FC<IInterviewCard> = ({ interview, onHandleView, onHandleDelete }) => {
  const navigate = useNavigate();

  const onHandleNavigateToMap = useCallback(() => {
    navigate({
      to: `/board/${interview.boardId}/journey-map/${interview.mapId}`,
    }).then();
  }, [interview.boardId, interview.mapId, navigate]);

  const options = useMemo(() => {
    return INTERVIEW_CARD_OPTIONS({
      onHandleNavigateToMap,
      onHandleView,
      onHandleDelete,
    });
  }, [onHandleDelete, onHandleNavigateToMap, onHandleView]);

  return (
    <li
      className={'group card-borders w-[17.75rem] h-[12.5rem] p-4'}
      data-testid="interview-card-test-id">
      <div className={'absolute right-2 top-2 invisible group-hover:visible!'}>
        <BaseWuMenu options={options} item={interview} />
      </div>

      <p className={'reduce-text text-[var(--primary)]'} data-testid="interview-card-name-test-id">
        {interview.name}
      </p>
      <p className={'line-clamp-4 mt-4 text-[0.875rem]'} data-testid="interview-card-text-test-id">
        {interview.text}
      </p>
    </li>
  );
};

export default InterviewCard;
