import { Box, Button, Typography } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';

import { routes } from '../../../config/constants';
import { campaignActions } from '../../../store/actions';

interface Props {
    campaignId: string;
    inviteCode: string;
    rotateInviteCode: (id: string) => void;
}

function createJoinLink(joinId: string): string {
    return `${window.location.origin}${routes.join}${joinId}`;
}

const CampaignInviteInfoRaw = (props: Props) => {
    const rotateInviteCode = () => {
        props.rotateInviteCode(props.campaignId);
    };

    return (
        <>
            <Typography gutterBottom>Invite link:</Typography>
            <Typography gutterBottom variant="body2">
                {createJoinLink(props.inviteCode)}
            </Typography>
            <Box marginTop="0.5em">
                <Button onClick={rotateInviteCode} variant="outlined" size="small">
                    Reset Invite link
                </Button>
            </Box>
        </>
    );
};

export const CampaignInviteInfo = connect(null, {
    rotateInviteCode: campaignActions.actions.rotateInviteCode
})(CampaignInviteInfoRaw);
