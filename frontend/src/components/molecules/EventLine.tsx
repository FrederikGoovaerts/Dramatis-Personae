import { Box, Divider, Flex, Link, ListItem, Text, UnorderedList, useColorModeValue } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import { characterRoute } from '../../config/constants';
import { eventActions } from '../../store/actions';
import { Event } from '../../types/event.types';
import { EventEditDrawer } from '../organisms/EventEditDrawer';
import { EventRelationDrawer } from '../organisms/EventRelationDrawer';

interface Props {
    campaignId: string;
    event: Event;
    onEdit: (id: string, name: string, description: string) => void;
    onDelete: (id: string) => void;
}

export const EventLine = (props: Props) => {
    const [relationOpen, setRelationOpen] = useState(false);
    const secondaryTextColor = useColorModeValue('gray.500', 'gray.400');

    const dispatch = useDispatch();
    const addCharRelation = (characterId: string) => {
        dispatch(eventActions.actions.addEventCharacter({ id: props.event.id, characterId }));
    };
    const removeCharRelation = (characterId: string) => {
        dispatch(eventActions.actions.removeEventCharacter({ id: props.event.id, characterId }));
    };

    return (
        <Box pl={3} borderLeft="2px" borderColor="gray.500">
            <Flex justifyContent="space-between">
                <Box>
                    <Text fontSize="xl">{props.event.name}</Text>
                    <Text mt={1}>{props.event.description}</Text>
                </Box>
                <EventEditDrawer event={props.event} onDelete={props.onDelete} onEdit={props.onEdit} />
            </Flex>
            <Flex pt={1}>
                {props.event.characters.length > 0 && (
                    <Box maxWidth="15em">
                        <Divider />
                        <Text marginY={1}>Related characters</Text>
                        <UnorderedList>
                            {props.event.characters.map((c) => (
                                <ListItem key={c.id}>
                                    <Text fontSize="sm">
                                        <RouterLink to={characterRoute(props.campaignId, c.id)}>
                                            <Link>{c.name}</Link>
                                        </RouterLink>{' '}
                                        (<Link onClick={() => removeCharRelation(c.id)}>remove</Link>)
                                    </Text>
                                </ListItem>
                            ))}
                        </UnorderedList>
                    </Box>
                )}
            </Flex>
            <Box>
                <Link onClick={() => setRelationOpen(true)}>
                    <Text fontSize="xs" color={secondaryTextColor} as="u" onClick={console.log}>
                        Add a related character
                    </Text>
                </Link>
                <EventRelationDrawer
                    open={relationOpen}
                    campaignId={props.campaignId}
                    event={props.event}
                    onAddCharacter={addCharRelation}
                    onAddLocation={console.log}
                    onClose={() => setRelationOpen(false)}
                />
            </Box>
        </Box>
    );
};
