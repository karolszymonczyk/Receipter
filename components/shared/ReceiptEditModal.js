import React, { useState } from 'react';
import { ScrollView, Modal, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import StyledText from '../UI/StyledText';
import StyledButton from '../UI/StyledButton';
import ReceiptForm from './ReceiptForm';
import Colors from '../../constants/Colors';
import CategoryPicker from './CategoryPicker';
import TagsPicker from './TagsPicker';
import * as ReceiptsActions from '../../store/actions/receipts';

const FilteringModal = ({ isVisible, onClose, initialValues, currentReceipt }) => {
  const [category, setCategory] = useState(currentReceipt.category);
  const [selectedTags, setSelectedTags] = useState(currentReceipt.tags);

  const dispatch = useDispatch();

  const onConfirm = (values) => {
    dispatch(
      ReceiptsActions.editReceipt({
        id: currentReceipt.id,
        userId: currentReceipt.userId,
        photo: currentReceipt.photo,
        tags: selectedTags,
        category,
        title: values.title,
        company: values.company || '-',
        date: moment(values.date, 'dddd DD.MM.YYYY')
          .hours(values.time.substring(0, 2))
          .minutes(values.time.substring(3, 5))
          .toDate(),
        total: parseFloat(values.total.replace(',', '.')),
        guaranteeDate: values.hasGuarantee ? moment(values.guaranteeDate, 'dddd DD.MM.YYYY').toDate() : null,
      })
    );
    onClose();
  };

  return (
    <Modal animationType='slide' visible={isVisible}>
      <ScrollView contentContainerStyle={styles.content}>
        <StyledText style={styles.label}>Category:</StyledText>
        <CategoryPicker selected={category} onChange={setCategory} />
        <StyledText style={styles.label}>Tags:</StyledText>
        <TagsPicker selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        <ReceiptForm initialValues={initialValues} onSubmit={onConfirm} />
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
  label: {
    fontSize: 40,
  },
});

export default FilteringModal;
