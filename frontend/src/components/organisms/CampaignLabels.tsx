import { Box, Heading, Link, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { campaignActions, labelActions } from '../../store/actions';
import { campaignCharacterListLoadingSelector, RootState } from '../../store/reducers';
import { LabelNewForm } from '../molecules/LabelNewForm';

interface Props {
    campaignId: string;
}

export const CampaignLabels = (props: Props) => {
    const dispatch = useDispatch();
    const loading = useSelector(campaignCharacterListLoadingSelector);
    const labels = useSelector((state: RootState) => state.campaign.labels);

    useEffect(() => {
        dispatch(campaignActions.actions.fetchLabels(props.campaignId));
    }, [dispatch, props.campaignId]);

    const del = (id: string) => {
        dispatch(labelActions.actions.deleteLabel({ campaignId: props.campaignId, labelId: id }));
    };

    if (loading) {
        return <></>;
    }

    return (
        <Box>
            <Heading size="md">Labels used in the campaign:</Heading>
            <UnorderedList my={6}>
                {labels.map((l) => (
                    <ListItem key={l.id}>
                        {l.name} (
                        <Link onClick={() => del(l.id)}>
                            <Text as="u">remove</Text>
                        </Link>
                        )
                    </ListItem>
                ))}
            </UnorderedList>
            <LabelNewForm campaignId={props.campaignId} />
        </Box>
    );
};
