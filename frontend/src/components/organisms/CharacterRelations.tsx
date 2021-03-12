import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Heading,
    Skeleton,
    Stack,
    UnorderedList
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { characterActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { CharacterRelationListItem } from '../molecules/CharacterRelationLine';

interface Props {
    campaignId: string;
    characterId: string;
}

export const CharacterRelations = (props: Props) => {
    const dispatch = useDispatch();
    const characterRelations = useSelector((state: RootState) => state.character.relations);
    const loading = useSelector((state: RootState) => state.character.relationsLoading);

    useEffect(() => {
        dispatch(characterActions.actions.fetchRelations(props.characterId));
    }, [dispatch, props.characterId]);

    if (loading) {
        return (
            <>
                <Heading size="lg" mb={6}>
                    Character interactions
                </Heading>
                <Stack>
                    <Skeleton height="40px" />
                    <Skeleton height="40px" />
                </Stack>
            </>
        );
    }

    const sortedCharacterRelations = [...characterRelations].sort((r1) =>
        r1.origin.id === props.characterId ? -1 : 1
    );

    return (
        <>
            <Heading size="lg" mb={6}>
                Character interactions
            </Heading>
            <Accordion allowToggle>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left">
                                Relations with other characters
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <UnorderedList ml={3}>
                            {sortedCharacterRelations.map((r) => (
                                <CharacterRelationListItem
                                    campaignId={props.campaignId}
                                    characterId={props.characterId}
                                    relation={r}
                                    onDelete={console.log}
                                    key={r.id}
                                />
                            ))}
                        </UnorderedList>
                        <Button mt={3}>Add new relation</Button>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem isDisabled={true}>
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left">
                                Events featuring this character
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>Not yet implemented</AccordionPanel>
                </AccordionItem>
            </Accordion>
        </>
    );
};
