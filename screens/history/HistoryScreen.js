import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Platform } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { orderBy, isEmpty } from 'lodash';

import FilteringModal from '../../components/shared/FilteringModal';
import StyledHeaderButton from '../../components/UI/StyledHeaderButton';
import HistoryItem from '../../components/history/HistoryItem';
import StyledText from '../../components/UI/StyledText';
import SearchBar from '../../components/history/SearchBar';

const HistoryScreen = (props) => {
  const [isFilteringMode, setIsFilteringMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [queryFilter, setQueryFilter] = useState(() => (receipt) => receipt);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const receipts = useSelector((state) => orderBy(state.receipts.userReceipts, ['date'], ['desc'])).filter(queryFilter);
  const total = receipts.reduce((acc, receipt) => acc + receipt.total, 0);

  const { navigation } = props;
  useEffect(() => {
    navigation.setParams({ edit: () => setIsFilteringMode(true) });
  }, [setIsFilteringMode]);

  const loadReceipts = () => {
    console.log('Fetching receipt...');
  };

  const handleQueryChange = (text) => {
    setSearchQuery(text);
    const lowerText = text.toLowerCase();
    setQueryFilter(() => (receipt) =>
      receipt.title.toLowerCase().includes(lowerText) || receipt.company.toLowerCase().includes(lowerText)
    );
  };

  // w historii można wypisać ile jest paragoników (po filtrach też) i ten przycisk do manulanego dodawania i usuwania filtrów
  // obsłużyć też jak nie ma wgl paragonów // ListEmptyComponent={}

  return (
    <>
      <FilteringModal isVisible={isFilteringMode} onClose={() => setIsFilteringMode(!isFilteringMode)} />
      <SearchBar query={searchQuery} onChange={handleQueryChange} placeholder='Search by title or company' />
      <FlatList
        ListHeaderComponent={
          <StyledText style={styles.header}>
            {receipts.length} Receipts, {total.toFixed(2)} PLN
          </StyledText>
        }
        style={styles.list}
        onRefresh={loadReceipts}
        refreshing={isRefreshing}
        data={receipts}
        renderItem={(itemData) => (
          <HistoryItem
            title={itemData.item.title}
            date={itemData.item.date}
            total={itemData.item.total}
            company={itemData.item.company}
            onClick={() => {
              props.navigation.navigate('ReceiptDetails', { receiptId: itemData.item.id });
            }}
          />
        )}
        numColumns={2}
        ListFooterComponent={
          !isEmpty(receipts) && <StyledText style={styles.footer}>Logos provided by Clearbit</StyledText>
        }
      />
    </>
  );
};

HistoryScreen.navigationOptions = (navData) => ({
  headerRight: () => (
    <HeaderButtons HeaderButtonComponent={StyledHeaderButton}>
      <Item
        title='Edit'
        iconName={Platform.OS === 'android' ? 'md-options' : 'ios-options'}
        onPress={navData.navigation.getParam('edit')}
      />
    </HeaderButtons>
  ),
});

const styles = StyleSheet.create({
  header: {
    fontSize: Platform.OS === 'android' ? 20 : 30,
    textAlign: 'center',
    paddingVertical: 5,
  },
  list: {
    paddingBottom: 10,
  },
  footer: {
    marginVertical: 20,
    textAlign: 'center',
  },
});

export default HistoryScreen;
