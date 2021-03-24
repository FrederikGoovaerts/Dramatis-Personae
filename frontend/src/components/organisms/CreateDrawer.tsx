import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Input,
    Text,
    Textarea
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface Props {
    entity: string;
    nameString: string;
    namePlaceholder: string;
    textarea: boolean;
    onCreate: (name: string, description: string) => void;
}

export const CreateDrawer = (props: Props) => {
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
                        <DrawerHeader>Create a new {props.entity.toLowerCase()}</DrawerHeader>
                        <DrawerBody>
                            <Text marginY="1em">{props.nameString}:</Text>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={props.namePlaceholder}
                            />
                            <Text marginY="1em">Description:</Text>
                            {props.textarea ? (
                                <Textarea
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    placeholder={`${props.entity} description here`}
                                    size="lg"
                                    height="75%"
                                />
                            ) : (
                                <Input
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    placeholder="Character description"
                                />
                            )}
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
                Add {props.entity.toLowerCase()}
            </Button>
        </>
    );
};
