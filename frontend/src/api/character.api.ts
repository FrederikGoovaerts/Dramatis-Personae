import { call } from 'redux-saga/effects';
import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { CharacterPrototype, CharacterUpdate, NoteUpdatePayload, VisibilityUpdatePayload } from '../types';
import { buildPath } from './base.api';

export function* get(id: string) {
    const url = buildPath(`${api.CHARACTER.PATH}/${id}`);
    return yield call(axiosInstance.get, url);
}

export function* create(characterPrototype: CharacterPrototype) {
    const url = buildPath(`${api.CHARACTER.PATH}${api.CHARACTER.SUBPATH_CREATE}`);
    return yield call(axiosInstance.post, url, characterPrototype);
}

export function* update(characterId: number, update: CharacterUpdate) {
    const url = buildPath(`${api.CHARACTER.PATH}${api.CHARACTER.SUBPATH_UPDATE}/${characterId}`);
    return yield call(axiosInstance.post, url, update);
}

export function* deletePermanently(characterId: number) {
    const url = buildPath(`${api.CHARACTER.PATH}/${characterId}`);
    return yield call(axiosInstance.delete, url);
}

export function* setNote(payload: NoteUpdatePayload) {
    const url = buildPath(`${api.CHARACTER.PATH}${api.CHARACTER.SUBPATH_NOTE}/${String(payload.characterId)}`);
    return yield call(
        axiosInstance.post,
        url,
        { note: payload.note },
        { headers: { 'Content-Type': 'application/json' } },
    );
}

export function* setVisible(payload: VisibilityUpdatePayload) {
    const url = buildPath(`${api.CHARACTER.PATH}${api.CHARACTER.SUBPATH_VISIBLE}/${String(payload.characterId)}`);
    return yield call(axiosInstance.post, url, payload.visible, { headers: { 'Content-Type': 'application/json' } });
}
