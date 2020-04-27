import { axiosInstance } from '../config/axios';
import { api, oauth } from '../config/constants';
import { buildPath } from './base.api';
import { TokenResponse } from '../types/auth.types';

export async function exchangeCode(code: string): Promise<TokenResponse> {
    const url = buildPath(`${api.AUTH.PATH}${api.AUTH.SUBPATH_CODE}`);
    return (await axiosInstance.post(url, { code: code, redirectUri: oauth.REDIRECT_URI })).data;
}

export async function refresh(refreshToken: string): Promise<TokenResponse> {
    const url = buildPath(`${api.AUTH.PATH}${api.AUTH.SUBPATH_REFRESH}`);
    return (await axiosInstance.post(url, { token: refreshToken })).data;
}
