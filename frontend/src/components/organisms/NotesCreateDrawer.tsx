import {
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

import { NoteVisibility } from '../../types/note.types';

interface Props {
    onCreate: (contents: string, visibility: NoteVisibility) => void;
}

export const NotesCreateDrawer = (props: Props) => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [vis, setVis] = useState<NoteVisibility>('PRIVATE');

    const reset = () => {
        setText('');
        setVis('PRIVATE');
    };

    const create = () => {
        props.onCreate(text, vis);
        reset();
        setOpen(false);
    };

    return (
        <>
            <Drawer isOpen={open} onClose={() => setOpen(false)} size="lg">
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerHeader>Create a new note</DrawerHeader>
                        <DrawerBody>
                            <Textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Your note here"
                                size="lg"
                                height="75%"
                            />
                            <Text marginTop="1em">Note visibility:</Text>
                            <Select value={vis} onChange={(e) => setVis(e.target.value as NoteVisibility)}>
                                <option value="PRIVATE">Private</option>
                                <option value="DM_SHARED">Shared with DM</option>
                                <option value="PUBLIC">Public</option>
                            </Select>
                        </DrawerBody>
                        <DrawerFooter>
                            <Button variant="outline" mr={3} onClick={() => setOpen(false)}>
                                Close
                            </Button>
                            <Button variant="outline" mr={3} onClick={reset}>
                                Clear
                            </Button>
                            <Button onClick={create}>Save</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
            <Button onClick={() => setOpen(true)} size="sm">
                Add
            </Button>
        </>
    );
};
