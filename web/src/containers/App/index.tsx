import React from 'react';
import { Route, Switch, Router, Redirect } from 'react-router-dom';
import { Token } from 'aidbox-react/lib/services/token';

import { history } from 'src/services/history';

import { DemoPage } from 'src/containers/DemoPage';

export function App() {
    const [appToken] = React.useState<Token | undefined>();

    const renderAnonymousRoutes = () => (
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
    );

    const renderAuthenticatedRoutes = () => {
        const referrer = history?.location?.state?.referrer;

        return (
            <Switch>
                <Route path="/app" render={() => <div>App</div>} />
                <Redirect to={referrer !== '/' ? referrer : '/app'} />
            </Switch>
        );
    };

    const renderRoutes = () => {
        if (appToken) {
            return renderAuthenticatedRoutes();
        }

        return renderAnonymousRoutes();
    };

    return (
        <Router history={history}>
            <Switch>{renderRoutes()}</Switch>
        </Router>
    );
}
