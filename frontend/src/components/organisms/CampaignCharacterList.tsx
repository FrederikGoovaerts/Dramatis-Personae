import { Box, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { campaignActions } from '../../store/actions';
import { campaignCharactersLoadingSelector, RootState } from '../../store/reducers';
import { Loader } from '../atoms/Loader';

interface Props {
    campaignId: string;
}

export const CampaignCharacterList = (props: Props) => {
    const dispatch = useDispatch();
    const loading = useSelector(campaignCharactersLoadingSelector);
    const campaign = useSelector((state: RootState) => state.campaign.campaign);
    const characters = useSelector((state: RootState) => state.campaign.characters);

    useEffect(() => {
        dispatch(campaignActions.actions.fetchCharacters(props.campaignId));
    }, [dispatch, props.campaignId]);

    if (loading || props.campaignId !== campaign?.id) {
        return <Loader />;
    }
    return (
        <>
            {characters.map((c) => (
                <Text key={c.id}>{c.name}</Text>
            ))}
        </>
    );
};
