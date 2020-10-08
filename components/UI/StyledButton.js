import React from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';

import StyledText from './StyledText';
import Colors from '../../constants/Colors';

const styledButton = ({ onPress, color = Colors.primary, style, children }) => {
  return (
    <View style={{ ...styles.centered, ...style }}>
      <TouchableHighlight style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
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
    paddingLeft: 30,
    paddingRight: 30,
    elevation: 2,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
});

export default styledButton;
