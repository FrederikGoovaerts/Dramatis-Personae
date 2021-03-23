import { Box } from '@chakra-ui/layout';
import { Divider, Flex, Text } from '@chakra-ui/react';
import { Skeleton } from '@chakra-ui/skeleton';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { eventActions } from '../../store/actions';
import { eventsLoadingSelector, RootState } from '../../store/reducers';
import { Event } from '../../types/event.types';
import { EventLine } from '../molecules/EventLine';
import { EventCreateDrawer } from './EventCreateDrawer';

interface Props {
    campaignId: string;
}

interface DraggableProps {
    event: Event;
    campaignId: string;
    index: number;
    onEdit: (id: string, name: string, description: string) => void;
    onDelete: (id: string) => void;
}

const EventDraggable = (p: DraggableProps) => {
    return (
        <Draggable draggableId={p.event.id} index={p.index}>
            {(provided) => (
                <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    key={p.event.id}
                    mb={6}
                >
                    <EventLine event={p.event} campaignId={p.campaignId} onDelete={p.onDelete} onEdit={p.onEdit} />
                </Box>
            )}
        </Draggable>
    );
};

export const CampaignEventList = (props: Props) => {
    const [swapping, setSwapping] = useState(false);

    const dispatch = useDispatch();
    const loading = useSelector(eventsLoadingSelector);
    const campaign = useSelector((state: RootState) => state.campaign.campaign);
    const events = useSelector((state: RootState) => state.events.events);

    useEffect(() => {
        dispatch(eventActions.actions.fetchEvents(props.campaignId));
    }, [dispatch, props.campaignId]);

    useEffect(() => {
        setSwapping(false);
    }, [events]);

    const create = (name: string, description: string) => {
        dispatch(eventActions.actions.createEvent({ campaignId: props.campaignId, name, description }));
    };

    const edit = (id: string, name: string, description: string) => {
        dispatch(eventActions.actions.editEvent({ id, name, description }));
    };

    const del = (id: string) => {
        dispatch(eventActions.actions.deleteEvent(id));
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination || result.destination.index === result.source.index) {
            return;
        }
        const srcIndex = result.source.index;
        const destIndex = result.destination.index;

        setSwapping(true);

        setTimeout(
            () =>
                dispatch(
                    eventActions.actions.editEventOrdinal({
                        id: events[srcIndex].id,
                        newOrdinal: events[destIndex].ordinal
                    })
                ),
            300
        );
    };

    const wrapContent = (children: JSX.Element | JSX.Element[]) => (
        <Box>
            <Box mb={3}>
                <EventCreateDrawer onCreate={create} />
            </Box>
            <Divider mb={3} />
            {children}
        </Box>
    );

    if (swapping) {
        return wrapContent(
            events.map((e) => (
                <Skeleton key={e.id} mb={6}>
                    <EventLine event={e} campaignId={props.campaignId} onDelete={del} onEdit={edit} />
                </Skeleton>
            ))
        );
    }
    if (loading || props.campaignId !== campaign?.id) {
        return <></>;
    }
    if (events.length === 0) {
        return wrapContent(
            <Flex justify="center" pt={12}>
                <Text fontSize="xl">No events found.</Text>
            </Flex>
        );
    }
    return wrapContent(
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {events.map((e: Event, index: number) => (
                            <EventDraggable
                                event={e}
                                index={index}
                                campaignId={props.campaignId}
                                key={e.id}
                                onDelete={del}
                                onEdit={edit}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};
