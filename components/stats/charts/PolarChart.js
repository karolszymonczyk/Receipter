import React from 'react';
import { VictoryChart, VictoryArea, VictoryPolarAxis, VictoryTheme } from 'victory-native';

import Colors from '../../../constants/Colors';

const PolarChart = ({ data }) => {
  return (
    <VictoryChart polar padding={85} animate={{ duration: 1000 }} theme={VictoryTheme.material}>
      <VictoryArea data={data} style={{ data: { fill: Colors.primary } }} />
      <VictoryPolarAxis
        style={{
          grid: { stroke: 'black', opacity: 0.2 },
          tickLabels: { padding: 10 },
        }}
      />
    </VictoryChart>
  );
};

export default PolarChart;
