import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Input,
    Link,
    ListItem,
    Select,
    Text,
    UnorderedList
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store/reducers';
import { ListCharacter } from '../../types/character.types';
import { ConfirmableButton } from '../atoms/ConfirmableButton';

interface Props {
    character: ListCharacter;
    onEdit: (id: string, name: string, description: string) => void;
    onDelete: (id: string) => void;
    onAddLabel: (id: string, labelId: string) => void;
    onRemoveLabel: (id: string, labelId: string) => void;
}

export const CharacterEditDrawer = (props: Props) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(props.character.name);
    const [desc, setDesc] = useState(props.character.description);
    const [label, setLabel] = useState<undefined | string>(undefined);
    const labels = useSelector((state: RootState) => state.campaign.labels);

    const reset = () => {
        setName(props.character.name);
        setDesc(props.character.description);
    };

    const edit = () => {
        props.onEdit(props.character.id, name, desc);
        close();
    };

    const del = () => {
        props.onDelete(props.character.id);
        close();
    };

    const addLabel = () => {
        if (!label) {
            return;
        }
        props.onAddLabel(props.character.id, label);
    };

    const close = () => {
        setOpen(false);
        reset();
    };

    const applicableLabels = labels.filter((l) => !props.character.labels.some((cl) => cl.id === l.id));

    return (
        <>
            <Drawer isOpen={open} onClose={close} size="lg">
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerHeader>Edit character</DrawerHeader>
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
                            {labels.length > 0 && (
                                <>
                                    <Text marginY="1em">Labels:</Text>
                                    {applicableLabels.length > 0 && (
                                        <Flex>
                                            <Select
                                                placeholder="Choose a label to add"
                                                value={label}
                                                onChange={(e) => setLabel(e.target.value)}
                                            >
                                                {applicableLabels.map((l) => (
                                                    <option key={l.id} value={l.id}>
                                                        {l.name}
                                                    </option>
                                                ))}
                                            </Select>
                                            <Button ml={3} disabled={label === undefined} onClick={addLabel}>
                                                Add
                                            </Button>
                                        </Flex>
                                    )}
                                    <UnorderedList mt={3}>
                                        {props.character.labels.map((l) => (
                                            <ListItem key={l.id}>
                                                {l.name} (
                                                <Link onClick={() => props.onRemoveLabel(props.character.id, l.id)}>
                                                    <Text as="u">remove</Text>
                                                </Link>
                                                )
                                            </ListItem>
                                        ))}
                                    </UnorderedList>
                                </>
                            )}
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
