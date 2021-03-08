import { Button, Fade, Flex, HStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { campaignCharactersRoute, campaignNotesRoute, characterRoute } from '../../config/constants';
import { campaignActions } from '../../store/actions';
import { campaignLoadingSelector, RootState } from '../../store/reducers';
import { CampaignCharacterList } from '../organisms/CampaignCharacterList';
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
                            path={campaignNotesRoute(':campaignId')}
                            render={({ match }: RouteComponentProps<{ campaignId: string }>) => (
                                <CampaignNotesList campaignId={match.params.campaignId} owner={campaign.owner} />
                            )}
                        />
                        <Route
                            strict
                            path={characterRoute(':campaignId', ':characterId')}
                            component={() => <Button>specific</Button>}
                        />
                        <Redirect to={campaignCharactersRoute(props.campaignId)} />
                    </Switch>
                </Flex>
            </Fade>
        </HStack>
    );
};
