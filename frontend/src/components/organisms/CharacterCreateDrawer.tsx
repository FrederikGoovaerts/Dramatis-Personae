import {
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

interface Props {
    onCreate: (name: string, description: string) => void;
}

export const CharacterCreateDrawer = (props: Props) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');

    const reset = () => {
        setName('');
        setDesc('');
    };

    const create = () => {
        props.onCreate(name, desc);
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
                            <Text marginY="1em">Name:</Text>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Character name"
                            />
                            <Text marginY="1em">Description:</Text>
                            <Input
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder="Character description"
                            />
                        </DrawerBody>
                        <DrawerFooter>
                            <Button variant="outline" mr={3} onClick={() => setOpen(false)}>
                                Close
                            </Button>
                            <Button variant="outline" mr={3} onClick={reset}>
                                Clear
                            </Button>
                            <Button onClick={create} disabled={name === ''}>
                                Save
                            </Button>
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
