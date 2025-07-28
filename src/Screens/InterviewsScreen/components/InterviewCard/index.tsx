import { FC, useCallback, useMemo } from 'react';

import './style.scss';
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
    <li className={'interview-card'} data-testid="interview-card-test-id">
      <div className={'interview-card--menu'}>
        <BaseWuMenu options={options} />
      </div>

      <p className={'interview-card--name'} data-testid="interview-card-name-test-id">
        {interview.name}
      </p>
      <p className={'interview-card--text'} data-testid="interview-card-text-test-id">
        {interview.text}
      </p>
    </li>
  );
};

export default InterviewCard;
