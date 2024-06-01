import queryString from 'query-string';
import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { setData } from 'web/src/services/localStorage';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { useService } from 'fhir-react/lib/hooks/service';
import { success } from 'fhir-react/lib/libs/remoteData';

import { User } from 'shared/src/contrib/aidbox';

import {
    authorize,
    getToken,
    parseOAuthState,
    restoreUserSession,
    setToken,
} from '../../services/auth';
import { Main } from '../Main';
import { FormRenderContext } from '../Main/context';
import { AEHRCFormWrapper } from './AEHRCFormWrapper';

export function App() {
    const [userResponse] = useService<User | null>(async () => {
        const appToken = getToken();
        return appToken ? restoreUserSession(appToken) : success(null);
    });
    const location = useLocation();
    const clientId = new URLSearchParams(location.search).get('client');
    if (clientId) {
        localStorage.setItem('clientId', clientId);
        setData('connection', {
            client: clientId,
            baseUrl:
                (window as any).BASE_URL === '{{BASE_URL}}'
                    ? 'http://localhost:8080'
                    : (window as any).BASE_URL,
        });
    }

    const originPathRef = useRef(location.pathname);

    return (
        <RenderRemoteData remoteData={userResponse}>
            {(user) =>
                user ? (
                    <Routes>
                        <Route path="/:questionnaireId" element={
                            <FormRenderContext.Provider value={AEHRCFormWrapper}>
                                <Main />
                            </FormRenderContext.Provider>
                        } />
                        <Route
                            path="*"
                            element={
                                <>
                                    <Navigate to="/demo-1" />
                                </>
                            }
                        />
                    </Routes>
                ) : (
                    <Routes>
                        <Route path="/auth" element={<Auth />} />
                        <Route
                            path="/signin"
                            element={<SignIn originPathName={originPathRef.current} />}
                        />
                        <Route
                            path="*"
                            element={
                                <>
                                    <Navigate to="/signin" replace={true} />
                                </>
                            }
                        />
                    </Routes>
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
