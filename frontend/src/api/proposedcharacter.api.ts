import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { buildPath } from './base.api';

export async function accept(id: string): Promise<void> {
    const url = buildPath(`${api.PROPOSED_CHARACTER.PATH}/${id}${api.PROPOSED_CHARACTER.SUBPATH_ACCEPT}`);
    await axiosInstance.post(url);
}

export async function update(id: string, name: string, description: string): Promise<void> {
    const url = buildPath(`${api.PROPOSED_CHARACTER.PATH}/${id}`);
    await axiosInstance.put(url, { name, description });
}

export async function deletePermanently(id: string): Promise<void> {
    const url = buildPath(`${api.PROPOSED_CHARACTER.PATH}/${id}`);
    await axiosInstance.delete(url);
}
