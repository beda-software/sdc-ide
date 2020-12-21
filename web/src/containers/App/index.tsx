import React from 'react';
import { Route, Switch, Router, Redirect } from 'react-router-dom';

import { history } from 'src/services/history';

import { Main } from 'src/containers/Main';

export function App() {
    return (
        <Router history={history}>
            <Switch>
                <Route path="/:questionnaireId" exact>
                    <Main />
                </Route>
                <Redirect
                    to={{
                        pathname: '/demo-1',
                        state: { referrer: history.location.pathname },
                    }}
                />
            </Switch>
        </Router>
    );
}
