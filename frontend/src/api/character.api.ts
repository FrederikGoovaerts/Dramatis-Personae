import moment from 'moment';

import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { Character } from '../types/character.types';
import { AddLabelPayload, Label, RemoveLabelPayload } from '../types/label.types';
import { CreateNotePayload, Note } from '../types/note.types';
import { buildPath } from './base.api';
import { RawNote } from './note.api';

interface RawCharacter {
    id: string;
    name: string;
    description: string;
    labels: Label[];
    visible: boolean;
}

export async function get(id: string): Promise<Character> {
    const url = buildPath(`${api.CHARACTER.PATH}/${id}`);
    const data: RawCharacter = (await axiosInstance.get(url)).data;
    return data;
}

export async function update(id: string, name: string, description: string, visible: boolean): Promise<void> {
    const url = buildPath(`${api.CHARACTER.PATH}/${id}`);
    await axiosInstance.put(url, { name, description, visible });
}

export async function deletePermanently(id: string): Promise<void> {
    const url = buildPath(`${api.CHARACTER.PATH}/${id}`);
    await axiosInstance.delete(url);
}

export async function getNotes(id: string): Promise<Array<Note>> {
    const url = buildPath(`${api.CHARACTER.PATH}/${id}${api.CHARACTER.SUBPATH_NOTE}`);
    const data: Array<RawNote> = (await axiosInstance.get(url)).data;
    return data.map((rawNote) => ({
        ...rawNote,
        editedOn: moment(rawNote.editedOn),
        addedOn: moment(rawNote.addedOn)
    }));
}

export async function getSharedNotes(id: string): Promise<Array<Note>> {
    const url = buildPath(`${api.CHARACTER.PATH}/${id}${api.CHARACTER.SUBPATH_SHARED_NOTES}`);
    const data: Array<RawNote> = (await axiosInstance.get(url)).data;
    return data.map((rawNote) => ({
        ...rawNote,
        editedOn: moment(rawNote.editedOn),
        addedOn: moment(rawNote.addedOn)
    }));
}

export async function createNote(payload: CreateNotePayload): Promise<void> {
    const url = buildPath(`${api.CHARACTER.PATH}/${payload.id}${api.CHARACTER.SUBPATH_NOTE}`);
    await axiosInstance.post(url, { contents: payload.contents, visibility: payload.visibility });
}

export async function addLabel(payload: AddLabelPayload): Promise<void> {
    const url = buildPath(`${api.CHARACTER.PATH}/${payload.characterId}${api.CHARACTER.SUBPATH_LABEL}`);
    await axiosInstance.post(url, `"${payload.labelId}"`, { headers: { 'Content-Type': 'application/json' } });
}

export async function removeLabel(payload: RemoveLabelPayload): Promise<void> {
    const url = buildPath(`${api.CHARACTER.PATH}/${payload.characterId}${api.CHARACTER.SUBPATH_LABEL}`);
    await axiosInstance.delete(url, { headers: { 'Content-Type': 'application/json' }, data: `"${payload.labelId}"` });
}
