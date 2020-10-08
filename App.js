import React, { useState } from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

import receiptsReducuer from './store/reducers/receipts';
import HistoryNavigator from './navigation/HistoryNavigator';

const rootReducer = combineReducers({
  receipts: receiptsReducuer,
});

const store = createStore(rootReducer);

const fetchFonts = () => {
  return Font.loadAsync({
    merchant: require('./assets/fonts/Merchant-Copy.ttf'),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return <AppLoading startAsync={fetchFonts} onFinish={() => setFontLoaded(true)} />;
  }
  return (
    <Provider store={store}>
      <HistoryNavigator />
    </Provider>
  );
}
