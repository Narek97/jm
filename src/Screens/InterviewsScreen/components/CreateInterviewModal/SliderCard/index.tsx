import { FC } from "react";

import QPLogo from "@/assets/public/base/qp-logo.svg";

interface ISliderCard {
  card: {
    id: number;
    name: string;
    prompt: string;
    aiJourneyModelId: number | null;
    attachmentUrl: string | null;
  };
  selectedSliderCardId: number | null;
  onHandleSelectAiModel: (id: number) => void;
}

const SliderCard: FC<ISliderCard> = ({
  card,
  selectedSliderCardId,
  onHandleSelectAiModel,
}) => {
  return (
    <div
      className={`create-interview-modal--slider-card ${
        card.id === selectedSliderCardId
          ? "create-interview-modal--slider-selected-card"
          : ""
      }`}
      key={card.id}
      onClick={() => {
        onHandleSelectAiModel(card.id);
      }}
    >
      {card.attachmentUrl ? (
        <img
          src={`${process.env.NEXT_PUBLIC_AWS_URL}/${card.attachmentUrl}`}
          alt="Img"
          width={100}
          height={100}
          style={{
            width: "100%",
            height: "5rem",
          }}
        />
      ) : (
        <div className={"create-interview-modal--logo-block"}>
          <img src={QPLogo} alt="QP Logo" />
        </div>
      )}

      <p className={"create-interview-modal--slider-card--title"}>
        {card.name}
      </p>
      <p className={"create-interview-modal--slider-card--description"}>
        {card.prompt}
      </p>
    </div>
  );
};

export default SliderCard;
