import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AsyncStorage } from 'react-native';

import LoadingScreen from '../components/shared/LoadingScreen';
import * as AuthActions from '../store/actions/auth';

const StartScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const logIn = async () => {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (!userInfo) {
        navigation.navigate('Auth');
        return;
      }

      const parsedData = JSON.parse(userInfo);
      const { token, userId, expirationDate } = parsedData;
      const currExpirationDate = new Date(expirationDate);

      if (!token || !userId || currExpirationDate.getTime() <= new Date().getTime()) {
        navigation.navigate('Auth');
        return;
      }

      navigation.navigate('App');
      dispatch(AuthActions.auth(token, userId));
    };

    logIn();
  }, [dispatch]);

  return <LoadingScreen message='' />;
};

export default StartScreen;
