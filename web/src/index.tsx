import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import { App } from './containers/App';
import * as serviceWorker from './serviceWorker';

import 'web/src/services/initialize.develop';
import 'web/src/styles/index.scss';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <StrictMode>
        <Router>
            <App />
        </Router>
    </StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
