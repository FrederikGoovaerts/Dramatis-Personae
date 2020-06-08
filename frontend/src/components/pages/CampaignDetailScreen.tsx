import './CampaignDetailScreen.scss';

import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';
import { connect } from 'react-redux';
import { match, Redirect, Route, Switch } from 'react-router';
import { Box, Drawer, Toolbar, Theme } from '@material-ui/core';

import { routes } from '../../config/constants';
import { campaignActions, proposedCharacterActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { Campaign } from '../../types/campaign.types';
import { CampaignHeader } from '../molecules/CampaignHeader';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { CampaignCharacters } from './campaignDetailComponents/CampaignCharacters';
import { CampaignDetails } from './campaignDetailComponents/CampaignDetails';
import { ListItemLink } from '../atoms/ListItemLink';
import { CampaignNotes } from './campaignDetailComponents/CampaignNotes';
import { CampaignLabels } from './campaignDetailComponents/CampaignLabels';

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

export interface MatchParams {
    id: string;
}

interface Props {
    match: match<MatchParams>;
    path: string;
}

interface MapProps extends WithStyles<typeof styles> {
    campaign: Campaign | null;
    loading: boolean;
    fetchCampaign: (campaignId: string) => void;
    fetchNotes: (campaignId: string) => void;
    fetchSharedNotes: (campaignId: string) => void;
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
        const notesUrl = `${url}${routes.campaign.subpathNotes}`;
        const labelsUrl = `${url}${routes.campaign.subpathLabels}`;
        const detailsUrl = `${url}${routes.campaign.subpathDetails}`;

        return (
            <div className={'CampaignDetail__container'}>
                <CampaignHeader name={this.props.campaign?.name} className={this.props.classes.appBar} />
                <Drawer
                    variant="permanent"
                    PaperProps={{ elevation: 1 }}
                    classes={{ paper: this.props.classes.drawerPaper }}
                >
                    <Toolbar />
                    <List>
                        <ListItemLink selected={this.props.path === characterUrl} to={characterUrl}>
                            <ListItemText primary="Characters" />
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
    characters: state.campaign.characters,
    proposedCharacters: state.campaign.proposedCharacters,
    loading: state.campaign.campaignLoading
});

export const CampaignDetailScreen = connect(mapStateToProps, {
    fetchCampaign: campaignActions.actions.fetchCampaign,
    fetchCharacters: campaignActions.actions.fetchCharacters,
    fetchProposedCharacters: campaignActions.actions.fetchProposedCharacters,
    fetchNotes: campaignActions.actions.fetchNotes,
    fetchSharedNotes: campaignActions.actions.fetchSharedNotes,
    acceptProposedCharacter: proposedCharacterActions.actions.acceptProposedCharacter,
    deleteProposedCharacter: proposedCharacterActions.actions.deleteProposedCharacter,
    fetchMembers: campaignActions.actions.fetchMembers,
    deleteCampaign: campaignActions.actions.deleteCampaign,
    leaveCampaign: campaignActions.actions.leaveCampaign,
    rotateInviteCode: campaignActions.actions.rotateInviteCode
})(withStyles(styles)(CampaignDetailRaw));
