import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { CreateEventPayload, EditEventPayload, Event } from '../types/event.types';
import { buildPath } from './base.api';

export async function getEvents(campaignId: string): Promise<Event[]> {
    const url = buildPath(`${api.EVENT}/${campaignId}`);
    return (await axiosInstance.get(url)).data;
}

export async function createEvent(payload: CreateEventPayload): Promise<void> {
    const url = buildPath(`${api.EVENT}/`);
    await axiosInstance.post(url, { ...payload });
}

export async function editEvent(payload: EditEventPayload): Promise<void> {
    const url = buildPath(`${api.EVENT}/${payload.id}`);
    await axiosInstance.put(url, { name: payload.name, description: payload.description });
}

export async function deleteEvent(id: string): Promise<void> {
    const url = buildPath(`${api.EVENT}/${id}`);
    await axiosInstance.delete(url);
}
