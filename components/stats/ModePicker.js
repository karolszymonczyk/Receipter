import React from 'react';
import { View, StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';
import Label from '../shared/Label';

const BasicReceiptsFiltering = ({ mode, setMode }) => {
  return (
    <View style={styles.container}>
      <Label selected={mode === 'categories'} selectedColor={Colors.secondary} onPress={() => setMode('categories')}>
        Categories
      </Label>
      <Label selected={mode === 'tags'} selectedColor={Colors.secondary} onPress={() => setMode('tags')}>
        Tags
      </Label>
      <Label selected={mode === 'summary'} selectedColor={Colors.secondary} onPress={() => setMode('summary')}>
        Summary
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
