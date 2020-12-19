import React from 'react';
import { View, TouchableOpacity, TouchableNativeFeedback, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

const IconButton = ({
  onPress,
  color = Colors.primary,
  icon,
  iconSize = 28,
  disabled = false,
  isLoading = false,
  style,
}) => {
  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }

  return (
    <View style={{ ...styles.centered, ...style }}>
      {isLoading ? (
        <ActivityIndicator style={styles.roundButton} color={color} />
      ) : (
        <TouchableComponent style={styles.roundButton} onPress={onPress} disabled={disabled}>
          <Ionicons name={icon} size={iconSize} color={disabled ? Colors.disabled : color} />
        </TouchableComponent>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
  },
});

export default IconButton;
