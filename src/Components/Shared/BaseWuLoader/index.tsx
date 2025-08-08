import { WuLoader } from '@npm-questionpro/wick-ui-lib';

const BaseWuLoader = () => {
  return (
    <div
      className={'absolute z-10 !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/4'}
      data-testid={'wu-loader-section-test-id'}>
      <WuLoader />
    </div>
  );
};

export default BaseWuLoader;
