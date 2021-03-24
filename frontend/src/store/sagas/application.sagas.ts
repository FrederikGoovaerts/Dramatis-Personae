import { parse } from 'query-string';
import { put, takeEvery } from 'redux-saga/effects';

import { exchangeCode, refresh } from '../../api/authentication.api';
import { removeAxiosAuthToken, setAxiosAuthToken } from '../../config/axios';
import { oauth, rootRoute, storage } from '../../config/constants';
import { history } from '../../config/state';
import { TokenResponse } from '../../types/auth.types';
import { applicationActions } from '../actions';

interface FormAttribute {
    name: string;
    value: string;
}

function redirectToOauth() {
    const form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', 'https://accounts.google.com/o/oauth2/v2/auth');
    const params: FormAttribute[] = [
        { name: 'client_id', value: oauth.CLIENT_ID },
        { name: 'redirect_uri', value: oauth.REDIRECT_URI },
        { name: 'response_type', value: 'code' },
        { name: 'access_type', value: 'offline' },
        { name: 'prompt', value: 'consent' },
        { name: 'scope', value: 'profile email openid' }
    ];
    for (const p of params) {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p.name);
        input.setAttribute('value', p.value);
        form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
}

function* initializeApplication() {
    if (oauth.AUTH_NOT_REQUIRED) {
        yield put(applicationActions.actions.setAuthorized(true));
        yield put(applicationActions.actions.setInitialized(true));
        return;
    }

    if (window.location.search) {
        const search = parse(window.location.search);
        if (search.code && typeof search.code === 'string') {
            const tokens: TokenResponse = yield exchangeCode(search.code);
            if (tokens.idToken && tokens.refreshToken) {
                localStorage.setItem(storage.idToken, tokens.idToken);
                localStorage.setItem(storage.refreshToken, tokens.refreshToken);
                // Clean current URL
                const preRedirectPath = localStorage.getItem(storage.preRedirectPath);
                console.log(preRedirectPath);
                localStorage.removeItem(storage.preRedirectPath);
                history.replace(preRedirectPath || rootRoute());
            }
        }
    }

    const refreshToken = localStorage.getItem(storage.refreshToken);
    if (refreshToken) {
        const tokens: TokenResponse = yield refresh(refreshToken);
        if (tokens.idToken && tokens.refreshToken) {
            localStorage.setItem(storage.idToken, tokens.idToken);
            localStorage.setItem(storage.refreshToken, tokens.refreshToken);
            setAxiosAuthToken(tokens.idToken);
            yield put(applicationActions.actions.setAuthorized(true));
            yield put(applicationActions.actions.setInitialized(true));
            return;
        }
    }

    // Fall through in case no valid token is present
    localStorage.removeItem(storage.idToken);
    localStorage.setItem(storage.preRedirectPath, window.location.pathname);
    redirectToOauth();
}

function* logout() {
    if (!oauth.AUTH_NOT_REQUIRED) {
        localStorage.removeItem(storage.idToken);
        removeAxiosAuthToken();
        yield put(applicationActions.actions.clearStore());
        yield put(applicationActions.actions.setAuthorized(false));
        redirectToOauth();
    } else {
        window.location.reload();
    }
}

export default function* watcher() {
    yield takeEvery(applicationActions.names.initialize, initializeApplication);
    yield takeEvery(applicationActions.names.logout, logout);
}
