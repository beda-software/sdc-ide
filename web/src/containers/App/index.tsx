import queryString from 'query-string';
import { useEffect } from 'react';
import { Route, Switch, Redirect, Router, useLocation } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { success } from 'aidbox-react/lib/libs/remoteData';

import {
    authorize,
    getToken,
    parseOAuthState,
    restoreUserSession,
    setToken,
} from '../../services/auth';
import { history } from '../../services/history';
import { Main } from '../Main';

export function App() {
    const [userResponse] = useService(async () => {
        const appToken = getToken();
        return appToken ? restoreUserSession(appToken) : success(null);
    });

    return (
        <RenderRemoteData remoteData={userResponse}>
            {(user) => (
                <Router history={history}>
                    <Switch>
                        {user ? (
                            <>
                                <Route path="/:questionnaireId" exact>
                                    <Main />
                                </Route>
                                <Redirect
                                    to={{
                                        pathname: 'demo-1',
                                        state: { referrer: history.location.pathname },
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <Route path="/auth" render={() => <Auth />} />
                                <Route path="/signin" render={() => <SignIn />} />
                                <Redirect
                                    to={{
                                        pathname: '/signin',
                                        state: { referrer: history.location.pathname },
                                    }}
                                />
                            </>
                        )}
                    </Switch>
                </Router>
            )}
        </RenderRemoteData>
    );
}

function SignIn() {
    authorize();
    return null;
}

export function Auth() {
    const location = useLocation();

    useEffect(() => {
        const queryParams = queryString.parse(location.hash);

        if (queryParams.access_token) {
            setToken(queryParams.access_token as string);
            const state = parseOAuthState(queryParams.state as string | undefined);

            window.location.href = state.nextUrl ?? '/';
        }
    }, [location.hash]);

    return null;
}
