import React from 'react';
import { Text, StyleSheet } from 'react-native';

const StyledText = (props) => {
  return (
    <Text {...props} style={[props.style, styles.text]}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'merchant',
    fontSize: 25,
  },
});

export default StyledText;
