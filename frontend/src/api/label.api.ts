import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { buildPath } from './base.api';
import { EditLabelPayload } from '../types/label.types';

export async function updateLabel(payload: EditLabelPayload): Promise<void> {
    const url = buildPath(`${api.LABEL.PATH}/${payload.labelId}`);
    await axiosInstance.put(url, { name: payload.name, visible: payload.visible });
}

export async function deleteLabel(id: string): Promise<void> {
    const url = buildPath(`${api.LABEL.PATH}/${id}`);
    await axiosInstance.delete(url);
}
