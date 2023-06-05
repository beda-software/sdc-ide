import { isFailure, success } from 'aidbox-react/lib/libs/remoteData';
import { resetInstanceToken, setInstanceToken } from 'aidbox-react/lib/services/instance';
import { service } from 'aidbox-react/lib/services/service';
import { extractErrorCode } from 'aidbox-react/lib/utils/error';

import { User } from 'shared/src/contrib/aidbox';

import { getData } from './localStorage';

export function getUserInfo() {
    const {
        connection: { baseUrl },
    } = getData();

    return service<User>({
        baseURL: baseUrl,
        method: 'GET',
        url: '/auth/userinfo',
    });
}

export function getToken() {
    return window.localStorage.getItem('token') || undefined;
}

export async function restoreUserSession(token: string) {
    setInstanceToken({ access_token: token, token_type: 'Bearer' });

    const userResponse = await getUserInfo();

    if (isFailure(userResponse) && extractErrorCode(userResponse.error) !== 'network_error') {
        resetInstanceToken();

        return success(null);
    }

    return userResponse;
}

export interface OAuthState {
    nextUrl?: string;
}

export function formatOAuthState(state: OAuthState) {
    return btoa(JSON.stringify(state));
}

export function getAuthorizeUrl(clientId: string, state?: OAuthState) {
    const stateStr = state ? `&state=${formatOAuthState(state)}` : '';
    const {
        connection: { baseUrl },
    } = getData();

    return `${baseUrl}/auth/authorize?client_id=${clientId}&response_type=token${stateStr}`;
}

export function authorize(clientId: string, state?: OAuthState) {
    window.location.href = getAuthorizeUrl(clientId, state);
}

export function setToken(token: string) {
    window.localStorage.setItem('token', token);
}

export function parseOAuthState(state?: string): OAuthState {
    try {
        return state ? JSON.parse(atob(state)) : {};
    } catch {}

    return {};
}
