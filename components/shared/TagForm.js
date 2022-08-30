import React from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { capitalize } from 'lodash';
import RNPickerSelect from 'react-native-picker-select';
import { Formik, isEmptyArray } from 'formik';
import * as yup from 'yup';

import StyledText from '../UI/StyledText';
import Colors from '../../constants/Colors';
import IconButton from '../UI/IconButton';

const tagSchema = yup.object({
  selectedTag: yup.string().required(),
  value: yup
    .string()
    .required()
    .test('isValidPrice', 'value must be a valid price', (value) => /^\d+([,.]\d{1,2})?$/.test(value))
    .test(
      'isGreaterThanZero',
      'value must be greater than 0',
      (value) => value && parseFloat(value.replace(',', '.')) > 0
    ),
});

const TagForm = ({ initialValues, onSubmit, tags }) => {
  return (
    <Formik initialValues={initialValues} validationSchema={tagSchema} onSubmit={onSubmit} enableReinitialize>
      {({ isSubmitting, isValid, dirty, handleChange, handleBlur, errors, setFieldValue, handleSubmit, values }) => (
        <View style={styles.container}>
          <View style={styles.pickerContainer}>
            {!isEmptyArray(tags) ? (
              <RNPickerSelect
                style={{ inputIOS: styles.pickerIOS, inputAndroid: styles.pickerAndroid }}
                useNativeAndroidPickerStyle={false}
                placeholder={{}}
                value={values.selectedTag.key}
                onValueChange={(_, itemIndex) => setFieldValue('selectedTag', tags[itemIndex])}
                items={tags.map((tag) => ({
                  key: tag.key,
                  label: capitalize(tag.key),
                  value: tag.key,
                }))}
              />
            ) : (
              <StyledText>No tags left</StyledText>
            )}
          </View>
          <View style={styles.valueContainer}>
            <TextInput
              placeholder='value'
              style={{ ...styles.textInput, borderBottomColor: !values.value ? Colors.danger : Colors.accepted }}
              value={values.value}
              onChangeText={handleChange('value')}
              onBlur={handleBlur('value')}
              keyboardType='numeric'
              maxLength={10}
            />
            <StyledText style={styles.PLN}>PLN</StyledText>
          </View>
          <IconButton
            icon='ios-add'
            iconSize={35}
            disabled={!dirty || !isValid || isSubmitting}
            onPress={handleSubmit}
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  errorMessage: {
    color: Colors.danger,
    fontSize: 23,
    marginLeft: 70,
  },
  textInput: {
    borderBottomColor: Colors.accepted,
    borderBottomWidth: 1,
    paddingHorizontal: 2,
    paddingVertical: 2,
    fontSize: Platform.OS === 'android' ? 16 : 24,
    width: '100%',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    width: '23%',
  },
  PLN: {
    fontSize: Platform.OS === 'android' ? 20 : 30,
  },
  pickerContainer: {
    width: '45%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pickerIOS: {
    fontFamily: 'merchant',
    fontSize: 35,
  },
  pickerAndroid: {
    fontFamily: 'merchant',
    fontSize: 25,
    color: 'black',
  },
});

export default TagForm;
