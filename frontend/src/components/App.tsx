import './App.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import { routes } from '../config/constants';
import { applicationActions } from '../store/actions';
import { RootState } from '../store/reducers';
import { CampaignDetailScreen, MatchParams as CampaignMatchParams } from './pages/CampaignDetailScreen';
import { CampaignList } from './pages/CampaignList';
import { CharacterDetailScreen, MatchParams as CharacterMatchParams } from './pages/CharacterDetailScreen';
import { Landing } from './pages/Landing';

interface TMapProps {
    initialized: boolean;
    authorized: boolean;
}

interface TActionProps {
    initialize: () => void;
}

class App extends React.Component<TMapProps & TActionProps & RouteComponentProps<{}>> {
    componentDidMount() {
        this.props.initialize();
    }

    campaignList = ({ match }: RouteComponentProps<{}>) => <CampaignList match={match} />;
    campaignDetail = ({ match }: RouteComponentProps<CampaignMatchParams>) => <CampaignDetailScreen match={match} />;
    characterDetail = ({ match }: RouteComponentProps<CharacterMatchParams>) => <CharacterDetailScreen match={match} />;

    render() {
        const { initialized, authorized } = this.props;
        if (initialized && authorized) {
            return (
                <div className={'App__pageOuterContainer'}>
                    <div className={'App__pageInnerContainer'}>
                        <Switch>
                            <Route path={routes.root} exact render={this.campaignList} />
                            <Route
                                strict
                                path={`${routes.campaign}:campaignId${routes.character}:characterId`}
                                component={this.characterDetail}
                            />
                            <Route strict path={`${routes.campaign}:id`} component={this.campaignDetail} />
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
    }
}

const mapStateToProps = (state: RootState): TMapProps => ({
    authorized: state.application.authorized,
    initialized: state.application.initialized,
});

export default withRouter(
    connect(
        mapStateToProps,
        { initialize: applicationActions.actions.initialize },
    )(App),
);
