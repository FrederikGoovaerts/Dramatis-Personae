import './CampaignDetailScreen.scss';

import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { connect } from 'react-redux';
import { match, Redirect } from 'react-router';
import { Fab, Modal, FormControlLabel, IconButton, Box, Button } from '@material-ui/core';
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
import { ConfirmableButton } from '../atoms/DeleteButton';

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
    fetchCampaign: (campaignId: string) => void;
    fetchCharacters: (campaignId: string) => void;
    fetchMembers: (campaignId: string) => void;
    deleteCampaign: (id: string) => void;
    leaveCampaign: (id: string) => void;
    rotateInviteCode: (id: string) => void;
}

type AllProps = Props & MapProps;

interface State {
    createOpen: boolean;
    editCampaignOpen: boolean;
    deleteCheck: boolean;
    inaccessible: boolean;
}

class CampaignDetailRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { createOpen: false, editCampaignOpen: false, deleteCheck: false, inaccessible: false };
    }

    componentDidMount(): void {
        this.props.fetchCampaign(this.props.match.params.id);
        this.props.fetchCharacters(this.props.match.params.id);
        this.props.fetchMembers(this.props.match.params.id);
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

    leaveCampaign = (): void => {
        if (this.props.campaign) {
            this.props.leaveCampaign(this.props.campaign.id);
            this.makeInaccessible();
        }
    };

    rotateInviteCode = (): void => {
        if (this.props.campaign) {
            this.props.rotateInviteCode(this.props.campaign.id);
        }
    };

    makeInaccessible = (): void => this.setState({ inaccessible: true });

    renderCharacter = (character: ListCharacter) => (
        <ListItemLink to={`${this.props.match.url}${routes.character}${character.id}`} key={character.id}>
            <ListItemText primary={character.name} secondary={`Added ${character.addedOn.fromNow()}`} />
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
        return (
            <EditCampaignForm
                id={this.props.match.params.id}
                name={this.props.campaign?.name}
                onSubmitComplete={this.closeEditCampaign}
                onDelete={this.makeInaccessible}
            />
        );
    };

    render() {
        if (this.state.inaccessible) {
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
                            <Box marginTop="0.5em">
                                <Button onClick={this.rotateInviteCode} variant="outlined" size="small">
                                    Reset Invite Code
                                </Button>
                            </Box>
                        </Box>
                    )}
                    {this.props.campaign.owner ? (
                        <Fab className="CampaignDetail__createFab" color="primary" onClick={this.openCreate}>
                            <Add />
                        </Fab>
                    ) : (
                        <Box marginTop="1em">
                            <ConfirmableButton
                                onConfirm={this.leaveCampaign}
                                defaultText="Leave campaign"
                                confirmedText="Leaving..."
                            />
                        </Box>
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
    fetchMembers: campaignActions.actions.fetchMembers,
    deleteCampaign: campaignActions.actions.deleteCampaign,
    leaveCampaign: campaignActions.actions.leaveCampaign,
    rotateInviteCode: campaignActions.actions.rotateInviteCode
})(CampaignDetailRaw);
