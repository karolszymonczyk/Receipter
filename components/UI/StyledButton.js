import React from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';

import StyledText from './StyledText';
import Colors from '../../constants/Colors';

const StyledButton = ({ onPress, color = Colors.primary, style, disabled = false, children }) => {
  return (
    <View style={{ ...styles.centered, ...style }}>
      <TouchableHighlight
        disabled={disabled}
        style={[styles.button, { backgroundColor: disabled ? Colors.disabled : color }]}
        onPress={onPress}
      >
        <StyledText style={styles.text}>{children}</StyledText>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  button: {
    borderRadius: 20,
    padding: 13,
    paddingHorizontal: 30,
    elevation: 2,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
});

export default StyledButton;
