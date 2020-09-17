import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import HistoryItem from '../../components/history/HistoryItem';

const HistoryScreen = (props) => {
  const receipts = useSelector((state) => state.receipts.userReceipts);

  return (
    <FlatList
      style={styles.list}
      data={receipts}
      renderItem={(itemData) => (
        <HistoryItem
          date={itemData.item.date}
          total={itemData.item.total}
          shop={itemData.item.shop}
          onClick={() => {
            props.navigation.navigate('ReceiptDetails', { receiptId: itemData.item.id });
          }}
        />
      )}
      numColumns={2}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingTop: 10,
  },
});

export default HistoryScreen;
