import { StrictMode } from 'react';
// eslint-disable-next-line import/order
import ReactDOM from 'react-dom';

import 'web/src/services/initialize.develop';
import 'web/src/styles/index.scss';
// import { getData } from 'web/src/services/localStorage';

 
import { axiosInstance } from 'aidbox-react/lib/services/instance';

import { App } from './containers/App';
import * as serviceWorker from './serviceWorker';

console.log('axiosInstance', axiosInstance.defaults);


// const { baseUrl } = getData('connection');


// axiosInstance.defaults.baseURL = baseUrl;

ReactDOM.render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
