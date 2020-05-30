import * as React from 'react';
import { routes } from '../../config/constants';
import { ReturningHeader } from './ReturningHeader';

interface Props {
    campaignId: string;
}

export const CharacterHeader = (props: Props) => (
    <ReturningHeader returnRoute={`${routes.campaign}${props.campaignId}`} returnLabel="Back to campaign" />
);
