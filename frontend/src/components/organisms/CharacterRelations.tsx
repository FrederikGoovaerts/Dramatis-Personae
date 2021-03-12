import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Fade,
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
import { CharacterRelationCreateDrawer } from './CharacterRelationCreateDrawer';

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

    const deleteCharacterRelation = (relId: string) => {
        dispatch(characterActions.actions.deleteRelation({ charId: props.characterId, relationId: relId }));
    };

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
                        <Fade in={!loading}>
                            <UnorderedList ml={3}>
                                {sortedCharacterRelations.map((r) => (
                                    <CharacterRelationListItem
                                        campaignId={props.campaignId}
                                        characterId={props.characterId}
                                        relation={r}
                                        onDelete={() => deleteCharacterRelation(r.id)}
                                        key={r.id}
                                    />
                                ))}
                            </UnorderedList>
                        </Fade>
                        <Box mt={3}>
                            <CharacterRelationCreateDrawer
                                campaignId={props.campaignId}
                                characterId={props.characterId}
                            />
                        </Box>
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
