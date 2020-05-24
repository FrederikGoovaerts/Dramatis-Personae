import './CampaignDetailScreen.scss';

import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { connect } from 'react-redux';
import { match, Redirect } from 'react-router';
import { Fab, Modal, FormControlLabel, IconButton, Box, Button, ListItem } from '@material-ui/core';
import { Add, Visibility, Edit, CheckCircle, Cancel } from '@material-ui/icons';

import { routes } from '../../config/constants';
import { campaignActions, proposedCharacterActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { ListCharacter, ProposedCharacter } from '../../types/character.types';
import { Campaign } from '../../types/campaign.types';
import { ListItemLink } from '../atoms/ListItemLink';
import { CampaignCharacterBreadcrumb } from '../molecules/CampaignCharacterBreadcrumbs';
import { Header } from '../molecules/Header';
import { EditCampaignForm } from '../molecules/EditCampaignForm';
import { ConfirmableButton } from '../atoms/DeleteButton';
import { CreateCharacterForm } from '../molecules/CreateCharacterForm';
import { ProposeCharacterForm } from '../molecules/ProposeCharacterForm';
import { EditProposedCharacterForm } from '../molecules/EditProposedCharacterForm';

export interface MatchParams {
    id: string;
}

interface Props {
    match: match<MatchParams>;
}

interface MapProps {
    campaign: Campaign | null;
    characters: ListCharacter[];
    proposedCharacters: ProposedCharacter[];
    loading: boolean;
    fetchCampaign: (campaignId: string) => void;
    fetchCharacters: (campaignId: string) => void;
    fetchProposedCharacters: (campaignId: string) => void;
    fetchMembers: (campaignId: string) => void;
    acceptProposedCharacter: (p: { campaignId: string; characterId: string }) => void;
    deleteProposedCharacter: (p: { campaignId: string; characterId: string }) => void;
    deleteCampaign: (id: string) => void;
    leaveCampaign: (id: string) => void;
    rotateInviteCode: (id: string) => void;
}

type AllProps = Props & MapProps;

interface State {
    createOpen: boolean;
    proposeOpen: boolean;
    editProposedCharacter: ProposedCharacter | undefined;
    editCampaignOpen: boolean;
    deleteCheck: boolean;
    inaccessible: boolean;
}

class CampaignDetailRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            createOpen: false,
            proposeOpen: false,
            editProposedCharacter: undefined,
            editCampaignOpen: false,
            deleteCheck: false,
            inaccessible: false
        };
    }

    componentDidMount(): void {
        this.props.fetchCampaign(this.props.match.params.id);
        this.props.fetchCharacters(this.props.match.params.id);
        this.props.fetchProposedCharacters(this.props.match.params.id);
        this.props.fetchMembers(this.props.match.params.id);
    }

    openCreate = (): void => {
        this.setState({ createOpen: true });
    };

    openPropose = (): void => {
        this.setState({ proposeOpen: true });
    };

    openEditProposedCharacter = (proposedCharacter: ProposedCharacter): void => {
        this.setState({ editProposedCharacter: proposedCharacter });
    };

    openEditCampaign = (): void => {
        this.setState({ editCampaignOpen: true });
    };

    closeModals = (): void => {
        this.setState({
            createOpen: false,
            proposeOpen: false,
            editProposedCharacter: undefined,
            editCampaignOpen: false
        });
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

    renderProposedCharacter = (character: ProposedCharacter) => {
        if (!this.props.campaign) {
            return <div></div>;
        }
        const campaign = this.props.campaign;
        return (
            <ListItem key={character.id}>
                <ListItemText
                    primary={
                        character.name +
                        (this.props.campaign?.owner
                            ? ` (Proposed ${character.proposedOn.fromNow()}
                      by ${character.proposedBy})`
                            : '')
                    }
                    secondary={character.description}
                />
                <IconButton onClick={() => this.openEditProposedCharacter(character)}>
                    <Edit />
                </IconButton>
                {this.props.campaign?.owner && (
                    <IconButton
                        onClick={() =>
                            this.props.acceptProposedCharacter({ campaignId: campaign.id, characterId: character.id })
                        }
                    >
                        <CheckCircle />
                    </IconButton>
                )}
                <IconButton
                    onClick={() =>
                        this.props.deleteProposedCharacter({ campaignId: campaign.id, characterId: character.id })
                    }
                >
                    <Cancel />
                </IconButton>
            </ListItem>
        );
    };

    renderCreateCharacter = () => (
        <Paper className="CampaignDetail__createPaper">
            <Typography variant="h5">New character</Typography>
            <CreateCharacterForm
                campaignId={this.props.match.params.id}
                className="CampaignDetail__createContainer"
                onSubmitComplete={this.closeModals}
            />
        </Paper>
    );

    renderProposeCharacter = () => (
        <Paper className="CampaignDetail__createPaper">
            <Typography variant="h5">Propose character</Typography>
            <ProposeCharacterForm
                campaignId={this.props.match.params.id}
                className="CampaignDetail__createContainer"
                onSubmitComplete={this.closeModals}
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
                name={this.props.campaign.name}
                settings={this.props.campaign.settings}
                onSubmitComplete={this.closeModals}
                onDelete={this.makeInaccessible}
            />
        );
    };

    renderEditProposedCharacter = () => {
        if (!this.state.editProposedCharacter) {
            return undefined;
        }
        const character = this.state.editProposedCharacter;
        return (
            <EditProposedCharacterForm
                campaignId={this.props.match.params.id}
                characterId={character.id}
                initialName={character.name}
                initialDescription={character.description}
                onSubmitComplete={this.closeModals}
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
            const { campaign, characters, proposedCharacters } = this.props;
            contents = (
                <div>
                    <CampaignCharacterBreadcrumb campaign={campaign} />
                    <Typography variant={'h4'}>{campaign.name}</Typography>
                    <Typography variant={'subtitle1'}>{`Run by ${
                        campaign.owner ? 'you' : campaign.ownerName
                    }`}</Typography>
                    <Box marginTop="1em" marginBottom="1em">
                        {campaign.owner && (
                            <FormControlLabel
                                control={
                                    <IconButton onClick={this.openEditCampaign}>
                                        <Edit />
                                    </IconButton>
                                }
                                label="Edit campaign"
                            />
                        )}
                    </Box>
                    <Box marginBottom="1em">
                        {characters.length === 0 ? (
                            <Typography variant="body1">This campaign does not have any characters yet.</Typography>
                        ) : (
                            <Paper>
                                <List>{characters.map(this.renderCharacter)}</List>
                            </Paper>
                        )}
                    </Box>
                    {proposedCharacters.length > 0 && (
                        <Box marginBottom="1em">
                            <Box marginBottom="1em">
                                <Typography variant="h5">Proposed characters</Typography>
                            </Box>
                            <Paper>
                                <List>{proposedCharacters.map(this.renderProposedCharacter)}</List>
                            </Paper>
                        </Box>
                    )}
                    {campaign.inviteCode && (
                        <Box>
                            <Typography variant="caption">Invite code: {campaign.inviteCode}</Typography>
                            <Box marginTop="0.5em">
                                <Button onClick={this.rotateInviteCode} variant="outlined" size="small">
                                    Reset Invite Code
                                </Button>
                            </Box>
                        </Box>
                    )}
                    {!campaign.owner && (
                        <Box>
                            <ConfirmableButton
                                onConfirm={this.leaveCampaign}
                                defaultText="Leave campaign"
                                confirmedText="Leaving..."
                            />
                        </Box>
                    )}
                    <Fab
                        className="CampaignDetail__createFab"
                        color="primary"
                        onClick={campaign.owner ? this.openCreate : this.openPropose}
                    >
                        <Add />
                    </Fab>

                    <Modal open={this.state.createOpen} onClose={this.closeModals}>
                        <div className="modal">{this.renderCreateCharacter()}</div>
                    </Modal>
                    <Modal open={this.state.proposeOpen} onClose={this.closeModals}>
                        <div className="modal">{this.renderProposeCharacter()}</div>
                    </Modal>
                    <Modal open={!!this.state.editProposedCharacter} onClose={this.closeModals}>
                        <div className="modal">{this.renderEditProposedCharacter()}</div>
                    </Modal>
                    <Modal open={this.state.editCampaignOpen} onClose={this.closeModals}>
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
    proposedCharacters: state.campaign.proposedCharacters,
    loading:
        state.campaign.campaignLoading || state.campaign.charactersLoading || state.campaign.proposedCharactersLoading
});

export const CampaignDetailScreen = connect(mapStateToProps, {
    fetchCampaign: campaignActions.actions.fetchCampaign,
    fetchCharacters: campaignActions.actions.fetchCharacters,
    fetchProposedCharacters: campaignActions.actions.fetchProposedCharacters,
    acceptProposedCharacter: proposedCharacterActions.actions.acceptProposedCharacter,
    deleteProposedCharacter: proposedCharacterActions.actions.deleteProposedCharacter,
    fetchMembers: campaignActions.actions.fetchMembers,
    deleteCampaign: campaignActions.actions.deleteCampaign,
    leaveCampaign: campaignActions.actions.leaveCampaign,
    rotateInviteCode: campaignActions.actions.rotateInviteCode
})(CampaignDetailRaw);
