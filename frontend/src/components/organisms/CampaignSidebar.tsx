import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

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
        <Box maxWidth="18rem" paddingX="1em">
            <Heading size="md" marginBottom="1em">
                {campaign.name}
            </Heading>
            <Box marginY="1em">
                {[
                    { title: 'Characters', route: campaignCharactersRoute(props.id) },
                    { title: 'Locations', route: campaignLocationsRoute(props.id) },
                    { title: 'Events', route: campaignEventsRoute(props.id) },
                    { title: 'Campaign notes', route: campaignNotesRoute(props.id) }
                ].map((el) => (
                    <Link to={el.route} key={el.title}>
                        <Text fontSize="lg" marginBottom="0.5em">
                            {el.title}
                        </Text>
                    </Link>
                ))}
            </Box>
            <Button onClick={() => pushToHistory(rootRoute())} leftIcon={<ArrowBackIcon />} marginTop="2em">
                Campaign list
            </Button>
        </Box>
    );
};
