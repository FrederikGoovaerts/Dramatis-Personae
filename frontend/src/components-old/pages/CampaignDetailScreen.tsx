import './CampaignDetailScreen.scss';

import { Box, Drawer, Theme, Toolbar } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import * as React from 'react';
import { connect } from 'react-redux';
import { match, Redirect, Route, Switch } from 'react-router';

import { routes } from '../../config/constants';
import { campaignActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { Campaign } from '../../types/campaign.types';
import { ListItemLink } from '../atoms/ListItemLink';
import { CampaignHeader } from '../molecules/header/CampaignHeader';
import { CampaignCharacters } from './campaignDetailComponents/CampaignCharacters';
import { CampaignDetails } from './campaignDetailComponents/CampaignDetails';
import { CampaignEvents } from './campaignDetailComponents/CampaignEvents';
import { CampaignLabels } from './campaignDetailComponents/CampaignLabels';
import { CampaignNotes } from './campaignDetailComponents/CampaignNotes';

const styles = (theme: Theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    drawerPaper: {
        width: '10em'
    },
    content: {
        marginTop: '1em',
        marginLeft: '10em'
    }
});

interface Props {
    match: match<{ id: string }>;
    path: string;
}

interface MapProps extends WithStyles<typeof styles> {
    campaign: Campaign | null;
    loading: boolean;
    fetchCampaign: (campaignId: string) => void;
}

type AllProps = Props & MapProps;

interface State {
    inaccessible: boolean;
}

class CampaignDetailRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { inaccessible: false };
    }

    componentDidMount(): void {
        this.props.fetchCampaign(this.props.match.params.id);
    }

    makeInaccessible = (): void => this.setState({ inaccessible: true });

    render() {
        if (this.state.inaccessible) {
            return <Redirect to={routes.root} />;
        }

        const {
            campaign,
            loading,
            match: { path, url }
        } = this.props;

        const characterUrl = `${url}${routes.campaign.subpathCharacters}`;
        const eventsUrl = `${url}${routes.campaign.subpathEvents}`;
        const notesUrl = `${url}${routes.campaign.subpathNotes}`;
        const labelsUrl = `${url}${routes.campaign.subpathLabels}`;
        const detailsUrl = `${url}${routes.campaign.subpathDetails}`;

        return (
            <div className={'CampaignDetail__container'}>
                <Drawer
                    variant="permanent"
                    PaperProps={{ elevation: 1 }}
                    classes={{ paper: this.props.classes.drawerPaper }}
                >
                    <List>
                        <ListItemLink selected={this.props.path === characterUrl} to={characterUrl}>
                            <ListItemText primary="Characters" />
                        </ListItemLink>
                        <ListItemLink selected={this.props.path === eventsUrl} to={eventsUrl}>
                            <ListItemText primary="Events" />
                        </ListItemLink>
                        <ListItemLink selected={this.props.path === notesUrl} to={notesUrl}>
                            <ListItemText primary="Notes" />
                        </ListItemLink>
                        <ListItemLink selected={this.props.path === labelsUrl} to={labelsUrl}>
                            <ListItemText primary="Labels" />
                        </ListItemLink>
                        <ListItemLink selected={this.props.path === detailsUrl} to={detailsUrl}>
                            <ListItemText primary="Details" />
                        </ListItemLink>
                    </List>
                </Drawer>
                <Box className={this.props.classes.content}>
                    <Toolbar />
                    {loading || !campaign ? (
                        <CircularProgress />
                    ) : (
                        <Switch>
                            <Route
                                path={`${path}${routes.campaign.subpathCharacters}`}
                                exact
                                render={() => (
                                    <CampaignCharacters
                                        campaignId={campaign.id}
                                        owner={campaign.owner}
                                        matchUrl={url}
                                    />
                                )}
                            />
                            <Route
                                path={`${path}${routes.campaign.subpathEvents}`}
                                exact
                                render={() => <CampaignEvents campaignId={campaign.id} />}
                            />
                            <Route
                                path={`${path}${routes.campaign.subpathNotes}`}
                                exact
                                render={() => <CampaignNotes owner={campaign.owner} campaignId={campaign.id} />}
                            />
                            <Route
                                path={`${path}${routes.campaign.subpathLabels}`}
                                exact
                                render={() => <CampaignLabels owner={campaign.owner} campaignId={campaign.id} />}
                            />
                            <Route
                                path={`${path}${routes.campaign.subpathDetails}`}
                                exact
                                render={() => (
                                    <CampaignDetails campaign={campaign} onInaccessible={this.makeInaccessible} />
                                )}
                            />
                            <Redirect to={`${path}${routes.campaign.subpathCharacters}`} />
                        </Switch>
                    )}
                </Box>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    campaign: state.campaign.campaign,
    loading: state.campaign.campaignLoading
});

export const CampaignDetailScreen = connect(mapStateToProps, {
    fetchCampaign: campaignActions.actions.fetchCampaign
})(withStyles(styles)(CampaignDetailRaw));