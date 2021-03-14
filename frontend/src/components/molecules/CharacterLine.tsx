import { ViewOffIcon } from '@chakra-ui/icons';
import { Box, Flex, HStack, Tag, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

import { characterRoute } from '../../config/constants';
import { ListCharacter } from '../../types/character.types';
import { CharacterEditDrawer } from '../organisms/CharacterEditDrawer';

interface Props {
    campaignId: string;
    character: ListCharacter;
    onEdit: (id: string, name: string, description: string) => void;
    onDelete: (id: string) => void;
    onAddLabel: (id: string, labelId: string) => void;
    onRemoveLabel: (id: string, labelId: string) => void;
}

export const CharacterLine = (props: Props) => (
    <Flex marginBottom="1.5em" justifyContent="space-between" borderLeft="2px" pl={3} borderColor="gray.500">
        <Box>
            <HStack marginBottom="0,5em">
                <Link to={characterRoute(props.campaignId, props.character.id)}>
                    <Text fontSize="lg">{props.character.name}</Text>
                </Link>
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
        </Box>
        <Flex alignItems="center">
            <CharacterEditDrawer
                character={props.character}
                onEdit={props.onEdit}
                onDelete={props.onDelete}
                onAddLabel={props.onAddLabel}
                onRemoveLabel={props.onRemoveLabel}
            />
        </Flex>
    </Flex>
);
