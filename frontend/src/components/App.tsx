import { Box } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import { campaignRoute, characterRoute, joinRoute, rootRoute } from '../config/constants';
import { applicationActions, campaignActions } from '../store/actions';
import { RootState } from '../store/reducers';
import { Header } from './molecules/Header';
import { CampaignList } from './pages/CampaignList';
import { CampaignView } from './pages/CampaignView';
import { CharacterView } from './pages/CharacterView';

const App = () => {
    const dispatch = useDispatch();

    const authorized = useSelector((state: RootState) => state.application.authorized);
    const initialized = useSelector((state: RootState) => state.application.initialized);
    useEffect(() => {
        dispatch(applicationActions.actions.initialize());
    }, [dispatch]);

    const campaignList = () => <CampaignList />;
    const campaignView = ({ match }: RouteComponentProps<{ id: string }>) => (
        <CampaignView campaignId={match.params.id} />
    );
    const characterView = ({ match }: RouteComponentProps<{ campaignid: string; characterid: string }>) => (
        <CharacterView campaignId={match.params.campaignid} characterId={match.params.characterid} />
    );
    const joinRedirect = ({ match }: RouteComponentProps<{ id: string }>) => {
        dispatch(campaignActions.actions.joinCampaign(match.params.id));
        return <Redirect to={rootRoute()} />;
    };

    if (initialized && authorized) {
        return (
            <Box>
                <Header />
                <Box paddingX="1em" marginRight="auto" marginLeft="auto" maxWidth="75rem">
                    <Switch>
                        <Route path={rootRoute()} exact render={campaignList} />
                        <Route strict path={characterRoute(':campaignid', ':characterid')} component={characterView} />
                        <Route strict path={campaignRoute(':id')} component={campaignView} />
                        <Route strict exact path={joinRoute(':id')} component={joinRedirect} />
                        <Redirect to={rootRoute()} />
                    </Switch>
                </Box>
            </Box>
        );
    }
    return <></>;
};

export default withRouter(App);
