/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/es/integration/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import configureStore from '../store/index';
import * as serviceWorker from './register-service-worker';
import Routes from './routes/index';

// Components
import Loading from './components/UI/Loading';

// Load css
import './styles/style.scss';

const { persistor, store, dispatch } = configureStore();
// persistor.purge(); // Debug to clear persist

toast.configure();

const Root = () => (
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
      <Router dispatch={dispatch} store={store}>
        <Routes />
      </Router>
    </PersistGate>
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
