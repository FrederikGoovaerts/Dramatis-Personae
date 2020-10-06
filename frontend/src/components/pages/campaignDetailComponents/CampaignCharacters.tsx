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
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { routes } from '../../../config/constants';
import { localStorageKeys } from '../../../config/state';
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

interface PersistedFilters {
    filterName: string;
    filterLabelIds: string[];
}

function getPersistedFilters(): PersistedFilters | undefined {
    const filterString = localStorage.getItem(localStorageKeys.characterFilters);
    if (!filterString) {
        return undefined;
    }
    const filters = JSON.parse(filterString);
    if (filters.filterName && filters.filterLabelIds) {
        return filters as PersistedFilters;
    }
}

function persistFilters(filters: { filterName: string; filterLableIds: string[] }): void {
    localStorage.setItem(localStorageKeys.characterFilters, JSON.stringify(filters));
}

export const CampaignCharacters = (props: Props) => {
    const [createOpen, setCreateOpen] = useState<boolean>(false);
    const [filterName, setFilterName] = useState<string>('');
    const [filterLabelIds, setFilterLabelIds] = useState<string[]>([]);

    const dispatch = useDispatch();
    const characters = useSelector((s: RootState) => s.campaign.characters);
    const labels = useSelector((s: RootState) => s.campaign.labels);
    const loading = useSelector((s: RootState) => s.campaign.charactersLoading || s.campaign.labelsLoading);

    useEffect(() => {
        dispatch(campaignActions.actions.fetchCharacters(props.campaignId));
        dispatch(campaignActions.actions.fetchLabels(props.campaignId));
    }, [dispatch, props.campaignId]);

    if (loading) {
        return <CircularProgress />;
    }

    let filteredCharacters = [...characters];
    if (filterName !== '') {
        filteredCharacters = filteredCharacters.filter((character) =>
            character.name.toLowerCase().includes(filterName.toLowerCase())
        );
    }
    if (filterLabelIds.length > 0) {
        filteredCharacters = filteredCharacters.filter((character) => {
            const charLabelIds = character.labels.map((label) => label.id);
            return filterLabelIds.every((label) => charLabelIds.includes(label));
        });
    }

    const labelIdsToJoinedString = (labelIds: string[]): string =>
        labelIds
            .map((selected) => labels.find((label) => label.id === selected))
            .map((label) => label?.name)
            .sort()
            .join(', ');

    const openCreate = (): void => {
        setCreateOpen(true);
    };

    const closeCreate = (): void => {
        setCreateOpen(false);
    };

    const clearFilters = () => {
        setFilterLabelIds([]);
        setFilterName('');
    };

    const handleChangeNameFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterName(event.target.value);
    };

    const handleChangeLabelFilter = (event: React.ChangeEvent<{ value: string[] }>) => {
        setFilterLabelIds(event.target.value);
    };

    const renderCharacterFilters = () => (
        <Box display="flex" flexWrap="wrap" alignItems="end" flexDirection="row">
            <Box minWidth="15em" display="flex" flexDirection="column" margin="0.5em">
                <TextField label="Character name filter" value={filterName} onChange={handleChangeNameFilter} />
            </Box>
            <Box minWidth="15em" display="flex" flexDirection="column" margin="0.5em">
                <FormControl>
                    <InputLabel>Character label filter</InputLabel>
                    <Select
                        disabled={labels.length === 0}
                        value={filterLabelIds}
                        onChange={handleChangeLabelFilter}
                        renderValue={labelIdsToJoinedString}
                        multiple
                    >
                        {labels.map((label: Label) => (
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
                <Button variant="outlined" disabled={!filterName && filterLabelIds.length === 0} onClick={clearFilters}>
                    Clear filters
                </Button>
            </Box>
        </Box>
    );

    const renderCreateCharacter = () => (
        <Paper className="modalPaper">
            <div className="modalContainer">
                <Typography variant="h5">New character</Typography>
                <CreateCharacterForm campaignId={props.campaignId} onSubmitComplete={closeCreate} owner={props.owner} />
            </div>
        </Paper>
    );

    const renderCharacter = (character: ListCharacter) => (
        <ListItemLink to={`${props.matchUrl}${routes.character}${character.id}`} key={character.id}>
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
            {props.owner && <Visibility color={character.visible ? 'primary' : 'disabled'} />}
        </ListItemLink>
    );

    return (
        <Box>
            {renderCharacterFilters()}
            <Box marginBottom="1em">
                {filteredCharacters.length === 0 ? (
                    <Typography variant="body1">No characters found.</Typography>
                ) : (
                    <Paper elevation={3}>
                        <List>{filteredCharacters.map(renderCharacter)}</List>
                    </Paper>
                )}
            </Box>
            {props.canManage && (
                <Fab className="CampaignDetail__createFab" color="primary" onClick={openCreate}>
                    <Add />
                </Fab>
            )}
            <Modal open={createOpen} onClose={closeCreate}>
                <div className="modal">{renderCreateCharacter()}</div>
            </Modal>
        </Box>
    );
};
