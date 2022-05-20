import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { Store } from './src/redux/store';
import Router from './src/router';

const App = () => {
  return (
      <Provider store={Store}>
          <Router />
      </Provider>
  );
};

export default App;