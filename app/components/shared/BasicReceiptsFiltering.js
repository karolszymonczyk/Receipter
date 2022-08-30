import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

import moment from 'moment';
import Label from './Label';

const BasicReceiptsFiltering = ({ dateRange, setDateRange, setRangePicker }) => {
  const handeRangeClick = () => {
    setDateRange('range');
    setRangePicker(true);
  };

  return (
    <View style={styles.container}>
      <Label selected={dateRange === 'month'} selectedColor={Colors.primary} onPress={() => setDateRange('month')}>
        {moment(new Date()).format('MMMM')}
      </Label>
      <Label selected={dateRange === 'year'} selectedColor={Colors.primary} onPress={() => setDateRange('year')}>
        {moment(new Date()).format('YYYY')}
      </Label>
      <Label selected={dateRange === 'all'} selectedColor={Colors.primary} onPress={() => setDateRange('all')}>
        ALL
      </Label>
      <Label selected={dateRange === 'range'} selectedColor={Colors.primary} onPress={handeRangeClick}>
        RANGE
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    backgroundColor: 'white', // change for android
    paddingHorizontal: 3,
  },
});

export default BasicReceiptsFiltering;
