import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, StyleSheet, View } from 'react-native';
import { omit } from 'lodash';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { HOST } from '../../constants/Hosts';
import ReceiptForm from '../../components/shared/ReceiptForm';
import * as ReceiptsActions from '../../store/actions/receipts';
import LoadingScreen from '../../components/shared/LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import StyledButton from '../../components/UI/StyledButton';
import StyledText from '../../components/UI/StyledText';

const VerifyScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [data, setData] = useState({});
  const image = navigation.getParam('image');
  const dispatch = useDispatch();

  const fetchImageData = async () => {
    setIsLoading(true);
    const localUri = image.uri;
    // getting filename of the photo from mobile
    const filename = localUri.split('/').pop();
    // ?
    const match = /\.(\w+)$/.exec(filename); // ???
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append('photo', { uri: localUri, name: filename, type });
    try {
      const res = await fetch(`${HOST}/classify`, {
        method: 'POST',
        body: formData,
        headers: {
          'content-type': 'multipart/form-data',
        },
      });
      const resData = await res.json();
      setData(resData);
      // zmienić też te kategorie żeby pasowały do backendu
    } catch (error) {
      Alert.alert('Something went wrong...', 'But you can still add your receipt manually', [{ text: 'OK' }]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // make cleanup
    image && fetchImageData(image);
  }, [image]);

  // useEffect(() => {
  //   console.log('DATA:', data);
  // }, [data]);

  // useEffect(() => {
  //   // naprawić że nie ładuje jak się stąd wyjdzie środkowym
  //   fetchImageData();
  // }, []);

  // trimować jeszcze te inputy z tylca
  const confirm = async (category, selectedTags, values, { resetForm }) => {
    setIsLoadingButton(true);
    let error = null;
    try {
      await dispatch(
        ReceiptsActions.addReceipt({
          title: values.title.trim(),
          company: values.company?.trim() || '-',
          date: moment(values.date, 'dddd DD.MM.YYYY')
            .hours(values.time.substring(0, 2))
            .minutes(values.time.substring(3, 5))
            .toDate(),
          guaranteeDate: values.hasGuarantee ? moment(values.guaranteeDate, 'dddd DD.MM.YYYY').toDate() : null,
          total: parseFloat(values.total.replace(',', '.')),
          photo: image.uri,
          tags: selectedTags,
          category,
        })
      );
      resetForm({ values });
    } catch (err) {
      error = true;
      Alert.alert('Something went wrong...', 'Please try again later.', [{ text: 'OK' }]);
    }

    setIsLoadingButton(false);
    !error && navigation.navigate('History');
  };

  const initialValues = {
    title: '',
    company: '',
    date: moment(data.date, 'YYYY-MM-DD').isValid() ? moment(data.date, 'YYYY-MM-DD').format('dddd DD.MM.YYYY') : null,
    time: data.time,
    total: data.total?.toString().replace('.', ','),
    hasGuarantee: false,
    guaranteeDate: moment(new Date()).format('dddd DD.MM.YYYY'),
  };

  return isLoading ? (
    <LoadingScreen message='Processing photo...' />
  ) : (
    <ScrollView>
      <ReceiptForm
        initialValues={initialValues}
        initialCategory={data.category}
        onSubmit={confirm}
        isLoading={isLoadingButton}
      />
    </ScrollView>
  );
};

export default VerifyScreen;

// --------------------------------------------------------------------------

// const fetchCompanies = async () => {
//   console.log('SIEMANO KLIKANO');
//   try {
//     const res = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=:hm`);
//     const resData = await res.json();
//     console.log(resData);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const onDropdownShow = () => {
//   console.log('SHOW');
// };

// const onDropdownClose = () => {
//   console.log('CLOSED');
// };

// const handleSelectItem = (item, index) => {
//   onDropdownClose();
//   console.log(item);
// };

// const renderAuto = () => (
//   <View>
//     <StyledText>PODPOWIEDZI TUTAJ</StyledText>
//   </View>
// );
