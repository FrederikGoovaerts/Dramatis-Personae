import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    InputGroup,
    InputRightAddon,
    Select,
    Text
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { campaignActions } from '../../store/actions';
import { campaignCharactersLoadingSelector, RootState } from '../../store/reducers';
import { Event } from '../../types/event.types';

interface Props {
    campaignId: string;
    open: boolean;
    event: Event;
    onAddCharacter: (id: string) => void;
    onAddLocation: (id: string) => void;
    onClose: () => void;
}

export const EventRelationDrawer = (props: Props) => {
    const [char, setChar] = useState<string | undefined>(undefined);
    // const [loc, setLoc] = useState<string | undefined>(undefined);

    const dispatch = useDispatch();
    const characters = useSelector((state: RootState) => state.campaign.characters);
    const loading = useSelector(campaignCharactersLoadingSelector);

    useEffect(() => {
        if (props.open) {
            dispatch(campaignActions.actions.fetchCharacters(props.campaignId));
        }
    }, [props.open, props.campaignId, dispatch]);

    const onClose = () => {
        setChar(undefined);
        props.onClose();
        // setLoc(undefined);
    };

    const addChar = () => {
        if (char) {
            props.onAddCharacter(char);
            onClose();
        }
    };

    const applicableChars = characters.filter((c) => !props.event.characters.find((ec) => ec.id === c.id));

    return (
        <Drawer isOpen={props.open && !loading} onClose={onClose} size="lg">
            <DrawerOverlay>
                <DrawerContent>
                    <DrawerHeader>Add event relation</DrawerHeader>
                    <DrawerBody>
                        {applicableChars.length > 0 ? (
                            <Flex>
                                <InputGroup>
                                    <Select
                                        placeholder="Choose a character to add"
                                        value={char}
                                        onChange={(e) => setChar(e.target.value)}
                                        borderEndRadius="0"
                                    >
                                        {applicableChars.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <InputRightAddon padding="0">
                                        <Button
                                            disabled={char === undefined}
                                            onClick={addChar}
                                            variant="ghost"
                                            borderRadius="0"
                                        >
                                            Add
                                        </Button>
                                    </InputRightAddon>
                                </InputGroup>
                            </Flex>
                        ) : (
                            <Text mb={3}>No characters available.</Text>
                        )}
                    </DrawerBody>
                    <DrawerFooter>
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    );
};
