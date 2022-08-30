import React from 'react';
import { View, StyleSheet } from 'react-native';
import { orderBy } from 'lodash';

import StyledText from '../UI/StyledText';

const StatsTable = ({ data, total, mode }) => {
  const orderedData = ['categories', 'tags'].includes(mode) ? orderBy(data, ['y'], ['desc']) : data;

  return (
    <>
      <StyledText style={styles.total}>Total PLN: {total.toFixed(2)}</StyledText>
      <View style={styles.devider}>
        <View style={styles.line}></View>
      </View>
      <View style={styles.tableContainer}>
        {orderedData.map((row, idx) => (
          <View key={idx} style={[styles.row, { backgroundColor: idx % 2 ? 'rgba(52, 52, 52, 0.05)' : 'transparent' }]}>
            <StyledText style={styles.cell}>{row.x}</StyledText>
            <StyledText style={[styles.cell, styles.center]}>{row.percent.toFixed(2)}%</StyledText>
            <StyledText style={[styles.cell, styles.end]}>{row.y.toFixed(2)}</StyledText>
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 1,
  },
  grey: {
    backgroundColor: 'rgba(52, 52, 52, 0.1)',
  },
  cell: {
    flex: 1,
    padding: 1,
    paddingHorizontal: 4,
  },
  center: {
    textAlign: 'center',
  },
  end: {
    textAlign: 'right',
  },
  total: {
    textAlign: 'right',
    fontSize: Platform.OS === 'android' ? 25 : 30,
  },
  devider: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  line: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginTop: 5,
    marginBottom: 5,
    width: '35%',
  },
});

export default StatsTable;
