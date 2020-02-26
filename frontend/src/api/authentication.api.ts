import { call } from 'redux-saga/effects';
import { axiosInstance } from '../config/axios';
import {api, oauth} from '../config/constants';
import { buildPath } from './base.api';

export function* exchangeCode(code: string) {
    const url = buildPath(`${api.AUTH.PATH}${api.AUTH.SUBPATH_CODE}`);
    return yield call(axiosInstance.post, url, { code: code, redirectUri: oauth.REDIRECT_URI });
}

export function* refresh(refreshToken: string) {
    const url = buildPath(`${api.AUTH.PATH}${api.AUTH.SUBPATH_REFRESH}`);
    return yield call(axiosInstance.post, url, { token: refreshToken });
}
