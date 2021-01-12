import { Box, Divider, Heading, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import { campaigNotesRoute, characterRoute, rootRoute } from '../../config/constants';
import { RootState } from '../../store/reducers';

interface Props {
    id: string;
}

export const CampaignSidebar = (props: Props) => {
    const campaign = useSelector((state: RootState) => state.campaign.campaign);
    const characters = useSelector((state: RootState) => state.campaign.characters);

    if (!campaign) {
        return <Box />;
    }

    return (
        <Box margin="2em">
            <Link as={RouterLink} to={rootRoute()}>
                Back to campaign list
            </Link>
            <Divider marginTop="1em" marginBottom="1em" />
            <Heading size="md">{campaign.name}</Heading>
            <Text>Run by {campaign.ownerName}</Text>
            <Divider marginTop="1em" marginBottom="1em" />
            <Link as={RouterLink} to={campaigNotesRoute(props.id)}>
                Notes
            </Link>
            {characters.map((c) => (
                <Link key={c.id} as={RouterLink} to={characterRoute(props.id, c.id)}>
                    {c.name}
                </Link>
            ))}
        </Box>
    );
};
