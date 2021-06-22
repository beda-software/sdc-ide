import React from 'react';
import ReactDOM from 'react-dom';

import 'src/services/initialize.develop';

import { App } from 'src/containers/App';
import 'src/styles/index.scss';

import * as serviceWorker from './serviceWorker';
import { axiosInstance } from 'aidbox-react/src/services/instance';
import { getData } from 'src/services/localStorage';

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
