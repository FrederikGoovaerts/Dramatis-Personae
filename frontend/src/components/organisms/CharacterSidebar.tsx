import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';

import { campaignRoute } from '../../config/constants';
import { pushToHistory } from '../../config/state';
import { RootState } from '../../store/reducers';

interface Props {
    campaignId: string;
    characterId: string;
}

export const CharacterSidebar = (props: Props) => {
    const character = useSelector((state: RootState) => state.character.character);

    if (!character) {
        return <Box />;
    }

    return (
        <Box position="sticky" top="8em" maxWidth="18rem" paddingX="1em">
            <Heading size="md" marginBottom="1em">
                {character.name}
            </Heading>
            <Text>{character.description}</Text>
            <Button
                onClick={() => pushToHistory(campaignRoute(props.campaignId))}
                leftIcon={<ArrowBackIcon />}
                marginTop="2em"
            >
                Back to campaign
            </Button>
        </Box>
    );
};
