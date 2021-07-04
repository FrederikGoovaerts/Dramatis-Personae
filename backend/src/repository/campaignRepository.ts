import client from './client';

interface CampaignEntity {
    id: string;
    name: string;
    invite_code: string;
    owner_id: string;
}

export async function getCampaigns(): Promise<CampaignEntity[]> {
    const res = await client.query<CampaignEntity>('SELECT * from campaign');
    return res.rows;
}
