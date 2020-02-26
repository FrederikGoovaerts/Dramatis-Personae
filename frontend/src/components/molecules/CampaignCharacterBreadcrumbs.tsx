import './CampaignCharacterBreadcrumbs.scss';

import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../config/constants';
import { Campaign, Character } from '../../types';

interface Props {
    campaign: Campaign;
    character?: Character;
}

export const CampaignCharacterBreadcrumb = (props: Props) => (
    <div className="Breadcrumbs__container">
        <Link to={routes.campaign} className="unstyled">
            <Typography>Campaigns</Typography>
        </Link>
        <Typography className="Breadcrumbs__separator">&gt;</Typography>
        <Link to={`${routes.campaign}${props.campaign.id}`} className="unstyled">
            <Typography>{props.campaign.name}</Typography>
        </Link>
        {!!props.character && <Typography className="Breadcrumbs__separator">&gt;</Typography>}
        {!!props.character && (
            <Link to={`${routes.campaign}${props.campaign.id}${routes.character}${props.character.id}`} className="unstyled">
                <Typography>{props.character.name}</Typography>
            </Link>
        )}
    </div>
);
