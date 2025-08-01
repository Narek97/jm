import { WuToggle } from '@npm-questionpro/wick-ui-lib';

const DemographicInfo = ({
  needDemographicData,
  onChange,
}: {
  needDemographicData: boolean;
  onChange: (value: boolean) => void;
}) => {
  return (
    <div className="flex items-center">
      <WuToggle
        label="Demographic information"
        labelPosition="right"
        checked={needDemographicData}
        onChange={onChange}
        data-testid="demographic-info-toggle"
      />
    </div>
  );
};

export default DemographicInfo;
