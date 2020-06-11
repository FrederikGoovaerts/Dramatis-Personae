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
    Chip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    Button
} from '@material-ui/core';
import { Add, Visibility, Edit, CheckCircle, Cancel, VisibilityOff, Search } from '@material-ui/icons';
import { ListCharacter, ProposedCharacter } from '../../../types/character.types';
import { ListItemLink } from '../../atoms/ListItemLink';
import { routes } from '../../../config/constants';
import { CreateCharacterForm } from '../../molecules/CreateCharacterForm';
import { ProposeCharacterForm } from '../../molecules/ProposeCharacterForm';
import { EditProposedCharacterForm } from '../../molecules/EditProposedCharacterForm';
import { RootState } from '../../../store/reducers';
import { campaignActions, proposedCharacterActions } from '../../../store/actions';
import { connect } from 'react-redux';
import { ListLabel, Label } from '../../../types/label.types';

interface Props {
    campaignId: string;
    owner: boolean;
    matchUrl: string;
}

interface MapProps {
    characters: ListCharacter[];
    proposedCharacters: ProposedCharacter[];
    labels: Label[];
    loading: boolean;
    fetchCharacters: (campaignId: string) => void;
    fetchLabels: (campaignId: string) => void;
    fetchProposedCharacters: (campaignId: string) => void;
    acceptProposedCharacter: (p: { campaignId: string; characterId: string }) => void;
    deleteProposedCharacter: (p: { campaignId: string; characterId: string }) => void;
}

type AllProps = Props & MapProps;

interface State {
    filterName: string;
    filterLabelId: string;
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
            editProposedCharacter: undefined,
            filterName: '',
            filterLabelId: ''
        };
    }

    componentDidMount() {
        this.props.fetchCharacters(this.props.campaignId);
        this.props.fetchLabels(this.props.campaignId);
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

    clearFilters = () => {
        this.setState({ filterLabelId: '', filterName: '' });
    };

    handleChangeNameFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ filterName: event.target.value });
    };

    handleChangeLabelFilter = (event: React.ChangeEvent<{ value: string }>) => {
        this.setState({ filterLabelId: event.target.value });
    };

    filteredCharacters = () => {
        const { filterName: filterString, filterLabelId } = this.state;
        let filteredCharacters = [...this.props.characters];
        if (filterString !== '') {
            filteredCharacters = filteredCharacters.filter((character) =>
                character.name.toLowerCase().includes(filterString.toLowerCase())
            );
        }
        if (filterLabelId !== '') {
            filteredCharacters = filteredCharacters.filter((character) =>
                character.labels.find((label) => label.id === filterLabelId)
            );
        }
        return filteredCharacters;
    };

    filteredProposedCharacters = () => {
        const { filterName: filterString, filterLabelId } = this.state;
        if (filterLabelId !== '') {
            return [];
        }
        let filteredCharacters = [...this.props.proposedCharacters];
        if (filterString !== '') {
            filteredCharacters = filteredCharacters.filter((character) =>
                character.name.toLowerCase().includes(filterString.toLowerCase())
            );
        }
        return filteredCharacters;
    };

    renderCharacterFilters = () => (
        <Box display="flex" flexWrap="wrap" alignItems="end" flexDirection="row">
            <Box minWidth="15em" display="flex" flexDirection="column" margin="0.5em">
                <TextField
                    label="Character name filter"
                    value={this.state.filterName}
                    onChange={this.handleChangeNameFilter}
                />
            </Box>
            <Box minWidth="15em" display="flex" flexDirection="column" margin="0.5em">
                <FormControl>
                    <InputLabel>Character label filter</InputLabel>
                    <Select value={this.state.filterLabelId} onChange={this.handleChangeLabelFilter}>
                        <MenuItem value="">None</MenuItem>
                        {this.props.labels.map((label: Label) => (
                            <MenuItem key={label.id} value={label.id}>
                                <Box display="flex">
                                    {label.name}
                                    {!label.visible && (
                                        <Box marginLeft="0.5em" marginY="-0.5em" display="flex" alignItems="center">
                                            <VisibilityOff />
                                        </Box>
                                    )}
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box margin="0.5em">
                <Button
                    variant="outlined"
                    disabled={!(this.state.filterLabelId || this.state.filterName)}
                    onClick={this.clearFilters}
                >
                    Clear filters
                </Button>
            </Box>
        </Box>
    );

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
                        {character.labels.map((label: ListLabel) => (
                            <Box marginLeft="0.5em" key={label.name}>
                                <Chip
                                    color="primary"
                                    label={label.name}
                                    variant={label.visible ? 'default' : 'outlined'}
                                    size="small"
                                />
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
        const filteredCharacters = this.filteredCharacters();
        const filteredProposedCharacters = this.filteredProposedCharacters();
        if (this.props.loading) {
            return <CircularProgress />;
        }
        return (
            <Box>
                {this.renderCharacterFilters()}
                <Box marginBottom="1em">
                    {filteredCharacters.length === 0 ? (
                        <Typography variant="body1">No characters found.</Typography>
                    ) : (
                        <Paper elevation={3}>
                            <List>{filteredCharacters.map(this.renderCharacter)}</List>
                        </Paper>
                    )}
                </Box>
                {filteredProposedCharacters.length > 0 && (
                    <Box marginBottom="1em">
                        <Box marginBottom="1em">
                            <Typography variant="h5">Proposed characters</Typography>
                        </Box>
                        <Paper elevation={3}>
                            <List>{filteredProposedCharacters.map(this.renderProposedCharacter)}</List>
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
    labels: state.campaign.labels,
    proposedCharacters: state.campaign.proposedCharacters,
    loading:
        state.campaign.charactersLoading || state.campaign.proposedCharactersLoading || state.campaign.labelsLoading
});

export const CampaignCharacters = connect(mapStateToProps, {
    fetchCharacters: campaignActions.actions.fetchCharacters,
    fetchProposedCharacters: campaignActions.actions.fetchProposedCharacters,
    fetchLabels: campaignActions.actions.fetchLabels,
    acceptProposedCharacter: proposedCharacterActions.actions.acceptProposedCharacter,
    deleteProposedCharacter: proposedCharacterActions.actions.deleteProposedCharacter
})(CampaignCharactersRaw);
