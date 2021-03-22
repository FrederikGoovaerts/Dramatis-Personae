import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { Campaign, CampaignMember, CampaignPrototype } from '../types/campaign.types';
import { CharacterPrototype, ListCharacter } from '../types/character.types';
import { CreateLabelPayload, Label, ListLabel } from '../types/label.types';
import { CreateNotePayload, Note } from '../types/note.types';
import { buildPath } from './base.api';

interface RawListCharacter {
    name: string;
    description: string;
    visible: boolean;
    labels: ListLabel[];
    id: string;
}

export async function getAll(): Promise<Array<Campaign>> {
    const url = buildPath(`${api.CAMPAIGN.PATH}`);
    return (await axiosInstance.get(url)).data;
}

export async function get(id: string): Promise<Campaign> {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${id}`);
    return (await axiosInstance.get(url)).data;
}

export async function create(campaignPrototype: CampaignPrototype): Promise<void> {
    const url = buildPath(`${api.CAMPAIGN.PATH}`);
    await axiosInstance.post(url, campaignPrototype);
}

export async function update(id: string, name: string): Promise<void> {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${id}`);
    await axiosInstance.put(url, { name });
}

export async function deletePermanently(campaignId: string): Promise<void> {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${campaignId}`);
    await axiosInstance.delete(url);
}

export async function getCharacters(id: string): Promise<Array<ListCharacter>> {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${id}${api.CAMPAIGN.SUBPATH_CHARACTER}`);
    const data: Array<RawListCharacter> = (await axiosInstance.get(url)).data;
    return data;
}

export async function createCharacter(id: string, characterPrototype: CharacterPrototype): Promise<void> {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${id}${api.CAMPAIGN.SUBPATH_CHARACTER}`);
    await axiosInstance.post(url, characterPrototype);
}

export async function getMembers(id: string): Promise<Array<CampaignMember>> {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${id}${api.CAMPAIGN.SUBPATH_MEMBERS}`);
    return (await axiosInstance.get(url)).data;
}

export async function join(code: string): Promise<void> {
    const url = buildPath(`${api.CAMPAIGN.PATH}${api.CAMPAIGN.SUBPATH_JOIN}/${code}`);
    await axiosInstance.post(url);
}

export async function leave(id: string): Promise<void> {
    const url = buildPath(`${api.CAMPAIGN.PATH}${api.CAMPAIGN.SUBPATH_LEAVE}/${id}`);
    await axiosInstance.post(url);
}

export async function rotateInviteCode(id: string): Promise<void> {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${id}${api.CAMPAIGN.SUBPATH_ROTATE_INVITE_CODE}`);
    await axiosInstance.post(url);
}

export async function kick(campaignId: string, userId: string): Promise<void> {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${campaignId}${api.CAMPAIGN.SUBPATH_KICK}/${userId}`);
    await axiosInstance.post(url);
}

export async function getNotes(id: string): Promise<Array<Note>> {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${id}${api.CAMPAIGN.SUBPATH_NOTE}`);
    return (await axiosInstance.get(url)).data;
}

export async function getSharedNotes(id: string): Promise<Array<Note>> {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${id}${api.CAMPAIGN.SUBPATH_SHARED_NOTES}`);
    return (await axiosInstance.get(url)).data;
}

export async function createNote(payload: CreateNotePayload): Promise<void> {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${payload.id}${api.CAMPAIGN.SUBPATH_NOTE}`);
    await axiosInstance.post(url, { contents: payload.contents, visibility: payload.visibility });
}

export async function createLabel(payload: CreateLabelPayload): Promise<void> {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${payload.id}${api.CAMPAIGN.SUBPATH_LABEL}`);
    await axiosInstance.post(url, { name: payload.name, visible: payload.visible });
}

export async function getLabels(id: string): Promise<Array<Label>> {
    const url = buildPath(`${api.CAMPAIGN.PATH}/${id}${api.CAMPAIGN.SUBPATH_LABEL}`);
    return (await axiosInstance.get(url)).data;
}
