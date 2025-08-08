import { WuTooltip } from '@npm-questionpro/wick-ui-lib';

const InfoIcon = () => {
  return (
    <WuTooltip
      className="break-all"
      content="Add behavioural and usage context"
      position="right">
      <span className="wm-info text-[1.2rem] rounded-full cursor-pointer"></span>
    </WuTooltip>
  );
};

export default InfoIcon;
