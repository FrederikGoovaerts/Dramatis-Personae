import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { buildPath } from './base.api';
import moment from 'moment';
import { Campaign, CampaignPrototype, CampaignMember } from '../types/campaign.types';
import { ListCharacter, CharacterPrototype } from '../types/character.types';

interface RawListCharacter {
    name: string;
    visible: boolean;
    addedOn: string;
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
    return data.map((char) => ({
        ...char,
        addedOn: moment(char.addedOn)
    }));
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
