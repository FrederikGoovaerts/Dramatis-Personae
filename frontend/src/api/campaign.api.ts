import { call } from 'redux-saga/effects';
import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { CampaignPrototype } from '../types';
import { buildPath } from './base.api';

export function* getAll() {
    const url = buildPath(`${api.CAMPAIGN.PATH}/`);
    return yield call(axiosInstance.get, url);
}

export function* get(id: string) {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${id}`);
    return yield call(axiosInstance.get, url);
}

export function* create(campaignPrototype: CampaignPrototype) {
    const url = buildPath(`${api.CAMPAIGN.PATH}${api.CAMPAIGN.SUBPATH_CREATE}`);
    return yield call(axiosInstance.post, url, campaignPrototype);
}

export function* join(code: string) {
    const url = buildPath(`${api.CAMPAIGN.PATH}${api.CAMPAIGN.SUBPATH_JOIN}/${code}`);
    return yield call(axiosInstance.post, url);
}

export function* deletePermanently(campaignId: number) {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${campaignId}`);
    return yield call(axiosInstance.delete, url);
}
