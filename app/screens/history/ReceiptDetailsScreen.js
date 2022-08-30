import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Alert, StyleSheet, Platform } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import { capitalize, isEmpty } from 'lodash';
import moment from 'moment';

import StyledText from '../../components/UI/StyledText';
import StyledButton from '../../components/UI/StyledButton';
import StyledHeaderButton from '../../components/UI/StyledHeaderButton';
import Colors from '../../constants/Colors';
import ReceipEditModal from '../../components/shared/ReceiptEditModal';
import * as ReceiptsActions from '../../store/actions/receipts';

const ReceiptDetailsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const receiptId = navigation.getParam('receiptId');
  const selectedReceipt = useSelector((state) =>
    state.receipts.userReceipts.find((receipt) => receipt.id === receiptId)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    navigation.setParams({ edit: () => setIsEditMode(true) });
  }, [setIsEditMode]);

  const handleDelete = async () => {
    setIsLoading(true);
    let error = null;
    try {
      await dispatch(
        ReceiptsActions.deleteReceipt({
          id: selectedReceipt.id,
        })
      );
    } catch (err) {
      error = true;
      Alert.alert('Something went wrong...', 'Please try again later.', [{ text: 'OK' }]);
    }

    setIsLoading(false);
    !error && navigation.goBack();
  };

  const initialValues = {
    title: selectedReceipt?.title,
    company: selectedReceipt?.company,
    date: moment(selectedReceipt?.date).format('dddd DD.MM.YYYY'),
    time: selectedReceipt?.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    total: selectedReceipt?.total.toFixed(2).toString().replace('.', ','),
    hasGuarantee: !!selectedReceipt?.guaranteeDate,
    guaranteeDate: !!selectedReceipt?.guaranteeDate
      ? moment(selectedReceipt.guaranteeDate).format('dddd DD.MM.YYYY')
      : moment(new Date()).format('dddd DD.MM.YYYY'),
  };

  const createTwoButtonAlert = () =>
    Alert.alert('Are you sure?', 'Receipt data will be lost', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      { text: 'Yes', onPress: handleDelete },
    ]);

  return selectedReceipt ? (
    <ScrollView>
      <ReceipEditModal
        isVisible={isEditMode}
        onClose={() => setIsEditMode(!isEditMode)}
        initialValues={initialValues}
        currentReceipt={selectedReceipt}
      />
      <View style={styles.data}>
        <View style={styles.row}>
          <StyledText>Title:</StyledText>
          <StyledText>{selectedReceipt.title}</StyledText>
        </View>
        <View style={styles.row}>
          <StyledText>Company:</StyledText>
          <StyledText>{selectedReceipt.company}</StyledText>
        </View>
        <View style={styles.row}>
          <StyledText>Date:</StyledText>
          <StyledText>{moment(selectedReceipt.date).format('dddd DD.MM.YYYY')}</StyledText>
        </View>
        <View style={styles.row}>
          <StyledText>Time:</StyledText>
          <StyledText>{selectedReceipt.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</StyledText>
        </View>
        <View style={styles.row}>
          <StyledText>Category:</StyledText>
          <StyledText>{capitalize(selectedReceipt.category)}</StyledText>
        </View>
        <View style={styles.row}>
          <StyledText>Total:</StyledText>
          <StyledText>{selectedReceipt.total.toFixed(2)} PLN</StyledText>
        </View>
        {selectedReceipt.guaranteeDate && (
          <View style={styles.row}>
            <StyledText>Guarantee date:</StyledText>
            <StyledText>{moment(selectedReceipt.guaranteeDate).format('dddd DD.MM.YYYY')}</StyledText>
          </View>
        )}
        {!isEmpty(selectedReceipt.tags) && (
          <View>
            <StyledText>Tags:</StyledText>
            {selectedReceipt.tags.map((tag, idx) => (
              <View
                key={idx}
                style={[
                  styles.row,
                  styles.indentation,
                  { backgroundColor: idx % 2 ? 'transparent' : 'rgba(52, 52, 52, 0.05)' },
                ]}
              >
                <StyledText style={styles.cell}>{capitalize(tag.key)}</StyledText>
                <StyledText style={styles.cell}>{tag.value.toFixed(2)} PLN</StyledText>
              </View>
            ))}
          </View>
        )}
      </View>
      <Image style={styles.image} source={{ uri: selectedReceipt.photo }} resizeMode='contain' />
      <StyledButton style={styles.button} onPress={createTwoButtonAlert} color={Colors.danger} isLoading={isLoading}>
        Delete
      </StyledButton>
    </ScrollView>
  ) : (
    <View></View>
  );
};

ReceiptDetailsScreen.navigationOptions = (navData) => ({
  headerTitle: Platform.OS === 'android' ? 'Details' : 'Receipt Details',
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
    height: 500,
  },
  row: {
    marginVertical: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    padding: 1,
    paddingHorizontal: 4,
  },
  indentation: {
    marginLeft: 40,
  },
  button: {
    margin: 50,
  },
});

export default ReceiptDetailsScreen;
