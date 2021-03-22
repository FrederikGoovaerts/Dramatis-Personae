import { Fade, Flex, HStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import {
    campaignCharactersRoute,
    campaignEventsRoute,
    campaignLabelsRoute,
    campaignNotesRoute
} from '../../config/constants';
import { campaignActions } from '../../store/actions';
import { campaignLoadingSelector, RootState } from '../../store/reducers';
import { CampaignCharacterList } from '../organisms/CampaignCharacterList';
import { CampaignEventList } from '../organisms/CampaignEventList';
import { CampaignLabels } from '../organisms/CampaignLabels';
import { CampaignNotesList } from '../organisms/CampaignNotesList';
import { CampaignSidebar } from '../organisms/CampaignSidebar';

interface Props {
    campaignId: string;
}

export const CampaignView = (props: Props) => {
    const dispatch = useDispatch();
    const loading = useSelector(campaignLoadingSelector);
    const campaign = useSelector((state: RootState) => state.campaign.campaign);

    useEffect(() => {
        dispatch(campaignActions.actions.fetchCampaign(props.campaignId));
    }, [dispatch, props.campaignId]);

    if (loading || props.campaignId !== campaign?.id) {
        return <></>;
    }

    return (
        <HStack marginTop="2em" alignItems="flex-start" spacing={8}>
            <CampaignSidebar id={props.campaignId} />
            <Fade in={true} style={{ width: '100%' }}>
                <Flex flex={1} direction="column">
                    <Switch>
                        <Route
                            strict
                            path={campaignCharactersRoute(':campaignId')}
                            render={({ match }: RouteComponentProps<{ campaignId: string }>) => (
                                <CampaignCharacterList campaignId={match.params.campaignId} owner={campaign.owner} />
                            )}
                        />
                        <Route
                            strict
                            path={campaignEventsRoute(':campaignId')}
                            render={({ match }: RouteComponentProps<{ campaignId: string }>) => (
                                <CampaignEventList campaignId={match.params.campaignId} />
                            )}
                        />
                        <Route
                            strict
                            path={campaignNotesRoute(':campaignId')}
                            render={({ match }: RouteComponentProps<{ campaignId: string }>) => (
                                <CampaignNotesList campaignId={match.params.campaignId} owner={campaign.owner} />
                            )}
                        />
                        <Route
                            strict
                            path={campaignLabelsRoute(':campaignId')}
                            render={({ match }: RouteComponentProps<{ campaignId: string }>) => (
                                <CampaignLabels campaignId={match.params.campaignId} />
                            )}
                        />
                        <Redirect to={campaignCharactersRoute(props.campaignId)} />
                    </Switch>
                </Flex>
            </Fade>
        </HStack>
    );
};
