import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Input,
    Select,
    Skeleton,
    Text
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { campaignActions, characterActions } from '../../store/actions';
import { RootState } from '../../store/reducers';

interface Props {
    campaignId: string;
    characterId: string;
}

export const CharacterRelationCreateDrawer = (props: Props) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [relation, setRelation] = useState('');
    const [target, setTarget] = useState<undefined | string>(undefined);

    const character = useSelector((state: RootState) => state.character.character);
    const characters = useSelector((state: RootState) => state.campaign.characters);
    const loading = useSelector((state: RootState) => state.campaign.charactersLoading);

    useEffect(() => {
        dispatch(campaignActions.actions.fetchCharacters(props.campaignId));
    }, [dispatch, props.campaignId]);

    const close = () => {
        setRelation('');
        setTarget(undefined);
        setOpen(false);
    };

    const create = () => {
        if (target !== undefined) {
            dispatch(characterActions.actions.createRelation({ orig: props.characterId, dest: target, relation }));
        }
    };

    const relationTargets = characters.filter((c) => c.id !== props.characterId);

    return (
        <>
            <Drawer isOpen={open} onClose={close} size="lg">
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerHeader>Create a relation</DrawerHeader>
                        <DrawerBody>
                            {character && character.id === props.characterId && (
                                <Text marginY="1em">From: {character.name}</Text>
                            )}
                            <Input
                                value={relation}
                                onChange={(e) => setRelation(e.target.value)}
                                placeholder="Relation text"
                            />
                            <Text marginY="1em">To:</Text>
                            {loading ? (
                                <Skeleton />
                            ) : (
                                <Select
                                    placeholder="Choose a target character"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    borderEndRadius="0"
                                >
                                    {relationTargets.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        </DrawerBody>
                        <DrawerFooter>
                            <Button variant="outline" mr={3} onClick={close}>
                                Close
                            </Button>
                            <Button onClick={create} disabled={relation === '' || target === undefined}>
                                Save
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
            <Button onClick={() => setOpen(true)} size="sm">
                Add relation
            </Button>
        </>
    );
};
