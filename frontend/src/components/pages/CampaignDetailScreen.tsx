import './CampaignDetailScreen.scss';

import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { connect } from 'react-redux';
import { match, Redirect } from 'react-router';
import { Fab, Modal, FormControlLabel, IconButton, Box } from '@material-ui/core';
import { Add, Visibility, Edit } from '@material-ui/icons';

import { routes } from '../../config/constants';
import { campaignActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { ListCharacter, Campaign } from '../../types';
import { ListItemLink } from '../atoms/ListItemLink';
import { CampaignCharacterBreadcrumb } from '../molecules/CampaignCharacterBreadcrumbs';
import { Header } from '../molecules/Header';
import { NewCharacterForm } from '../molecules/NewCharacterForm';
import { EditCampaignForm } from '../molecules/EditCampaignForm';

export interface MatchParams {
    id: string;
}

interface Props {
    match: match<MatchParams>;
}

interface MapProps {
    campaign: Campaign | null;
    characters: ListCharacter[];
    loading: boolean;
    fetchCampaign: (id: string) => void;
    fetchCharacters: (campaignId: string) => void;
    deleteCampaign: (id: string) => void;
}

type AllProps = Props & MapProps;

interface State {
    createOpen: boolean;
    editCampaignOpen: boolean;
    deleteCheck: boolean;
    deleted: boolean;
}

class CampaignDetailRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { createOpen: false, editCampaignOpen: false, deleteCheck: false, deleted: false };
    }

    componentDidMount(): void {
        this.props.fetchCampaign(this.props.match.params.id);
        this.props.fetchCharacters(this.props.match.params.id);
    }

    openCreate = (): void => {
        this.setState({ createOpen: true });
    };

    closeCreate = (): void => {
        this.setState({ createOpen: false });
    };

    closeEditCampaign = (): void => {
        this.setState({ editCampaignOpen: false });
    };

    renderCharacter = (character: ListCharacter) => (
        <ListItemLink to={`${this.props.match.url}${routes.character}${character.id}`} key={character.id}>
            <ListItemText primary={character.name} />
            {this.props.campaign?.owner && <Visibility color={character.visible ? 'primary' : 'disabled'} />}
        </ListItemLink>
    );

    renderCreateCharacter = () => (
        <Paper className="CampaignDetail__createPaper">
            <Typography variant="h5">New character</Typography>
            <NewCharacterForm
                campaignId={this.props.match.params.id}
                className="CampaignDetail__createContainer"
                onSubmitComplete={this.closeCreate}
            />
        </Paper>
    );

    renderEditCampaign = () => {
        if (!this.props.campaign) {
            return <div />;
        }
        const onDelete = () => this.setState({ deleted: true });
        return (
            <EditCampaignForm
                id={this.props.match.params.id}
                name={this.props.campaign?.name}
                onSubmitComplete={this.closeEditCampaign}
                onDelete={onDelete}
            />
        );
    };

    render() {
        if (this.state.deleted) {
            return (
                <div>
                    <Redirect to={routes.root} />
                </div>
            );
        }

        let contents: React.ReactNode;
        if (this.props.loading || !this.props.campaign) {
            contents = <CircularProgress />;
        } else {
            const { campaign, characters } = this.props;
            contents = (
                <div>
                    <CampaignCharacterBreadcrumb campaign={campaign} />
                    <Typography variant={'h4'}>{campaign.name}</Typography>
                    <Typography variant={'subtitle1'}>{`Run by ${
                        campaign.owner ? 'you' : campaign.ownerName
                    }`}</Typography>
                    <Box marginTop="1em" marginBottom="1em">
                        {this.props.campaign.owner && (
                            <FormControlLabel
                                control={
                                    <IconButton onClick={() => this.setState({ editCampaignOpen: true })}>
                                        <Edit />
                                    </IconButton>
                                }
                                label="Edit campaign"
                            />
                        )}
                    </Box>
                    {characters.length === 0 ? (
                        <Typography variant="body1">This campaign does not have any characters yet.</Typography>
                    ) : (
                        <Paper>
                            <List>{characters.map(this.renderCharacter)}</List>
                        </Paper>
                    )}
                    {this.props.campaign.inviteCode && (
                        <Box marginTop="1em">
                            <Typography variant="caption">Invite code: {this.props.campaign.inviteCode}</Typography>
                        </Box>
                    )}
                    {this.props.campaign.owner && (
                        <Fab className="CampaignDetail__createFab" color="primary" onClick={this.openCreate}>
                            <Add />
                        </Fab>
                    )}

                    <Modal open={this.state.createOpen} onClose={this.closeCreate}>
                        <div className="modal">{this.renderCreateCharacter()}</div>
                    </Modal>
                    <Modal open={this.state.editCampaignOpen} onClose={this.closeEditCampaign}>
                        <div className="modal">{this.renderEditCampaign()}</div>
                    </Modal>
                </div>
            );
        }
        return (
            <div className={'CampaignDetail__container'}>
                <Header />
                {contents}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    campaign: state.campaign.campaign,
    characters: state.campaign.characters,
    loading: state.campaign.campaignLoading || state.campaign.charactersLoading
});

export const CampaignDetailScreen = connect(mapStateToProps, {
    fetchCampaign: campaignActions.actions.fetchCampaign,
    fetchCharacters: campaignActions.actions.fetchCharacters,
    deleteCampaign: campaignActions.actions.deleteCampaign
})(CampaignDetailRaw);
