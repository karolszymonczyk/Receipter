import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { VictoryPie, VictoryTheme } from 'victory-native';
import { reject } from 'lodash';

const MODES = ['classic', 'bubble', 'donut'];

const PieChart = ({ data, hasData }) => {
  const [mode, setMode] = useState(MODES[0]);

  const screenWidth = Dimensions.get('window').width;

  return (
    <VictoryPie
      theme={VictoryTheme.material}
      width={screenWidth}
      padding={100}
      colorScale='warm' // do tagów bo samo kolory dobierze
      data={hasData ? reject(data, (element) => element.y === 0.0) : [{ x: 'No data', y: 100 }]}
      animate={{ duration: 1000 }}
      labels={({ datum }) => (hasData ? `${datum.x} ${Math.round(datum.percent) || '<1'}%` : 'No data')}
      labelPlacement={hasData ? 'parallel' : 'vertical'}
      labelPosition={hasData ? 'centroid' : 'startAngle'}
      labelRadius={100}
      padAngle={mode === 'donut' ? 2 : 0}
      sortKey='x'
      fixLabelOverlap
      cornerRadius={({ datum }) => (mode === 'bubble' ? datum.percent : 0)}
      innerRadius={mode === 'donut' ? 50 : 0}
      events={[
        {
          target: 'data',
          eventHandlers: {
            onPressIn: () => setMode((prevMode) => MODES[(MODES.indexOf(prevMode) + 1) % MODES.length]),
          },
        },
      ]}
    />
  );
};

export default PieChart;
