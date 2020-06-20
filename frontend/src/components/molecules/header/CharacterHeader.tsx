import * as React from 'react';
import { routes } from '../../../config/constants';
import { ReturningHeader } from './ReturningHeader';

interface Props {
    name?: string;
    campaignId: string;
}

export const CharacterHeader = (props: Props) => (
    <ReturningHeader
        returnRoute={`${routes.campaign.path}${props.campaignId}`}
        returnLabel="Campaign"
        title={props.name}
    />
);
