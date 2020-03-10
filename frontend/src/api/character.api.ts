import { call } from 'redux-saga/effects';
import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { CharacterPrototype, VisibilityUpdatePayload, CreateNotePayload } from '../types';
import { buildPath } from './base.api';

export function* get(id: string) {
    const url = buildPath(`${api.CHARACTER.PATH}/${id}`);
    return yield call(axiosInstance.get, url);
}

export function* update(id: string, update: CharacterPrototype) {
    const url = buildPath(`${api.CHARACTER.PATH}/${id}`);
    return yield call(axiosInstance.put, url, update);
}

export function* setVisible(payload: VisibilityUpdatePayload) {
    const url = buildPath(`${api.CHARACTER.PATH}/${payload.characterId}${api.CHARACTER.SUBPATH_VISIBLE}`);
    return yield call(axiosInstance.put, url, payload.visible, { headers: { 'Content-Type': 'application/json' } });
}

export function* deletePermanently(id: string) {
    const url = buildPath(`${api.CHARACTER.PATH}/${id}`);
    return yield call(axiosInstance.delete, url);
}

export function* getNotes(id: string) {
    const url = buildPath(`${api.CHARACTER.PATH}/${id}${api.CHARACTER.SUBPATH_NOTE}`);
    return yield call(axiosInstance.get, url);
}

export function* createNote(payload: CreateNotePayload) {
    const url = buildPath(`${api.CHARACTER.PATH}/${payload.characterId}${api.CHARACTER.SUBPATH_NOTE}`);
    return yield call(axiosInstance.post, url, { contents: payload.note });
}
