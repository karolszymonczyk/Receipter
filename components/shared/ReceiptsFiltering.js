import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';

import StyledText from '../UI/StyledText';
import StyledButton from '../UI/StyledButton';

const ReceiptsFiltering = ({ isVisible, onClose }) => {
  return (
    <View style={styles.centered}>
      <Modal animationType='slide' transparent={true} visible={isVisible} s>
        <View style={styles.centered}>
          <View style={styles.container}>
            <StyledText style={styles.text}>Hello World!</StyledText>
            <StyledButton onPress={onClose}>Close</StyledButton>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  container: {
    margin: 20,
    alignItems: 'center',
    borderRadius: 20,
    padding: 30,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
    shadowRadius: 3,
    shadowOpacity: 0.25,
  },
  text: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ReceiptsFiltering;
