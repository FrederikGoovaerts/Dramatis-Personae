import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, Link, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import {
    campaignCharactersRoute,
    campaignEventsRoute,
    campaignLocationsRoute,
    campaignNotesRoute,
    rootRoute
} from '../../config/constants';
import { pushToHistory } from '../../config/state';
import { RootState } from '../../store/reducers';

interface Props {
    id: string;
}

export const CampaignSidebar = (props: Props) => {
    const campaign = useSelector((state: RootState) => state.campaign.campaign);

    if (!campaign) {
        return <Box />;
    }

    return (
        <Box maxWidth="18rem">
            <Heading size="md" marginTop="1em" marginY="1em">
                {campaign.name}
            </Heading>
            <Text>Run by {campaign.ownerName}</Text>
            <Box marginY="1em">
                <UnorderedList>
                    <Link as={RouterLink} to={campaignCharactersRoute(props.id)}>
                        <ListItem>Characters</ListItem>
                    </Link>
                    <Link as={RouterLink} to={campaignLocationsRoute(props.id)}>
                        <ListItem>Locations</ListItem>
                    </Link>
                    <Link as={RouterLink} to={campaignEventsRoute(props.id)}>
                        <ListItem>Events</ListItem>
                    </Link>
                    <Link as={RouterLink} to={campaignNotesRoute(props.id)}>
                        <ListItem>Campaign notes</ListItem>
                    </Link>
                </UnorderedList>
            </Box>
            <Button onClick={() => pushToHistory(rootRoute())} leftIcon={<ArrowBackIcon />}>
                Campaign list
            </Button>
        </Box>
    );
};
