import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { buildPath } from './base.api';
import { EditNotePayload } from '../types';

export async function edit(payload: EditNotePayload): Promise<void> {
    const url = buildPath(`${api.NOTE.PATH}/${payload.noteId}`);
    await axiosInstance.put(url, { contents: payload.contents });
}

export async function deletePermanently(id: string): Promise<void> {
    const url = buildPath(`${api.NOTE.PATH}/${id}`);
    await axiosInstance.delete(url);
}
