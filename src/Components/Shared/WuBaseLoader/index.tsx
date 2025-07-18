import './style.scss';
import { WuLoader } from '@npm-questionpro/wick-ui-lib';

const WuBaseLoader = () => {
  return (
    <div className={'wu-loader-section'} data-testid={'wu-loader-section-test-id'}>
      <WuLoader/>
    </div>
  );
};

export default WuBaseLoader;
