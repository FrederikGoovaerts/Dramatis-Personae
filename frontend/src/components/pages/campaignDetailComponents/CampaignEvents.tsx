import {
    Box,
    CircularProgress,
    Fab,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Modal,
    Paper,
    Typography
} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Visibility from '@material-ui/icons/Visibility';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { eventActions } from '../../../store/actions';
import { RootState } from '../../../store/reducers';
import { CreateEventPayload, Event } from '../../../types/event.types';

interface Props {
    campaignId: string;
}

export const CampaignEvents = (props: Props) => {
    const dispatch = useDispatch();
    const events = useSelector((s: RootState) => s.events.events);
    const loading = useSelector((s: RootState) => s.events.loading);

    useEffect(() => {
        dispatch(eventActions.actions.getEvents(props.campaignId));
    }, [dispatch, props.campaignId]);

    const renderEvent = (event: Event) => (
        <ListItem dense={true}>
            <ListItemText primary={<Typography>{event.name}</Typography>} secondary={event.description} />
        </ListItem>
    );

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Box marginBottom="1em">
                {events.length === 0 ? (
                    <Typography variant="body1">This campaign does not have any events yet.</Typography>
                ) : (
                    <Paper elevation={3}>{<List>{events.map(renderEvent)}</List>}</Paper>
                )}
            </Box>
        </Box>
    );
};
