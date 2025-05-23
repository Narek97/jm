import { FC, useCallback, useMemo } from "react";

import "./style.scss";
import { useNavigate } from "@tanstack/react-router";

import CustomLongMenu from "@/Components/Shared/CustomLongMenu";
import { INTERVIEW_CARD_OPTIONS } from "@/Screens/InterviewsScreen/constants.tsx";
import { InterviewType } from "@/Screens/InterviewsScreen/types.ts";
import { MenuViewTypeEnum } from "@/types/enum.ts";

interface IInterviewCard {
  interview: InterviewType;
  onHandleView: (interview: InterviewType) => void;
  onHandleDelete: (interview: InterviewType) => void;
}

const InterviewCard: FC<IInterviewCard> = ({
  interview,
  onHandleView,
  onHandleDelete,
}) => {
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
    <li className={"interview-card"} data-testid="interview-card-test-id">
      <div className={"interview-card--menu"}>
        <CustomLongMenu
          type={MenuViewTypeEnum.VERTICAL}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          item={interview}
          options={options}
          sxStyles={{
            display: "inline-block",
            background: "transparent",
          }}
        />
      </div>

      <p
        className={"interview-card--name"}
        data-testid="interview-card-name-test-id"
      >
        {interview.name}
      </p>
      <p
        className={"interview-card--text"}
        data-testid="interview-card-text-test-id"
      >
        {interview.text}
      </p>
    </li>
  );
};

export default InterviewCard;
