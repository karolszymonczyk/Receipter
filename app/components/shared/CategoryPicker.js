import React from 'react';
import { StyleSheet, View } from 'react-native';
import { capitalize } from 'lodash';
import RNPickerSelect from 'react-native-picker-select';

import Categories from '../../constants/Categories';

const CategoryPicker = ({ selected, onChange }) => {
  return (
    <View style={styles.pickerContainer}>
      <RNPickerSelect
        style={{ inputIOS: styles.pickerIOS, inputAndroid: styles.pickerAndroid }}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        value={selected}
        onValueChange={onChange}
        items={Object.values(Categories).map((category) => ({
          key: category,
          label: capitalize(category),
          value: category,
        }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  pickerIOS: {
    fontFamily: 'merchant',
    fontSize: 50,
  },
  pickerAndroid: {
    fontFamily: 'merchant',
    fontSize: 35,
    color: 'black',
  },
});

export default CategoryPicker;
