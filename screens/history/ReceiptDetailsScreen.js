import React from 'react';
import { View, ScrollView, Image, Button, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const ReceiptDetailsScreen = (props) => {
  const receiptId = props.navigation.getParam('receiptId');
  const selectedReceipt = useSelector((state) =>
    state.receipts.userReceipts.find((receipt) => receipt.id === receiptId)
  );

  return (
    <View>
      <Text>{selectedReceipt.shop}</Text>
    </View>
  );
};

ReceiptDetailsScreen.navigationOptions = {
  headerTitle: 'Receipt Details',
};

const styles = StyleSheet.create({});

export default ReceiptDetailsScreen;
