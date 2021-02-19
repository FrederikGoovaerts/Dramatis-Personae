import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, Link, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import { campaignCharactersRoute, campaignNotesRoute, rootRoute } from '../../config/constants';
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
            <Button onClick={() => pushToHistory(rootRoute())} leftIcon={<ArrowBackIcon />}>
                Campaign list
            </Button>
            <Heading size="md" marginTop="1em" marginY="1em">
                {campaign.name}
            </Heading>
            <Text>Run by {campaign.ownerName}</Text>
            <Box marginTop="2em">
                <UnorderedList>
                    <Link as={RouterLink} to={campaignNotesRoute(props.id)}>
                        <ListItem>Campaign notes</ListItem>
                    </Link>
                    <Link as={RouterLink} to={campaignCharactersRoute(props.id)}>
                        <ListItem>Characters</ListItem>
                    </Link>
                </UnorderedList>
            </Box>
        </Box>
    );
};
