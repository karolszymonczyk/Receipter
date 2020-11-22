import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import CategoryPicker from '../../components/shared/CategoryPicker';
import TagsPicker from '../../components/shared/TagsPicker';
import StyledText from '../../components/UI/StyledText';
import StyledButton from '../../components/UI/StyledButton';
import { HOST } from '../../constants/Host';
import * as ReceiptsActions from '../../store/actions/receipts';
import LoadingScreen from '../../components/shared/LoadingScreen';

const ClassifyScreen = ({ navigation }) => {
  const receiptData = navigation.getParam('receiptData');
  const photo = navigation.getParam('photo');

  // const [isLoading, setIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const dispatch = useDispatch();

  const fetchCategory = async () => {
    try {
      const res = await fetch(`${HOST}/category/`);
      const resData = await res.json();
      console.log(resData);
      setCategory(resData.category);
    } catch (error) {
      setError('Something went wrong... Please check your internet connection');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    receiptData && fetchCategory();
  }, [category, receiptData]);

  const confirm = () => {
    dispatch(
      ReceiptsActions.addReceipt({
        id: Math.floor(Math.random() * 1000), // idk
        userId: Math.floor(Math.random() * 1000), // idk
        title: receiptData.title,
        photo,
        company: receiptData.company,
        date: receiptData.date,
        total: parseFloat(receiptData.total.replace(',', '.')),
        guaranteeDate: receiptData.guaranteeDate,
        category,
        tags: selectedTags,
      })
    );
    navigation.navigate('History');
  };

  return isLoading ? (
    <LoadingScreen message='Classifying receipt...' />
  ) : (
    <ScrollView style={styles.container}>
      <StyledText style={styles.label}>Category:</StyledText>
      <CategoryPicker selected={category} onChange={setCategory} />
      <StyledText style={styles.label}>Tags:</StyledText>
      <TagsPicker selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      <StyledButton style={styles.button} onPress={confirm}>
        Confirm
      </StyledButton>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 30,
  },
  label: {
    fontSize: 40,
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
  },
  button: {
    marginVertical: 60,
  },
});

export default ClassifyScreen;
