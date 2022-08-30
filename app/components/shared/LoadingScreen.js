import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import StyledText from '../../components/UI/StyledText';
import Colors from '../../constants/Colors';

const LoadingScreen = ({ message = 'Lading...' }) => {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size='large' color={Colors.primary} />
      <StyledText style={styles.message}>{message}</StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 10,
  },
});

export default LoadingScreen;
