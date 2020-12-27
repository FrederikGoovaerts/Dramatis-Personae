import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Fab,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Modal,
    Paper,
    TextField,
    Typography
} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Visibility from '@material-ui/icons/Visibility';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { eventActions } from '../../../store/actions';
import { RootState } from '../../../store/reducers';
import { Event } from '../../../types/event.types';

interface Props {
    campaignId: string;
}

export const CampaignEvents = (props: Props) => {
    const dispatch = useDispatch();
    const events = useSelector((s: RootState) => s.events.events);
    const loading = useSelector((s: RootState) => s.events.loading);

    const [createAt, setCreateAt] = useState<number | undefined>(undefined);
    const [createName, setCreateName] = useState<string>('');
    const [createDesc, setCreateDesc] = useState<string>('');

    useEffect(() => {
        dispatch(eventActions.actions.getEvents(props.campaignId));
    }, [dispatch, props.campaignId]);

    if (loading) {
        return <CircularProgress />;
    }

    const clearCreate = () => {
        setCreateAt(undefined);
        setCreateName('');
        setCreateDesc('');
    };

    const doCreate = () => {
        dispatch(
            eventActions.actions.createEvent({
                campaignId: props.campaignId,
                name: createName,
                description: createDesc
            })
        );
        clearCreate();
    };

    const renderEvent = (event: Event) => (
        <ListItem dense={true} key={event.ordinal}>
            <ListItemText primary={<Typography>{event.name}</Typography>} secondary={event.description} />
        </ListItem>
    );

    const renderAdd = () => (
        <Box display="flex" flexDirection="row" justifyContent="center" paddingTop="0.5em" key={'addButton'}>
            <IconButton onClick={() => setCreateAt(events.length)}>
                <Add />
            </IconButton>
        </Box>
    );

    const renderCreate = () => (
        <ListItem dense={true} key="create">
            <Box display="flex" flex={1} justifyContent="space-between" alignItems="center">
                <Box flexDirection="column" display="flex" flex={1}>
                    <TextField
                        value={createName}
                        size="small"
                        fullWidth={false}
                        label="Event title"
                        onChange={(event) => setCreateName(event.target.value)}
                    />
                    <TextField
                        value={createDesc}
                        size="small"
                        fullWidth={true}
                        label="Event description"
                        onChange={(event) => setCreateDesc(event.target.value)}
                    />
                </Box>

                <Box flexDirection="column" display="flex">
                    <Button onClick={doCreate}>Create</Button>
                    <Button onClick={clearCreate}>Cancel</Button>
                </Box>
            </Box>
        </ListItem>
    );

    const getListToRender = () => {
        const eventNodes = events.map(renderEvent);
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
