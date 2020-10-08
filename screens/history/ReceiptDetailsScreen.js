import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector } from 'react-redux';
import { capitalize } from 'lodash';
import moment from 'moment';

import StyledText from '../../components/UI/StyledText';
import StyledButton from '../../components/UI/StyledButton';
import StyledHeaderButton from '../../components/UI/StyledHeaderButton';
import ReceiptEditModal from '../../components/shared/ReceiptEditModal';
import Colors from '../../constants/Colors';

const ReceiptDetailsScreen = ({ navigation }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const receiptId = navigation.getParam('receiptId');
  const selectedReceipt = useSelector((state) =>
    state.receipts.userReceipts.find((receipt) => receipt.id === receiptId)
  );

  useEffect(() => {
    navigation.setParams({ edit: () => setIsEditMode(true) });
  }, [setIsEditMode]);

  return (
    <ScrollView>
      <ReceiptEditModal isVisible={isEditMode} onClose={() => setIsEditMode(!isEditMode)} />

      <View style={styles.data}>
        <View style={styles.row}>
          <StyledText>Shop:</StyledText>
          <StyledText>{selectedReceipt.shop}</StyledText>
        </View>
        <View style={styles.row}>
          <StyledText>Date:</StyledText>
          <StyledText>{moment(selectedReceipt.date).format('dddd DD.MM.YY')}</StyledText>
        </View>
        <View style={styles.row}>
          <StyledText>Category:</StyledText>
          <StyledText>{capitalize(selectedReceipt.category)}</StyledText>
        </View>
        <View style={styles.row}>
          <StyledText>Total:</StyledText>
          <StyledText>{selectedReceipt.total.toFixed(2)} PLN</StyledText>
        </View>
        {selectedReceipt.reclamationDate && (
          <View style={styles.row}>
            <StyledText>Reclamation date:</StyledText>
            <StyledText>{moment(selectedReceipt.reclamationDate).format('dddd DD.MM.YY')}</StyledText>
          </View>
        )}
      </View>
      <Image style={styles.image} source={{ uri: selectedReceipt.photo }} />
      <StyledButton onPress={() => {}} color={Colors.danger}>
        Delete
      </StyledButton>
    </ScrollView>
  );
};

ReceiptDetailsScreen.navigationOptions = (navData) => ({
  headerTitle: 'Receipt Details',
  headerRight: () => (
    <HeaderButtons HeaderButtonComponent={StyledHeaderButton}>
      <Item title='Edit' iconName='md-create' onPress={navData.navigation.getParam('edit')} />
    </HeaderButtons>
  ),
});

const styles = StyleSheet.create({
  data: {
    margin: 20,
  },
  image: {
    width: '100%',
    height: 300,
  },
  row: {
    marginVertical: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ReceiptDetailsScreen;
