import {
    Box,
    Button,
    Checkbox,
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
    name: string;
    setName: (n: string) => void;
    labels: { id: string; name: string }[];
    selectedLabelIds: string[];
    setSelectedLabelIds: (l: string[]) => void;
    clear: () => void;
}

export const CharacterFilterDrawer = (props: Props) => {
    const [open, setOpen] = useState(false);

    const handleCheckbox = (id: string, newChecked: boolean) => {
        const idPruned = props.selectedLabelIds.filter((i) => i !== id);
        if (newChecked) {
            props.setSelectedLabelIds([...idPruned, id]);
        } else {
            props.setSelectedLabelIds(idPruned);
        }
    };

    return (
        <>
            <Drawer isOpen={open} onClose={() => setOpen(false)} size="lg">
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerHeader>Character filters</DrawerHeader>
                        <DrawerBody>
                            <Text marginY="1em">Name:</Text>
                            <Input
                                value={props.name}
                                onChange={(e) => props.setName(e.target.value)}
                                placeholder="Character name"
                            />
                            <Text marginY="1em">Labels:</Text>
                            {props.labels.map((l) => {
                                const checked = props.selectedLabelIds.includes(l.id);
                                return (
                                    <Box key={l.id}>
                                        <Checkbox isChecked={checked} onChange={() => handleCheckbox(l.id, !checked)}>
                                            {l.name}
                                        </Checkbox>
                                    </Box>
                                );
                            })}
                        </DrawerBody>
                        <DrawerFooter>
                            <Button variant="outline" mr={3} onClick={props.clear}>
                                Clear
                            </Button>
                            <Button variant="outline" mr={3} onClick={() => setOpen(false)}>
                                Close
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
            <Button onClick={() => setOpen(true)} size="sm">
                Filter characters
            </Button>
        </>
    );
};
