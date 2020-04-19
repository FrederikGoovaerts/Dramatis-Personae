import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { CharacterPrototype, CreateNotePayload, Character, Note, VisibilityUpdatePayload } from '../types';
import { buildPath } from './base.api';

export async function get(id: string): Promise<Character> {
    const url = buildPath(`${api.CHARACTER.PATH}/${id}`);
    return (await axiosInstance.get(url)).data;
}

export async function update(id: string, update: CharacterPrototype): Promise<void> {
    const url = buildPath(`${api.CHARACTER.PATH}/${id}`);
    await axiosInstance.put(url, update);
}

export async function setVisible(payload: VisibilityUpdatePayload): Promise<void> {
    const url = buildPath(`${api.CHARACTER.PATH}/${payload.characterId}${api.CHARACTER.SUBPATH_VISIBLE}`);
    await axiosInstance.put(url, payload.visible, { headers: { 'Content-Type': 'application/json' } });
}

export async function deletePermanently(id: string): Promise<void> {
    const url = buildPath(`${api.CHARACTER.PATH}/${id}`);
    await axiosInstance.delete(url);
}

export async function getNotes(id: string): Promise<Array<Note>> {
    const url = buildPath(`${api.CHARACTER.PATH}/${id}${api.CHARACTER.SUBPATH_NOTE}`);
    return (await axiosInstance.get(url)).data;
}

export async function createNote(payload: CreateNotePayload): Promise<void> {
    const url = buildPath(`${api.CHARACTER.PATH}/${payload.characterId}${api.CHARACTER.SUBPATH_NOTE}`);
    await axiosInstance.post(url, { contents: payload.contents });
}
