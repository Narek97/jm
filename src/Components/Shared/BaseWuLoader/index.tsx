import { WuLoader } from '@npm-questionpro/wick-ui-lib';

const BaseWuLoader = () => {
  return (
    <div
      className={'absolute top-2/4! left-2/4! translate-x-[-50%]! translate-y-[-50%]! z-10'}
      data-testid={'wu-loader-section-test-id'}>
      <WuLoader />
    </div>
  );
};

export default BaseWuLoader;
