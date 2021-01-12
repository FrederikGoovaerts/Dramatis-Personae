import { Box, Divider, HStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { campaignActions } from '../../store/actions';
import { campaignViewLoadingSelector, RootState } from '../../store/reducers';
import { Loader } from '../atoms/Loader';
import { CampaignSidebar } from '../organisms/CampaignSidebar';

interface Props {
    campaignId: string;
}

export const CampaignView = (props: Props) => {
    const dispatch = useDispatch();
    const loading = useSelector(campaignViewLoadingSelector);
    const campaign = useSelector((state: RootState) => state.campaign.campaign);

    useEffect(() => {
        dispatch(campaignActions.actions.fetchCampaign(props.campaignId));
        dispatch(campaignActions.actions.fetchCharacters(props.campaignId));
    }, [dispatch, props.campaignId]);

    if (loading || props.campaignId !== campaign?.id) {
        return <Loader />;
    }
    return (
        <HStack display="flex">
            <CampaignSidebar id={props.campaignId} />
            <Divider orientation="vertical" />
        </HStack>
    );
};
