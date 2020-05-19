import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import {
    CreateNotePayload,
    Character,
    Note,
    VisibilityUpdatePayload,
    CharacterEditPayload,
    NoteVisibility
} from '../types';
import { buildPath } from './base.api';
import moment from 'moment';

interface RawCharacter {
    id: string;
    name: string;
    description: string;
    visible: boolean;
    addedOn: string;
}

interface RawNote {
    id: string;
    contents: string;
    addedOn: string;
    editedOn: string;
    visibility: NoteVisibility;
}

export async function get(id: string): Promise<Character> {
    const url = buildPath(`${api.CHARACTER.PATH}/${id}`);
    const data: RawCharacter = (await axiosInstance.get(url)).data;
    return {
        ...data,
        addedOn: moment(data.addedOn)
    };
}

export async function update(id: string, update: CharacterEditPayload): Promise<void> {
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
    const url = buildPath(`${api.CHARACTER.PATH}/${payload.characterId}${api.CHARACTER.SUBPATH_NOTE}`);
    await axiosInstance.post(url, { contents: payload.contents, visibility: payload.visibility });
}
