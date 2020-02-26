import { call } from 'redux-saga/effects';
import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { buildPath } from './base.api';

export function* get(id: number) {
    const url = buildPath(`${api.EXAMPLE_API.PATH}/${id}`);
    return yield call(axiosInstance.get, url);
}

export function* update(id: number, param: string) {
    const url = buildPath(`${api.EXAMPLE_API.PATH}/${id}${api.EXAMPLE_API.SUBPATH_EXAMPLE}`);
    return yield call(axiosInstance.post, url, { param });
}
