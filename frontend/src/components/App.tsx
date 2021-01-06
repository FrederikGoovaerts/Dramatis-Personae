import { Box } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import { routes } from '../config/constants';
import { applicationActions, campaignActions } from '../store/actions';
import { RootState } from '../store/reducers';
import { Loader } from './atoms/Loader';
import { Header } from './molecules/header/Header';
import { CampaignList } from './pages/CampaignList';

const App = () => {
    const dispatch = useDispatch();
    const authorized = useSelector((state: RootState) => state.application.authorized);
    const initialized = useSelector((state: RootState) => state.application.initialized);
    useEffect(() => {
        dispatch(applicationActions.actions.initialize());
    });

    const campaignList = () => <CampaignList />;
    const campaignDetail = ({ match, location }: RouteComponentProps<{ id: string }>) => (
        // <CampaignDetailScreen match={match} path={location.pathname} />
        <Box>Nuffin</Box>
    );
    const characterDetail = ({ match }: RouteComponentProps<{ campaignId: string; characterId: string }>) => (
        // <CharacterDetailScreen match={match} />
        <Box>Nuffin</Box>
    );
    const joinRedirect = ({ match }: RouteComponentProps<{ id: string }>) => {
        dispatch(campaignActions.actions.joinCampaign(match.params.id));
        return <Redirect to={routes.root} />;
    };

    if (initialized && authorized) {
        return (
            <Box marginRight="auto" marginLeft="auto" maxWidth="75rem">
                <Header />
                <Switch>
                    <Route path={routes.root} exact render={campaignList} />
                    <Route
                        strict
                        path={`${routes.campaign.path}:campaignId${routes.character}:characterId`}
                        component={characterDetail}
                    />
                    <Route strict path={`${routes.campaign.path}:id`} component={campaignDetail} />
                    <Route strict path={`${routes.join}:id`} component={joinRedirect} />
                    <Redirect to={routes.root} />
                </Switch>
            </Box>
        );
    }
    return <Loader />;
};

export default withRouter(App);
