import { ViewOffIcon } from '@chakra-ui/icons';
import { Box, HStack, Link, Tag, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { characterRoute } from '../../../config/constants';
import { ListCharacter } from '../../../types/character.types';

interface Props {
    campaignId: string;
    character: ListCharacter;
}

export const CharacterLine = (props: Props) => (
    <Box marginBottom="1.5em">
        <Link as={RouterLink} to={characterRoute(props.campaignId, props.character.id)}>
            <HStack marginBottom="0,5em">
                <Text fontSize="lg">{props.character.name}</Text>
                {!props.character.visible && <ViewOffIcon />}
            </HStack>
            <Text fontSize="sm">{props.character.description}</Text>
            {props.character.labels.length > 0 && (
                <HStack marginTop="0.5em">
                    {props.character.labels.map((l) => (
                        <Tag key={l.id} size="sm">
                            {l.name}
                        </Tag>
                    ))}
                </HStack>
            )}
        </Link>
    </Box>
);
