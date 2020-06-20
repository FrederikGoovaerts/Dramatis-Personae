import * as React from 'react';
import { routes } from '../../../config/constants';
import { ReturningHeader } from './ReturningHeader';

interface Props {
    name?: string;
    className?: string;
}

export const CampaignHeader = (props: Props) => (
    <ReturningHeader
        returnRoute={routes.root}
        returnLabel="Campaign list"
        title={props.name}
        className={props.className}
    />
);
