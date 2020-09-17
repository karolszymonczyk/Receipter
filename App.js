import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import receiptsReducuer from './store/reducers/receipts';
import HistoryNavigator from './navigation/HistoryNavigator';

const rootReducer = combineReducers({
  receipts: receiptsReducuer,
});

const store = createStore(rootReducer);

export default function App() {
  return (
    <Provider store={store}>
      <HistoryNavigator />
    </Provider>
  );
}
