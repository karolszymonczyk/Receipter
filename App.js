import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

import receiptsReducuer from './store/reducers/receipts';
import tagsReducer from './store/reducers/tags';
import AppBottomTabNavigator from './navigation/AppBottomTabNavigator';

const rootReducer = combineReducers({
  receipts: receiptsReducuer,
  tags: tagsReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

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
      <AppBottomTabNavigator />
    </Provider>
  );
}
