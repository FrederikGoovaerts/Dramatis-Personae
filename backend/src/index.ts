import dotenv from 'dotenv';
import { getCampaigns } from './repository/campaignRepository';
dotenv.config();

async function main() {
    console.log(await getCampaigns());
}

main();
