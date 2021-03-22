import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { Event } from '../../types/event.types';
import { EventEditDrawer } from '../organisms/EventEditDrawer';

interface Props {
    campaignId: string;
    event: Event;
    onEdit: (id: string, name: string, description: string) => void;
    onDelete: (id: string) => void;
}

export const EventLine = (props: Props) => (
    <Flex justifyContent="space-between" pl={3} borderLeft="2px" borderColor="gray.500">
        <Box>
            <Text>{props.event.name}</Text>
            <Text fontSize="sm">{props.event.description}</Text>
        </Box>
        <EventEditDrawer event={props.event} onDelete={props.onDelete} onEdit={props.onEdit} />
    </Flex>
);
