import { FC } from 'react';

import { PieChart as MyPieChart } from 'react-minimal-pie-chart';

interface ICustomPieChart {
  data: { title: string; value: number; color: string }[];
  startAngle: number;
  lengthAngle: number;
  lineWidth: number;
}

const CustomPieChart: FC<ICustomPieChart> = ({ data, startAngle, lengthAngle, lineWidth }) => {
  return (
    <div>
      <MyPieChart
        data={data}
        startAngle={startAngle}
        lengthAngle={lengthAngle}
        lineWidth={lineWidth}
      />
    </div>
  );
};

export default CustomPieChart;
