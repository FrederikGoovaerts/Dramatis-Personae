import { Box } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import { campaignRoute, characterRoute, joinRoute, rootRoute } from '../config/constants';
import { applicationActions, campaignActions } from '../store/actions';
import { RootState } from '../store/reducers';
import { Loader } from './atoms/Loader';
import { Header } from './molecules/header/Header';
import { CampaignList } from './pages/CampaignList';
import { CampaignView } from './pages/CampaignView';

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
    const characterDetail = ({ match }: RouteComponentProps<{ campaignId: string; characterId: string }>) => (
        // <CharacterDetailScreen match={match} />
        <Box>Nuffin</Box>
    );
    const joinRedirect = ({ match }: RouteComponentProps<{ id: string }>) => {
        dispatch(campaignActions.actions.joinCampaign(match.params.id));
        return <Redirect to={rootRoute()} />;
    };

    if (initialized && authorized) {
        return (
            <Box marginRight="auto" marginLeft="auto" maxWidth="75rem">
                <Header />
                <Switch>
                    <Route path={rootRoute()} exact render={campaignList} />
                    <Route strict path={characterRoute(':campaignId', ':characterId')} component={characterDetail} />
                    <Route strict path={campaignRoute(':id')} component={campaignView} />
                    <Route strict exact path={joinRoute(':id')} component={joinRedirect} />
                    <Redirect to={rootRoute()} />
                </Switch>
            </Box>
        );
    }
    return <Loader />;
};

export default withRouter(App);
