import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { omit } from 'lodash';
import moment from 'moment';

import { HOST } from '../../constants/Host';
import ReceiptForm from '../../components/shared/ReceiptForm';
import LoadingScreen from '../../components/shared/LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import StyledButton from '../../components/UI/StyledButton';
import StyledText from '../../components/UI/StyledText';

const VerifyScreen = ({ navigation }) => {
  // const [isLoading, setIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(''); // handle errors
  const image = navigation.getParam('image');

  const fetchImageData = async () => {
    const localUri = image.uri;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append('photo', { uri: localUri, name: filename, type });
    try {
      const res = await fetch(`${HOST}/photo`, {
        method: 'POST',
        body: formData,
        headers: {
          'content-type': 'multipart/form-data',
        },
      });
      const resData = await res.json();
      setData(resData);
    } catch (error) {
      setError('Something went wrong... Please check your internet connection');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // make cleanup
    image && fetchImageData(image);
  }, [image]);

  // useEffect(() => {
  //   // naprawić że nie ładuje jak się stąd wyjdzie środkowym
  //   fetchImageData();
  // }, []);

  const confirm = (values, { resetForm }) => {
    resetForm({ values });
    const receiptData = {
      ...omit(values, 'time'),
      company: values.company || '-',
      date: moment(values.date, 'dddd DD.MM.YYYY')
        .hours(values.time.substring(0, 2))
        .minutes(values.time.substring(3, 5))
        .toDate(),
      guaranteeDate: values.hasGuarantee ? moment(values.guaranteeDate, 'dddd DD.MM.YYYY').toDate() : null,
    };
    navigation.navigate('Classify', { receiptData, photo: image.uri });
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

  // return (
  //   <ScrollView>
  //     <ReceiptForm initialValues={initialValues} onSubmit={confirm} />
  //   </ScrollView>
  // );

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

  return isLoading ? (
    <LoadingScreen message='Reading photo...' />
  ) : (
    <ScrollView>
      <ReceiptForm initialValues={initialValues} onSubmit={confirm} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  autocomplete: {
    flex: 1,
    width: '100%',
  },
  input: {
    flex: 1,
    width: '100%',
  },
});

export default VerifyScreen;
