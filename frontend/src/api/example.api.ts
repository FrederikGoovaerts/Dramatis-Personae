import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { buildPath } from './base.api';

export async function get(id: number): Promise<object> {
    const url = buildPath(`${api.EXAMPLE_API.PATH}/${id}`);
    return await axiosInstance.get(url);
}

export async function update(id: number, param: string): Promise<void> {
    const url = buildPath(`${api.EXAMPLE_API.PATH}/${id}${api.EXAMPLE_API.SUBPATH_EXAMPLE}`);
    await axiosInstance.post(url, { param });
}
