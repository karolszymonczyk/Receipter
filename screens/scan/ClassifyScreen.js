import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import CategoryPicker from '../../components/shared/CategoryPicker';
import TagsPicker from '../../components/shared/TagsPicker';
import StyledText from '../../components/UI/StyledText';
import StyledButton from '../../components/UI/StyledButton';
import ManageTagsModal from '../../components/shared/ManageTagsModal';
import Colors from '../../constants/Colors';
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
  const [isTagsManagementMode, setIsTagsManagementMode] = useState(false);

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
      <ManageTagsModal isVisible={isTagsManagementMode} onClose={() => setIsTagsManagementMode(false)} />
      <StyledText style={styles.label}>Category:</StyledText>
      <CategoryPicker selected={category} onChange={setCategory} />
      <View style={styles.flexContainer}>
        <StyledText style={styles.label}>Tags:</StyledText>
        <StyledText style={styles.manageTags} onPress={() => setIsTagsManagementMode(true)}>
          Manage Tags
        </StyledText>
      </View>
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
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  manageTags: {
    marginRight: 5,
    color: Colors.primary,
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
