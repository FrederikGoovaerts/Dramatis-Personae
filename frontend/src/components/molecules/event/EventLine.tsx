import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { eventActions } from '../../../store/actions';
import { Event } from '../../../types/event.types';
import { DeleteButton } from '../../atoms/ConfirmableButton';
import { SaveEventLine } from './SaveEventLine';

interface Props {
    event: Event;
}

export const EventLine = (props: Props) => {
    const [editing, setEditing] = useState<boolean>(false);
    // Used for detail view (soon)
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(true);

    const dispatch = useDispatch();

    const doLoad = async () => {
        // Load characters and locations
        setLoading(false);
    };

    useEffect(() => {
        if (open) {
            setLoading(true);
            doLoad();
        }
    }, [open]);

    const doEdit = (name: string, description: string) => {
        dispatch(eventActions.actions.editEvent({ id: props.event.id, name, description }));
        setEditing(false);
    };

    if (editing) {
        return (
            <Box margin>
                <SaveEventLine
                    doCancel={() => setEditing(false)}
                    doSave={doEdit}
                    initialName={props.event.name}
                    initialDesc={props.event.description}
                />
            </Box>
        );
    }

    return (
        <Box key={props.event.ordinal}>
            <ListItem dense={true}>
                <ListItemText primary={props.event.name} secondary={props.event.description} />
                <Box margin>
                    <Button variant="outlined" onClick={() => setEditing(true)}>
                        Edit
                    </Button>
                </Box>
                <Box margin>
                    <DeleteButton onConfirm={() => dispatch(eventActions.actions.deleteEvent(props.event.id))} />
                </Box>
            </ListItem>
        </Box>
    );
};
