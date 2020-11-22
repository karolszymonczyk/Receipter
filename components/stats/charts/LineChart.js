import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { VictoryChart, VictoryArea, VictoryTheme, VictoryAxis, VictoryScatter } from 'victory-native';
import Colors from '../../../constants/Colors';

const LineChart = ({ data, hasData, label }) => {
  const [interpolation, setInterpolation] = useState('linear');

  const screenWidth = Dimensions.get('window').width;

  return (
    <VictoryChart
      width={screenWidth}
      height={400}
      padding={{ left: 60, top: 30, bottom: 50, right: 30 }}
      animate={{ duration: 1000 }}
      theme={VictoryTheme.material}
      domainPadding={{ y: 30 }}
      events={[
        {
          target: 'parent',
          eventHandlers: {
            onPressIn: () => setInterpolation((prevMode) => (prevMode === 'linear' ? 'natural' : 'linear')),
          },
        },
      ]}
    >
      <VictoryArea
        style={{
          data: { fill: Colors.primary, fillOpacity: 0.3, stroke: Colors.primary },
          grid: { stroke: 'black', opacity: 0.5 },
        }}
        data={data}
        interpolation={interpolation}
      />
      <VictoryScatter data={data} style={{ data: { fill: Colors.primary } }} />
      <VictoryAxis
        dependentAxis
        style={{
          grid: { stroke: 'black', opacity: 0.2 },
          axisLabel: { padding: 49 },
        }}
        label={'Total PLN'}
        padding={10}
        domainPadding={20}
        tickFormat={(t) => (hasData ? t : '')}
      />
      <VictoryAxis
        crossAxis
        style={{
          grid: { stroke: 'black', opacity: 0.2 },
          axisLabel: { padding: 30 },
        }}
        label={label}
        reverseL
        fixLabelOverlap
      />
    </VictoryChart>
  );
};

export default LineChart;
