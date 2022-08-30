import React from 'react';
import { Text, Platform, StyleSheet } from 'react-native';

const StyledText = (props) => {
  return (
    <Text {...props} style={[styles.text, props.style]}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'merchant',
    fontSize: Platform.OS === 'android' ? 18 : 25,
  },
});

export default StyledText;
