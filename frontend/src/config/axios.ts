import axios, { AxiosError } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import {api, storage} from "./constants";
import {buildPath} from "../api/base.api";

export let axiosInstance = axios.create({
    timeout: 10000,
});

async function manualRefresh(refreshToken: string) {
    const url = buildPath(`${api.AUTH.PATH}${api.AUTH.SUBPATH_REFRESH}`);
    return axiosInstance.post(url, { token: refreshToken });
}

export const setAxiosAuthToken = (token: string) => {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAxiosAuthToken = () => {
    delete axiosInstance.defaults.headers.common.Authorization;
};

createAuthRefreshInterceptor(axiosInstance, async (failedRequest: AxiosError) => {
    removeAxiosAuthToken();
    const refreshToken = localStorage.getItem(storage.refreshToken);
    if (refreshToken) {
        const tokens = (await manualRefresh(refreshToken)).data;
        if (tokens.idToken) {
            localStorage.setItem(storage.idToken, tokens.idToken);
            setAxiosAuthToken(tokens.idToken);
            if (failedRequest.response) {
                failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokens.idToken;
            }
        }
    }
    return Promise.resolve();
}, {statusCodes: [ 401, 403 ]});
