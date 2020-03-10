import { call } from 'redux-saga/effects';
import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { CampaignPrototype, CharacterPrototype } from '../types';
import { buildPath } from './base.api';

export function* getAll() {
    const url = buildPath(`${api.CAMPAIGN.PATH}`);
    return yield call(axiosInstance.get, url);
}

export function* create(campaignPrototype: CampaignPrototype) {
    const url = buildPath(`${api.CAMPAIGN.PATH}`);
    return yield call(axiosInstance.post, url, campaignPrototype);
}

export function* update(id: string, campaignPrototype: CampaignPrototype) {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${id}`);
    return yield call(axiosInstance.put, url, campaignPrototype);
}

export function* deletePermanently(campaignId: number) {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${campaignId}`);
    return yield call(axiosInstance.delete, url);
}

export function* getCharacters(id: string) {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${id}${api.CAMPAIGN.SUBPATH_CHARACTER}`);
    return yield call(axiosInstance.get, url);
}

export function* createCharacter(id: string, characterPrototype: CharacterPrototype) {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${id}${api.CAMPAIGN.SUBPATH_CHARACTER}`);
    return yield call(axiosInstance.post, url, characterPrototype);
}

export function* getMembers(id: string) {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${id}${api.CAMPAIGN.SUBPATH_MEMBERS}`);
    return yield call(axiosInstance.get, url);
}

export function* join(code: string) {
    const url = buildPath(`${api.CAMPAIGN.PATH}${api.CAMPAIGN.SUBPATH_JOIN}/${code}`);
    return yield call(axiosInstance.post, url);
}
