import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Select,
    Text,
    Textarea
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { Note, NoteVisibility } from '../../types/note.types';
import { ConfirmableButton } from '../atoms/ConfirmableButton';

interface Props {
    note: Note;
    onEdit: (id: string, contents: string, visibility: NoteVisibility) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}

export const NotesEditDrawer = (props: Props) => {
    const [open, setOpen] = useState(true);
    const [text, setText] = useState(props.note.contents);
    const [vis, setVis] = useState<NoteVisibility>(props.note.visibility);

    const edit = () => {
        props.onEdit(props.note.id, text, vis);
        close();
    };

    const del = () => {
        props.onDelete(props.note.id);
        close();
    };

    const close = () => {
        setOpen(false);
        props.onClose();
    };

    return (
        <Drawer isOpen={open} onClose={close} size="lg">
            <DrawerOverlay>
                <DrawerContent>
                    <DrawerHeader>Edit note</DrawerHeader>
                    <DrawerBody>
                        <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Your note here"
                            size="lg"
                            height="75%"
                        />
                        {props.note.owned && (
                            <>
                                <Text marginTop="1em">Note visibility:</Text>
                                <Select value={vis} onChange={(e) => setVis(e.target.value as NoteVisibility)}>
                                    <option value="PRIVATE">Private</option>
                                    <option value="DM_SHARED">Shared with DM</option>
                                    <option value="PUBLIC">Public</option>
                                </Select>
                            </>
                        )}
                    </DrawerBody>
                    <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={close}>
                            Close
                        </Button>
                        {props.note.owned && (
                            <Box mr={3}>
                                <ConfirmableButton onConfirm={del} defaultText="Delete" />
                            </Box>
                        )}
                        <Button onClick={edit}>Save</Button>
                    </DrawerFooter>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    );
};
