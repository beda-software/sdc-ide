import React from 'react';
import { Route, Switch, Router, Redirect } from 'react-router-dom';

import { history } from 'src/services/history';

import { DemoPage } from 'src/containers/DemoPage';

export function App() {
    return (
        <Router history={history}>
            <Switch>
                <Route path="/" exact>
                    <DemoPage />
                </Route>
                <Redirect
                    to={{
                        pathname: '/',
                        state: { referrer: history.location.pathname },
                    }}
                />
            </Switch>
        </Router>
    );
}
