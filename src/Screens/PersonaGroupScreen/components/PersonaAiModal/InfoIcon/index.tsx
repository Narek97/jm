import './style.scss';
import { WuTooltip } from '@npm-questionpro/wick-ui-lib';

const InfoIcon = () => {
  return (
    <WuTooltip
      className="wu-tooltip-content"
      content="Add behavioural and usage context"
      position="right">
      <span className="wm-info"></span>
    </WuTooltip>
  );
};

export default InfoIcon;
