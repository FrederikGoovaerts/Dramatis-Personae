import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Input,
    Text
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { Event } from '../../types/event.types';
import { ConfirmableButton } from '../atoms/ConfirmableButton';

interface Props {
    event: Event;
    onEdit: (id: string, name: string, description: string) => void;
    onDelete: (id: string) => void;
}

export const EventEditDrawer = (props: Props) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(props.event.name);
    const [desc, setDesc] = useState(props.event.description);

    const reset = () => {
        setName(props.event.name);
        setDesc(props.event.description);
    };

    const edit = () => {
        props.onEdit(props.event.id, name, desc);
        close();
    };

    const del = () => {
        props.onDelete(props.event.id);
        close();
    };

    const close = () => {
        setOpen(false);
        reset();
    };

    return (
        <>
            <Drawer isOpen={open} onClose={close} size="lg">
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerHeader>Edit event</DrawerHeader>
                        <DrawerBody>
                            <Text marginY="1em">Title:</Text>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Event title" />
                            <Text marginY="1em">Description:</Text>
                            <Input
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder="Event description"
                            />
                        </DrawerBody>
                        <DrawerFooter>
                            <Button variant="outline" mr={3} onClick={close}>
                                Close
                            </Button>
                            <Box mr={3}>
                                <ConfirmableButton onConfirm={del} defaultText="Delete" />
                            </Box>
                            <Button onClick={edit} disabled={name === ''}>
                                Save
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
            <Button onClick={() => setOpen(true)} size="sm">
                Edit
            </Button>
        </>
    );
};
