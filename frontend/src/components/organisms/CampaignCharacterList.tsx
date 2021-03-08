import { Box } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { campaignActions } from '../../store/actions';
import { campaignCharactersLoadingSelector, RootState } from '../../store/reducers';
import { CharacterLine } from '../molecules/character/CharacterLine';
import { CharacterCreateDrawer } from './CharacterCreateDrawer';

interface Props {
    campaignId: string;
    owner: boolean;
}

export const CampaignCharacterList = (props: Props) => {
    const dispatch = useDispatch();
    const loading = useSelector(campaignCharactersLoadingSelector);
    const campaign = useSelector((state: RootState) => state.campaign.campaign);
    const characters = useSelector((state: RootState) => state.campaign.characters);

    useEffect(() => {
        dispatch(campaignActions.actions.fetchCharacters(props.campaignId));
    }, [dispatch, props.campaignId]);

    const create = (name: string, description: string) => {
        dispatch(
            campaignActions.actions.createCharacter({
                campaignId: props.campaignId,
                character: { name, description, visible: true }
            })
        );
    };

    if (loading || props.campaignId !== campaign?.id) {
        return <></>;
    }
    return (
        <Box>
            <CharacterCreateDrawer onCreate={create} />
            {characters.map((c) => (
                <>
                    <CharacterLine key={c.id} character={c} campaignId={props.campaignId} />
                </>
            ))}
        </Box>
    );
};
