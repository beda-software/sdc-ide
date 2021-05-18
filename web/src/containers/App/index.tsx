import React from 'react';
import { Route, Switch, HashRouter, Redirect } from 'react-router-dom';

import { history } from 'src/services/history';

import { Main } from 'src/containers/Main';

export function App() {
    return (
        <HashRouter>
            <Switch>
                <Route path="/:questionnaireId" exact>
                    <Main />
                </Route>
                <Redirect
                    to={{
                        pathname: 'demo-1',
                        state: { referrer: history.location.pathname },
                    }}
                />
            </Switch>
        </HashRouter>
    );
}
