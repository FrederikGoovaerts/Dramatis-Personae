import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { buildPath } from './base.api';

export async function update(id: string, contents: string): Promise<void> {
    const url = buildPath(`${api.NOTE.PATH}/${id}`);
    await axiosInstance.put(url, { contents });
}

export async function deletePermanently(id: string): Promise<void> {
    const url = buildPath(`${api.NOTE.PATH}/${id}`);
    await axiosInstance.delete(url);
}
