import React, { useState } from 'react';
import { View, ScrollView, Modal, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import StyledText from '../UI/StyledText';
import StyledButton from '../UI/StyledButton';
import ReceiptForm from './ReceiptForm';
import Colors from '../../constants/Colors';
import CategoryPicker from './CategoryPicker';
import TagsPicker from './TagsPicker';
import ManageTagsModal from './ManageTagsModal';
import * as ReceiptsActions from '../../store/actions/receipts';

const ReceiptEditModal = ({ isVisible, onClose, initialValues, currentReceipt }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const onConfirm = async (category, selectedTags, values, { resetForm }) => {
    setIsLoading(true);
    let error = null;
    try {
      await dispatch(
        ReceiptsActions.editReceipt({
          id: currentReceipt.id,
          photo: currentReceipt.photo,
          title: values.title,
          company: values.company || '-',
          date: moment(values.date, 'dddd DD.MM.YYYY')
            .hours(values.time.substring(0, 2))
            .minutes(values.time.substring(3, 5))
            .toDate(),
          guaranteeDate: values.hasGuarantee ? moment(values.guaranteeDate, 'dddd DD.MM.YYYY').toDate() : null,
          total: parseFloat(values.total.replace(',', '.')),
          tags: selectedTags,
          category,
        })
      );
      resetForm({ values });
    } catch (err) {
      error = true;
      Alert.alert('Something went wrong...', 'Please try again later.', [{ text: 'OK' }]);
    }

    setIsLoading(false);
    !error && onClose();
  };

  return (
    <Modal animationType='slide' visible={isVisible}>
      <ScrollView contentContainerStyle={styles.content}>
        <ReceiptForm
          initialValues={initialValues}
          onSubmit={onConfirm}
          initialCategory={currentReceipt.category}
          initialTags={currentReceipt.tags}
          isLoading={isLoading}
        />
        <StyledButton onPress={onClose} color={Colors.danger}>
          Cancel
        </StyledButton>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: 100,
    padding: 10,
  },
});

export default ReceiptEditModal;
