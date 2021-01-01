import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { characterActions } from '../../../store/actions';
import { RootState } from '../../../store/reducers';
import { RelationCandidate } from '../../../types/relation.types';
import { Relations } from '../../molecules/relations/Relations';

export const CharacterRelations = (): JSX.Element => {
    const dispatch = useDispatch();

    const loading = useSelector(
        (state: RootState) =>
            state.character.loading || state.character.relationsLoading || state.campaign.charactersLoading
    );
    const character = useSelector((state: RootState) => state.character.character);
    const relations = useSelector((state: RootState) => state.character.relations);
    const campaignCharacters = useSelector((state: RootState) => state.campaign.characters);
    const otherCharacters = campaignCharacters.filter((c) => c.id !== character?.id);

    useEffect(() => {
        if (character) {
            dispatch(characterActions.actions.fetchRelations(character.id));
        }
    }, [character, dispatch]);

    if (loading || !character) {
        return <></>;
    }

    const addRelation = (orig: RelationCandidate, dest: RelationCandidate, relation: string) => {
        dispatch(
            characterActions.actions.createRelation({
                orig: orig.id,
                dest: dest.id,
                relation
            })
        );
    };

    const deleteRelation = (id: string) => {
        dispatch(characterActions.actions.deleteRelation({ charId: character.id, relationId: id }));
    };

    return (
        <Relations
            onAddRelation={addRelation}
            onDeleteRelation={deleteRelation}
            self={character}
            relations={relations}
            otherToLink={(id: string) => id}
            relationCandidates={otherCharacters}
        />
    );
};
