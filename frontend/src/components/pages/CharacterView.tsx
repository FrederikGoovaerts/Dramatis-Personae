import { Fade, HStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { characterActions } from '../../store/actions';
import { campaignLoadingSelector, RootState } from '../../store/reducers';
import { CharacterNotesList } from '../organisms/CharacterNotesList';
import { CharacterSidebar } from '../organisms/CharacterSidebar';

interface Props {
    campaignId: string;
    characterId: string;
}

export const CharacterView = (props: Props) => {
    const dispatch = useDispatch();
    const loading = useSelector(campaignLoadingSelector);
    const character = useSelector((state: RootState) => state.character.character);

    useEffect(() => {
        dispatch(characterActions.actions.fetchCharacter(props.characterId));
        dispatch(characterActions.actions.fetchNotes(props.characterId));
        dispatch(characterActions.actions.fetchSharedNotes(props.characterId));
    }, [dispatch, props.characterId]);

    if (loading || props.characterId !== character?.id) {
        return <></>;
    }

    return (
        <HStack marginTop="2em" alignItems="flex-start" spacing={8}>
            <CharacterSidebar campaignId={props.campaignId} characterId={props.characterId} />
            <Fade in={true} style={{ width: '100%' }}>
                <CharacterNotesList characterId={props.characterId} />
            </Fade>
        </HStack>
    );
};
