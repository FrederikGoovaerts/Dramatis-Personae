import { Box } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import { CampaignDetailScreen } from '../components-old/pages/CampaignDetailScreen';
import { CharacterDetailScreen } from '../components-old/pages/CharacterDetailScreen';
import { routes } from '../config/constants';
import { applicationActions, campaignActions } from '../store/actions';
import { RootState } from '../store/reducers';
import { Loader } from './atoms/Loader';
import { Header } from './molecules/header/Header';
import { CampaignList } from './pages/CampaignList';

interface Props {
    initialized: boolean;
    authorized: boolean;
    initialize: () => void;
    joinCampaign: (id: string) => void;
}

const App = (props: Props) => {
    useEffect(() => {
        props.initialize();
    });

    const campaignList = () => <CampaignList />;
    const campaignDetail = ({ match, location }: RouteComponentProps<{ id: string }>) => (
        <CampaignDetailScreen match={match} path={location.pathname} />
    );
    const characterDetail = ({ match }: RouteComponentProps<{ campaignId: string; characterId: string }>) => (
        <CharacterDetailScreen match={match} />
    );
    const joinRedirect = ({ match }: RouteComponentProps<{ id: string }>) => {
        props.joinCampaign(match.params.id);
        return <Redirect to={routes.root} />;
    };

    if (props.initialized && props.authorized) {
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

const mapStateToProps = (state: RootState) => ({
    authorized: state.application.authorized,
    initialized: state.application.initialized
});

export default withRouter(
    connect(mapStateToProps, {
        initialize: applicationActions.actions.initialize,
        joinCampaign: campaignActions.actions.joinCampaign
    })(App)
);
