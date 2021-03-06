import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { EditLabelPayload } from '../types/label.types';
import { buildPath } from './base.api';

export async function editLabel(payload: EditLabelPayload): Promise<void> {
    const url = buildPath(`${api.LABEL}/${payload.labelId}`);
    await axiosInstance.put(url, { name: payload.name, visible: payload.visible });
}

export async function deleteLabel(id: string): Promise<void> {
    const url = buildPath(`${api.LABEL}/${id}`);
    await axiosInstance.delete(url);
}
