import './App.scss';

import { makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import { routes } from '../config/constants';
import { applicationActions } from '../store/actions';
import { RootState } from '../store/reducers';
import { CampaignDetailScreen, MatchParams as CampaignMatchParams } from './pages/CampaignDetailScreen';
import { CampaignList } from './pages/CampaignList';
import { CharacterDetailScreen, MatchParams as CharacterMatchParams } from './pages/CharacterDetailScreen';
import { Landing } from './pages/Landing';

interface Props {
    initialized: boolean;
    authorized: boolean;
    initialize: () => void;
}

const useStyles = makeStyles({
    outerContainer: {
        display: 'flex',
        justifyContent: 'center'
    },
    innerContainer: {
        width: '90vw'
    }
});

const App = (props: Props) => {
    const classes = useStyles();
    useEffect(() => {
        props.initialize();
    });

    const campaignList = ({ match }: RouteComponentProps<{}>) => <CampaignList match={match} />;
    const campaignDetail = ({ match, location }: RouteComponentProps<CampaignMatchParams>) => (
        <CampaignDetailScreen match={match} path={location.pathname} />
    );
    const characterDetail = ({ match }: RouteComponentProps<CharacterMatchParams>) => (
        <CharacterDetailScreen match={match} />
    );

    if (props.initialized && props.authorized) {
        return (
            <div className={classes.outerContainer}>
                <div className={classes.innerContainer}>
                    <Switch>
                        <Route path={routes.root} exact render={campaignList} />
                        <Route
                            strict
                            path={`${routes.campaign.path}:campaignId${routes.character}:characterId`}
                            component={characterDetail}
                        />
                        <Route strict path={`${routes.campaign.path}:id`} component={campaignDetail} />
                        <Redirect to={routes.root} />
                    </Switch>
                </div>
            </div>
        );
    }
    return (
        <div>
            <Landing />
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({
    authorized: state.application.authorized,
    initialized: state.application.initialized
});

export default withRouter(connect(mapStateToProps, { initialize: applicationActions.actions.initialize })(App));
