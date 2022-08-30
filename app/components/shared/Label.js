import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import StyledText from '../UI/StyledText';

const Label = ({ selected, selectedColor, onPress, children }) => {
  return (
    <TouchableOpacity style={[styles.label, { backgroundColor: selected ? selectedColor : 'white' }]} onPress={onPress}>
      <StyledText style={[styles.text, { color: selected ? 'white' : 'black' }]}>{children}</StyledText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  label: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
});

export default Label;
