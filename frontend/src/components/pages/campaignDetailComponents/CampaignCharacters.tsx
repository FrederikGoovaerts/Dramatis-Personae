import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Fab,
    FormControl,
    InputLabel,
    List,
    ListItemText,
    MenuItem,
    Modal,
    Paper,
    Select,
    TextField,
    Typography
} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import * as React from 'react';
import { connect } from 'react-redux';
import { select } from 'redux-saga/effects';

import { routes } from '../../../config/constants';
import { campaignActions } from '../../../store/actions';
import { RootState } from '../../../store/reducers';
import { ListCharacter } from '../../../types/character.types';
import { Label, ListLabel } from '../../../types/label.types';
import { ListItemLink } from '../../atoms/ListItemLink';
import { CreateCharacterForm } from '../../molecules/character/CreateCharacterForm';

interface Props {
    campaignId: string;
    owner: boolean;
    canManage: boolean;
    matchUrl: string;
}

interface MapProps {
    characters: ListCharacter[];
    labels: Label[];
    loading: boolean;
    fetchCharacters: (campaignId: string) => void;
    fetchLabels: (campaignId: string) => void;
}

type AllProps = Props & MapProps;

interface State {
    filterName: string;
    filterLabelIds: string[];
    createOpen: boolean;
}

class CampaignCharactersRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            createOpen: false,
            filterName: '',
            filterLabelIds: []
        };
    }

    componentDidMount() {
        this.props.fetchCharacters(this.props.campaignId);
        this.props.fetchLabels(this.props.campaignId);
    }

    labelIdsToJoinedString = (labelIds: string[]): string =>
        labelIds
            .map((selected) => this.props.labels.find((label) => label.id === selected))
            .map((label) => label?.name)
            .join(', ');

    openCreate = (): void => {
        this.setState({ createOpen: true });
    };

    closeCreate = (): void => {
        this.setState({ createOpen: false });
    };

    clearFilters = () => {
        this.setState({ filterLabelIds: [], filterName: '' });
    };

    handleChangeNameFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ filterName: event.target.value });
    };

    handleChangeLabelFilter = (event: React.ChangeEvent<{ value: string[] }>) => {
        this.setState({ filterLabelIds: event.target.value });
    };

    filteredCharacters = () => {
        const { filterName: filterString, filterLabelIds } = this.state;
        let filteredCharacters = [...this.props.characters];
        if (filterString !== '') {
            filteredCharacters = filteredCharacters.filter((character) =>
                character.name.toLowerCase().includes(filterString.toLowerCase())
            );
        }
        if (filterLabelIds.length > 0) {
            filteredCharacters = filteredCharacters.filter((character) => {
                const charLabelIds = character.labels.map((label) => label.id);
                return filterLabelIds.every((label) => charLabelIds.includes(label));
            });
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
                    <Select
                        disabled={this.props.labels.length === 0}
                        value={this.state.filterLabelIds}
                        onChange={this.handleChangeLabelFilter}
                        renderValue={this.labelIdsToJoinedString}
                        multiple
                    >
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
                    disabled={!this.state.filterName && this.state.filterLabelIds.length === 0}
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
                <CreateCharacterForm
                    campaignId={this.props.campaignId}
                    onSubmitComplete={this.closeCreate}
                    owner={this.props.owner}
                />
            </div>
        </Paper>
    );

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

    render() {
        const filteredCharacters = this.filteredCharacters();
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
                {this.props.canManage && (
                    <Fab className="CampaignDetail__createFab" color="primary" onClick={this.openCreate}>
                        <Add />
                    </Fab>
                )}
                <Modal open={this.state.createOpen} onClose={this.closeCreate}>
                    <div className="modal">{this.renderCreateCharacter()}</div>
                </Modal>
            </Box>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    characters: state.campaign.characters,
    labels: state.campaign.labels,
    loading: state.campaign.charactersLoading || state.campaign.labelsLoading
});

export const CampaignCharacters = connect(mapStateToProps, {
    fetchCharacters: campaignActions.actions.fetchCharacters,
    fetchLabels: campaignActions.actions.fetchLabels
})(CampaignCharactersRaw);
