import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { CreateEventPayload, EditEventPayload, Event } from '../types/event.types';
import { buildPath } from './base.api';

export async function fetchEvents(campaignId: string): Promise<Event[]> {
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

export async function editEventOrdinal(eventId: string, ordinal: number): Promise<void> {
    const url = buildPath(`${api.EVENT}/${eventId}/ordinal`);
    await axiosInstance.put(url, JSON.stringify(ordinal), { headers: { 'Content-Type': 'application/json' } });
}

export async function addEventCharacter(id: string, characterId: string): Promise<void> {
    const url = buildPath(`${api.EVENT}/${id}/characters`);
    await axiosInstance.post(url, JSON.stringify(characterId), { headers: { 'Content-Type': 'application/json' } });
}

export async function removeEventCharacter(id: string, characterId: string): Promise<void> {
    const url = buildPath(`${api.EVENT}/${id}/characters`);
    await axiosInstance.delete(url, {
        data: JSON.stringify(characterId),
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function deleteEvent(id: string): Promise<void> {
    const url = buildPath(`${api.EVENT}/${id}`);
    await axiosInstance.delete(url);
}
