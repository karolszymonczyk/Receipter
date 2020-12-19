import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Platform } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { orderBy, isEmpty } from 'lodash';

import ReceiptsFilteringModal from '../../components/shared/ReceiptsFilteringModal';
import StyledHeaderButton from '../../components/UI/StyledHeaderButton';
import HistoryItem from '../../components/history/HistoryItem';
import StyledText from '../../components/UI/StyledText';
import SearchBar from '../../components/history/SearchBar';
import * as ReceiptsActions from '../../store/actions/receipts';
import LoadingScreen from '../../components/shared/LoadingScreen';
import StyledButton from '../../components/UI/StyledButton';

const HistoryScreen = (props) => {
  const [isFilteringMode, setIsFilteringMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [queryFilter, setQueryFilter] = useState(() => (receipt) => receipt);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isRefreshing, setIsRefreshing] = useState(false); //?

  const dispatch = useDispatch();

  const receipts = useSelector((state) => orderBy(state.receipts.userReceipts, ['date'], ['desc'])).filter(queryFilter);
  const total = receipts.reduce((acc, receipt) => acc + receipt.total, 0);

  const { navigation } = props;
  useEffect(() => {
    navigation.setParams({ edit: () => setIsFilteringMode(true) });
  }, [setIsFilteringMode]);

  const loadReceipts = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(ReceiptsActions.loadReceipts());
    } catch (err) {
      if (err.message === 'UNAUTH') {
        navigation.navigate('Auth');
      }
      setError('Somethink went wrong ;/ Please try again later.');
    }
    setIsLoading(false); // mem leak
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

  useEffect(() => {
    const listener = props.navigation.addListener('willFocus', loadReceipts);
    return () => {
      listener.remove();
    };
  }, [loadReceipts]);

  const handleQueryChange = (text) => {
    setSearchQuery(text);
    const lowerText = text.toLowerCase();
    setQueryFilter(() => (receipt) =>
      receipt.title.toLowerCase().includes(lowerText) || receipt.company.toLowerCase().includes(lowerText)
    );
  };

  // ten przycisk do manulanego dodawania i usuwania filtrów
  return error ? (
    <>
      <StyledText style={styles.message}>{error}</StyledText>
      <StyledButton onPress={loadReceipts}>Try again</StyledButton>
    </>
  ) : (
    <>
      <ReceiptsFilteringModal isVisible={isFilteringMode} onClose={() => setIsFilteringMode(!isFilteringMode)} />
      <SearchBar query={searchQuery} onChange={handleQueryChange} placeholder='Search by title or company' />
      {isLoading ? (
        <LoadingScreen message='Loading receipts...' />
      ) : (
        <FlatList
          ListHeaderComponent={
            !isEmpty(receipts) && (
              <StyledText style={styles.header}>
                {receipts.length} Receipts, {total.toFixed(2)} PLN
              </StyledText>
            )
          }
          ListEmptyComponent={<StyledText style={styles.message}>No receipts found</StyledText>}
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
      )}
    </>
  );
};

HistoryScreen.navigationOptions = (navData) => ({
  headerRight: () => (
    <HeaderButtons HeaderButtonComponent={StyledHeaderButton}>
      <Item
        title='Filter'
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
  message: {
    marginVertical: '20%',
    marginHorizontal: 20,
    textAlign: 'center',
    fontSize: Platform.OS === 'android' ? 20 : 30,
  },
});

export default HistoryScreen;
