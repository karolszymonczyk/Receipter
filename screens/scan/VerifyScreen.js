import React, { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { HOST } from '../../constants/Hosts';
import ReceiptForm from '../../components/shared/ReceiptForm';
import * as ReceiptsActions from '../../store/actions/receipts';
import LoadingScreen from '../../components/shared/LoadingScreen';

const VerifyScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [data, setData] = useState({});
  const image = navigation.getParam('image');
  const dispatch = useDispatch();

  const fetchImageData = async () => {
    setIsLoading(true);
    const localUri = image.uri;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
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
    } catch (error) {
      Alert.alert('Something went wrong...', 'But you can still add your receipt manually', [{ text: 'OK' }]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    image && fetchImageData(image);
  }, [image]);


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
