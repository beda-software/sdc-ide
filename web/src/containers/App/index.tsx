import queryString from 'query-string';
import { useEffect, useRef } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

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
    const location = useLocation();
    const clientId = new URLSearchParams(location.search).get('client');
    if (clientId) {
        localStorage.setItem('clientId', clientId);
    }

    const originPathRef = useRef(location.pathname);

    return (
        <RenderRemoteData remoteData={userResponse}>
            {(user) =>
                user ? (
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
                ) : (
                    <Switch>
                        <Route path="/auth" render={() => <Auth />} />
                        <Route
                            path="/signin"
                            render={() => <SignIn originPathName={originPathRef.current} />}
                        />
                        <Redirect to={{ pathname: '/signin' }} />
                    </Switch>
                )
            }
        </RenderRemoteData>
    );
}

interface SignInProps {
    originPathName?: string;
}

function SignIn(props: SignInProps) {
    const clientId = localStorage.getItem('clientId');
    if (clientId) {
        authorize(clientId, { nextUrl: props.originPathName });
    } else {
        console.error('Client ID is not specified');
    }

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
