import { call } from 'redux-saga/effects';
import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { buildPath } from './base.api';

export function* update(id: string, contents: string) {
    const url = buildPath(`${api.CHARACTER.PATH}/${id}`);
    return yield call(axiosInstance.put, url, { contents });
}

export function* deletePermanently(id: string) {
    const url = buildPath(`${api.NOTE.PATH}/${id}`);
    return yield call(axiosInstance.delete, url);
}
