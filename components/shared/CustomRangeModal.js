import React, { useState } from 'react';
import { View, Modal, TextInput, Keyboard, StyleSheet, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { RadioButton } from 'react-native-paper';
import moment from 'moment';

import StyledText from '../UI/StyledText';
import StyledButton from '../UI/StyledButton';
import Colors from '../../constants/Colors';

const CustomRangeModal = ({ isVisible, mode, onApply, onClose }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [units, setUnits] = useState('months');

  const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);

  const showDatePicker = (setVisible) => {
    setVisible(true);
    Keyboard.dismiss();
  };

  const handleConfirmDate = (date, setDate, setVisible) => {
    setDate(date);
    setVisible(false);
  };

  return (
    <Modal animationType='slide' transparent={true} visible={isVisible} s>
      <View style={styles.centered}>
        <View style={styles.container}>
          <View style={styles.flexContainer}>
            <StyledText style={styles.label}>Start date:</StyledText>
            <DateTimePickerModal
              // textColor='black'
              style={styles.datePicker}
              isVisible={isStartDatePickerVisible}
              mode='date'
              headerTextIOS='Pick date'
              isDarkModeEnabled={false}
              date={startDate}
              onConfirm={(date) => handleConfirmDate(date, setStartDate, setIsStartDatePickerVisible)}
              onCancel={() => setIsStartDatePickerVisible(false)}
            />
            <TextInput
              style={styles.textInput}
              value={moment(startDate).format('DD.MM.YYYY')}
              onFocus={() => showDatePicker(setIsStartDatePickerVisible)}
            />
          </View>
          <View style={styles.flexContainer}>
            <StyledText style={styles.label}>End date:</StyledText>
            <DateTimePickerModal
              style={styles.datePicker}
              isVisible={isEndDatePickerVisible}
              mode='date'
              headerTextIOS='Pick date'
              isDarkModeEnabled={false}
              date={endDate}
              onConfirm={(date) => handleConfirmDate(date, setEndDate, setIsEndDatePickerVisible)}
              onCancel={() => setIsEndDatePickerVisible(false)}
            />
            <TextInput
              style={styles.textInput}
              value={moment(endDate).format('DD.MM.YYYY')}
              onFocus={() => showDatePicker(setIsEndDatePickerVisible)}
            />
          </View>

          {mode === 'summary' && (
            <View style={styles.unitsContainer}>
              <StyledText style={styles.label}>Unit:</StyledText>
              <View style={styles.flexContainer}>
                <View style={[styles.flexContainer, styles.radio]}>
                  <StyledText onPress={() => setUnits('days')}>Days</StyledText>
                  <RadioButton
                    value={units}
                    status={units === 'days' ? 'checked' : 'unchecked'}
                    onPress={() => setUnits('days')}
                    color={Colors.primary}
                  />
                </View>
                <View style={[styles.flexContainer, styles.radio]}>
                  <StyledText onPress={() => setUnits('months')}>Months</StyledText>
                  <RadioButton
                    value={units}
                    status={units === 'months' ? 'checked' : 'unchecked'}
                    onPress={() => setUnits('months')}
                    color={Colors.primary}
                  />
                </View>
                <View style={[styles.flexContainer, styles.radio]}>
                  <StyledText onPress={() => setUnits('years')}>Years</StyledText>
                  <RadioButton
                    value={units}
                    status={units === 'years' ? 'checked' : 'unchecked'}
                    onPress={() => setUnits('years')}
                    color={Colors.primary}
                  />
                </View>
              </View>
            </View>
          )}

          <View style={styles.flexContainer}>
            <StyledButton style={styles.button} color={Colors.danger} onPress={onClose}>
              Close
            </StyledButton>
            <StyledButton
              disabled={endDate.getTime() < startDate.getTime()}
              style={styles.button}
              onPress={() => onApply(startDate, endDate, units)}
            >
              Apply
            </StyledButton>
          </View>
        </View>
      </View>
    </Modal>
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
  flexContainer: {
    flexDirection: 'row',
  },
  button: {
    margin: 10,
  },
  label: {
    fontSize: Platform.OS === 'android' ? 20 : 30,
    marginRight: 15,
  },
  textInput: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 2,
    width: 100,
    fontSize: Platform.OS === 'android' ? 10 : 20,
  },
  radio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unitsContainer: {
    marginTop: 10,
  },
  datePicker: {
    shadowColor: '#000000',
    shadowRadius: 0,
    shadowOpacity: 1,
    shadowOffset: { height: 0, width: 0 },
  },
});

export default CustomRangeModal;
