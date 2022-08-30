import React, { useState } from 'react';
import { View, TextInput, Keyboard, StyleSheet } from 'react-native';
import CheckBox from 'react-native-check-box';
import { Formik } from 'formik';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as yup from 'yup';
import moment from 'moment';

import StyledText from '../UI/StyledText';
import StyledButton from '../UI/StyledButton';
import Colors from '../../constants/Colors';
import ManageTagsModal from './ManageTagsModal';
import CategoryPicker from './CategoryPicker';
import TagsPicker from './TagsPicker';

const receiptSchema = yup.object({
  company: yup.string(),
  date: yup.string().required(),
  time: yup.string().required(),
  total: yup
    .string()
    .required()
    .test('isValidPrice', 'total must be a valid price', (value) => /^\d+([,.]\d{1,2})?$/.test(value))
    .test(
      'isGreaterThanZero',
      'value must be greater than 0',
      (value) => value && parseFloat(value.replace(',', '.')) > 0
    ),
});

const ReceiptForm = ({ initialValues, onSubmit, initialCategory, initialTags = [], isLoading = false }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isGuranteeDatePickerVisible, setGuaranteeDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [category, setCategory] = useState(initialCategory);
  const [selectedTags, setSelectedTags] = useState(initialTags);
  const [isTagsManagementMode, setIsTagsManagementMode] = useState(false);

  const showDatePicker = (setVisible) => {
    setVisible(true);
    Keyboard.dismiss();
  };

  const handleConfirmDate = (date, setDateValue, setVisible) => {
    setDateValue(moment(date).format('dddd DD.MM.YYYY'));
    setVisible(false);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
    Keyboard.dismiss();
  };

  const handleConfirmTime = (date, setTimeValue) => {
    setTimeValue(new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setTimePickerVisibility(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={receiptSchema}
      onSubmit={(value, form) => onSubmit(category, selectedTags, value, form)}
      enableReinitialize
    >
      {({ isSubmitting, isValid, handleChange, handleBlur, setFieldValue, errors, touched, handleSubmit, values }) => (
        <View style={styles.container}>
          <View style={styles.fieldContainer}>
            <View style={styles.inputContainer}>
              <StyledText style={styles.label}>Title:</StyledText>
              <TextInput style={styles.textInput} onChangeText={handleChange('title')} value={values.title} />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.inputContainer}>
              <StyledText style={styles.label}>Company:</StyledText>
              <TextInput style={styles.textInput} onChangeText={handleChange('company')} value={values.company} />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.inputContainer}>
              <StyledText style={styles.label}>Date:</StyledText>
              <DateTimePickerModal
                style={styles.datePicker}
                isVisible={isDatePickerVisible}
                mode='date'
                headerTextIOS='Pick date'
                isDarkModeEnabled={false}
                date={values.date ? moment(values.date, 'dddd DD.MM.YYYY').toDate() : new Date()}
                onConfirm={(date) => handleConfirmDate(date, handleChange('date'), setDatePickerVisibility)}
                onCancel={() => setDatePickerVisibility(false)}
              />
              <TextInput
                style={{ ...styles.textInput, borderBottomColor: !values.date ? Colors.danger : Colors.accepted }}
                value={values.date?.toString() || ''}
                onFocus={() => showDatePicker(setDatePickerVisibility)}
              />
            </View>
            {errors.date && touched.date && (
              <StyledText style={styles.errorMessage}>{'date is a required field'}</StyledText>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.inputContainer}>
              <StyledText style={styles.label}>Time:</StyledText>
              <DateTimePickerModal
                // textColor='black'
                style={styles.datePicker}
                isVisible={isTimePickerVisible}
                headerTextIOS='Pick time'
                isDarkModeEnabled={false}
                mode='time'
                date={
                  values.time
                    ? new Date(1998, 1, 1, values.time.substring(0, 2), values.time.substring(3, 5))
                    : new Date()
                }
                onConfirm={(date) => handleConfirmTime(date, handleChange('time'))}
                onCancel={() => setTimePickerVisibility(false)}
              />
              <TextInput
                style={{ ...styles.textInput, borderBottomColor: !values.time ? Colors.danger : Colors.accepted }}
                value={values.time}
                onFocus={showTimePicker}
              />
            </View>
            {errors.time && touched.time && <StyledText style={styles.errorMessage}>{errors.time}</StyledText>}
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.inputContainer}>
              <StyledText style={styles.label}>Total:</StyledText>
              <TextInput
                style={{
                  ...styles.textInput,
                  borderBottomColor: !values.total || errors.total ? Colors.danger : Colors.accepted,
                }}
                onChangeText={handleChange('total')}
                onBlur={handleBlur('total')}
                value={values.total}
                keyboardType='numeric'
                maxLength={10}
              />
              <StyledText>PLN</StyledText>
            </View>
            {errors.total && touched.total && <StyledText style={styles.errorMessage}>{errors.total}</StyledText>}
          </View>

          <View style={styles.checkBoxContainer}>
            <StyledText style={styles.label}>Guarantee:</StyledText>
            <CheckBox
              checkBoxColor={Colors.primary}
              onClick={() => setFieldValue('hasGuarantee', !values.hasGuarantee)}
              isChecked={values.hasGuarantee}
            />
          </View>
          {values.hasGuarantee && (
            <View>
              <View style={styles.inputContainer}>
                <StyledText style={styles.guaranteeLabel}>Date:</StyledText>
                <DateTimePickerModal
                  style={styles.datePicker}
                  isVisible={isGuranteeDatePickerVisible}
                  mode='date'
                  headerTextIOS='Pick date'
                  isDarkModeEnabled={false}
                  date={moment(values.guaranteeDate, 'dddd DD.MM.YYYY').toDate()}
                  onConfirm={(date) =>
                    handleConfirmDate(date, handleChange('guaranteeDate'), setGuaranteeDatePickerVisibility)
                  }
                  onCancel={() => setGuaranteeDatePickerVisibility(false)}
                />
                <TextInput
                  style={styles.textInput}
                  value={values.guaranteeDate}
                  onFocus={() => showDatePicker(setGuaranteeDatePickerVisibility)}
                />
              </View>
            </View>
          )}

          <ManageTagsModal isVisible={isTagsManagementMode} onClose={() => setIsTagsManagementMode(false)} />
          <StyledText style={styles.label}>Category:</StyledText>
          <CategoryPicker selected={category} onChange={setCategory} />
          <View style={styles.flexContainer}>
            <StyledText style={styles.label}>Tags:</StyledText>
            <StyledText style={styles.manageTags} onPress={() => setIsTagsManagementMode(true)}>
              Manage Tags
            </StyledText>
          </View>
          <TagsPicker
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            receiptValue={parseFloat(values.total?.replace(',', '.')) || ''}
          />

          <StyledButton
            style={styles.button}
            onPress={handleSubmit}
            disabled={!isValid || isSubmitting}
            isLoading={isLoading}
          >
            Confirm
          </StyledButton>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  checkBoxContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: Platform.OS === 'android' ? 23 : 33,
    marginRight: 15,
  },
  errorMessage: {
    color: Colors.danger,
    fontSize: Platform.OS === 'android' ? 14 : 23,
    marginLeft: 70,
  },
  guaranteeLabel: {
    fontSize: Platform.OS === 'android' ? 23 : 30,
    marginRight: 15,
    paddingLeft: 15,
  },
  textInput: {
    borderBottomColor: Colors.accepted,
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 2,
    paddingVertical: 4,
    flex: 1,
    fontSize: Platform.OS === 'android' ? 12 : 19,
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  manageTags: {
    marginRight: 5,
    color: Colors.primary,
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 60,
  },
  datePicker: {
    shadowColor: '#000000',
    shadowRadius: 0,
    shadowOpacity: 1,
    shadowOffset: { height: 0, width: 0 },
  },
});

export default ReceiptForm;
