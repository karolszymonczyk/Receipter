import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { capitalize } from 'lodash';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as yup from 'yup';

import StyledText from '../UI/StyledText';
import Colors from '../../constants/Colors';
import IconButton from '../UI/IconButton';

const tagSchema = yup.object({
  selectedTag: yup.string().required(),
  value: yup
    .string()
    .required()
    .test('isValidPrice', 'value must be a valid price', (value) => /^\d+([,.]\d{1,2})?$/.test(value)),
});

const TagForm = ({ initialValues, onSubmit, tags }) => {
  return (
    <Formik initialValues={initialValues} validationSchema={tagSchema} onSubmit={onSubmit} enableReinitialize>
      {({ isSubmitting, isValid, dirty, handleChange, handleBlur, errors, setFieldValue, handleSubmit, values }) => (
        <View style={styles.container}>
          <Picker
            style={styles.tagsPicker}
            selectedValue={values.selectedTag.key}
            onValueChange={(itemValue, itemIndex) => setFieldValue('selectedTag', tags[itemIndex])}
            // mode='dropdown' // for android (dropdown, dialog)
          >
            {tags.map((tag) => (
              <Picker.Item key={tag.key} label={capitalize(tag.key)} value={tag.key} />
            ))}
          </Picker>
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
        // {errors.total && touched.total && <StyledText style={styles.errorMessage}>{errors.total}</StyledText>} // add error message
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsPicker: {
    width: '45%',
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
    fontSize: 24,
    width: '100%',
  },

  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    width: '23%',
  },
  PLN: {
    fontSize: 30,
  },
});

export default TagForm;
