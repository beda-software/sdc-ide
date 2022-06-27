import React from 'react';
import ReactDOM from 'react-dom';

import 'web/src/services/initialize.develop';

import 'web/src/styles/index.scss';

import * as serviceWorker from './serviceWorker';
import { axiosInstance } from 'aidbox-react/lib/services/instance';
import { getData } from 'web/src/services/localStorage';
import { App } from './containers/App';

const { client, secret, baseUrl } = getData('connection');

axiosInstance.defaults.auth = {
    username: client,
    password: secret,
};

axiosInstance.defaults.baseURL = baseUrl;

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
