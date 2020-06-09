import * as React from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    Fab,
    Modal,
    ListItemText,
    ListItem,
    IconButton,
    CircularProgress,
    Chip
} from '@material-ui/core';
import { Add, Visibility, Edit, CheckCircle, Cancel } from '@material-ui/icons';
import { ListCharacter, ProposedCharacter } from '../../../types/character.types';
import { ListItemLink } from '../../atoms/ListItemLink';
import { routes } from '../../../config/constants';
import { CreateCharacterForm } from '../../molecules/CreateCharacterForm';
import { ProposeCharacterForm } from '../../molecules/ProposeCharacterForm';
import { EditProposedCharacterForm } from '../../molecules/EditProposedCharacterForm';
import { RootState } from '../../../store/reducers';
import { campaignActions, proposedCharacterActions } from '../../../store/actions';
import { connect } from 'react-redux';

interface Props {
    campaignId: string;
    owner: boolean;
    matchUrl: string;
}

interface MapProps {
    characters: ListCharacter[];
    proposedCharacters: ProposedCharacter[];
    loading: boolean;
    fetchCharacters: (campaignId: string) => void;
    fetchProposedCharacters: (campaignId: string) => void;
    acceptProposedCharacter: (p: { campaignId: string; characterId: string }) => void;
    deleteProposedCharacter: (p: { campaignId: string; characterId: string }) => void;
}

type AllProps = Props & MapProps;

interface State {
    createOpen: boolean;
    proposeOpen: boolean;
    editProposedCharacter: ProposedCharacter | undefined;
}

class CampaignCharactersRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            createOpen: false,
            proposeOpen: false,
            editProposedCharacter: undefined
        };
    }

    componentDidMount() {
        this.props.fetchCharacters(this.props.campaignId);
        this.props.fetchProposedCharacters(this.props.campaignId);
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

    closeModals = (): void => {
        this.setState({
            createOpen: false,
            proposeOpen: false,
            editProposedCharacter: undefined
        });
    };

    renderCreateCharacter = () => (
        <Paper className="modalPaper">
            <div className="modalContainer">
                <Typography variant="h5">New character</Typography>
                <CreateCharacterForm campaignId={this.props.campaignId} onSubmitComplete={this.closeModals} />
            </div>
        </Paper>
    );

    renderProposeCharacter = () => (
        <Paper className="CampaignDetail__createPaper">
            <Typography variant="h5">Propose character</Typography>
            <ProposeCharacterForm campaignId={this.props.campaignId} onSubmitComplete={this.closeModals} />
        </Paper>
    );

    renderEditProposedCharacter = () => {
        if (!this.state.editProposedCharacter) {
            return undefined;
        }
        const character = this.state.editProposedCharacter;
        return (
            <EditProposedCharacterForm
                campaignId={this.props.campaignId}
                characterId={character.id}
                initialName={character.name}
                initialDescription={character.description}
                onSubmitComplete={this.closeModals}
            />
        );
    };

    renderCharacter = (character: ListCharacter) => (
        <ListItemLink to={`${this.props.matchUrl}${routes.character}${character.id}`} key={character.id}>
            <ListItemText
                primary={
                    <Box display="flex" flexWrap="wrap" alignItems="center">
                        <Typography>{character.name}</Typography>
                        {character.labels.map((label: string) => (
                            <Box marginLeft="0.5em" key={label}>
                                <Chip color="primary" label={label} size="small" />
                            </Box>
                        ))}
                    </Box>
                }
                secondary={character.description}
            />
            {this.props.owner && <Visibility color={character.visible ? 'primary' : 'disabled'} />}
        </ListItemLink>
    );

    renderProposedCharacter = (character: ProposedCharacter) => {
        return (
            <ListItem key={character.id}>
                <ListItemText
                    primary={
                        character.name +
                        (this.props.owner
                            ? ` (Proposed ${character.proposedOn.fromNow()}
                      by ${character.proposedBy})`
                            : '')
                    }
                    secondary={character.description}
                />
                <IconButton onClick={() => this.openEditProposedCharacter(character)}>
                    <Edit />
                </IconButton>
                {this.props.owner && (
                    <IconButton
                        onClick={() =>
                            this.props.acceptProposedCharacter({
                                campaignId: this.props.campaignId,
                                characterId: character.id
                            })
                        }
                    >
                        <CheckCircle />
                    </IconButton>
                )}
                <IconButton
                    onClick={() =>
                        this.props.deleteProposedCharacter({
                            campaignId: this.props.campaignId,
                            characterId: character.id
                        })
                    }
                >
                    <Cancel />
                </IconButton>
            </ListItem>
        );
    };

    render() {
        const { characters, proposedCharacters, loading } = this.props;
        if (loading) {
            return <CircularProgress />;
        }
        return (
            <Box>
                <Box marginBottom="1em">
                    {characters.length === 0 ? (
                        <Typography variant="body1">This campaign does not have any characters yet.</Typography>
                    ) : (
                        <Paper elevation={3}>
                            <List>{characters.map(this.renderCharacter)}</List>
                        </Paper>
                    )}
                </Box>
                {proposedCharacters.length > 0 && (
                    <Box marginBottom="1em">
                        <Box marginBottom="1em">
                            <Typography variant="h5">Proposed characters</Typography>
                        </Box>
                        <Paper elevation={3}>
                            <List>{proposedCharacters.map(this.renderProposedCharacter)}</List>
                        </Paper>
                    </Box>
                )}
                <Fab
                    className="CampaignDetail__createFab"
                    color="primary"
                    onClick={this.props.owner ? this.openCreate : this.openPropose}
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
            </Box>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    characters: state.campaign.characters,
    proposedCharacters: state.campaign.proposedCharacters,
    loading: state.campaign.charactersLoading || state.campaign.proposedCharactersLoading
});

export const CampaignCharacters = connect(mapStateToProps, {
    fetchCharacters: campaignActions.actions.fetchCharacters,
    fetchProposedCharacters: campaignActions.actions.fetchProposedCharacters,
    acceptProposedCharacter: proposedCharacterActions.actions.acceptProposedCharacter,
    deleteProposedCharacter: proposedCharacterActions.actions.deleteProposedCharacter
})(CampaignCharactersRaw);
