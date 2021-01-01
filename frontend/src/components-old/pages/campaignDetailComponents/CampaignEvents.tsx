import { Box, Button, CircularProgress, Divider, List, ListItem, Paper, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { eventActions } from '../../../store/actions';
import { RootState } from '../../../store/reducers';
import { EventLine } from '../../molecules/event/EventLine';
import { SaveEventLine } from '../../molecules/event/SaveEventLine';

interface Props {
    campaignId: string;
}

export const CampaignEvents = (props: Props) => {
    const dispatch = useDispatch();
    const events = useSelector((s: RootState) => s.events.events);
    const loading = useSelector((s: RootState) => s.events.loading);

    const [createAt, setCreateAt] = useState<number | undefined>(undefined);

    useEffect(() => {
        dispatch(eventActions.actions.getEvents(props.campaignId));
    }, [dispatch, props.campaignId]);

    if (loading) {
        return <CircularProgress />;
    }

    const clearCreate = () => {
        setCreateAt(undefined);
    };

    const doCreate = (name: string, description: string) => {
        dispatch(
            eventActions.actions.createEvent({
                campaignId: props.campaignId,
                name,
                description
            })
        );
        clearCreate();
    };

    const renderAdd = () => (
        <Box display="flex" flexDirection="row" justifyContent="center" paddingTop="0.5em" key={'addButton'}>
            <Button variant="outlined" onClick={() => setCreateAt(events.length)}>
                Add new event
            </Button>
        </Box>
    );

    const renderCreate = () => (
        <ListItem dense={true} key="create">
            <SaveEventLine doSave={doCreate} doCancel={clearCreate} />
        </ListItem>
    );

    const getListToRender = () => {
        const eventNodes = events.map((event) => {
            return <EventLine key={event.ordinal} event={event} />;
        });
        if (createAt !== undefined) {
            eventNodes.splice(createAt, 0, renderCreate());
        } else {
            eventNodes.push(renderAdd());
        }
        for (let i = 1; i < eventNodes.length; i += 2) {
            eventNodes.splice(i, 0, <Divider />);
        }
        return eventNodes;
    };

    return (
        <Box>
            <Box marginBottom="1em">
                {events.length === 0 && createAt === undefined ? (
                    <>
                        <Typography variant="body1">This campaign does not have any events yet.</Typography>
                        <Button onClick={() => setCreateAt(0)}>Create</Button>
                    </>
                ) : (
                    <Paper elevation={3}>{<List>{getListToRender()}</List>}</Paper>
                )}
            </Box>
        </Box>
    );
};
