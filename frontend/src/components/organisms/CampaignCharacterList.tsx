import { Box, Divider, Flex, Link, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { localStorageKeys } from '../../config/state';
import { campaignActions, characterActions } from '../../store/actions';
import { campaignCharacterListLoadingSelector, RootState } from '../../store/reducers';
import { CharacterLine } from '../molecules/CharacterLine';
import { CharacterCreateDrawer } from './CharacterCreateDrawer';
import { CharacterFilterDrawer } from './CharacterFilterDrawer';

interface Props {
    campaignId: string;
    owner: boolean;
}

interface PersistedFilters {
    filterName: string;
    filterLabelIds: string[];
    campaignId: string;
}

function getPersistedFilters(): PersistedFilters | undefined {
    const filterString = localStorage.getItem(localStorageKeys.characterFilters);
    if (!filterString) {
        return undefined;
    }
    const filters = JSON.parse(filterString);
    if (filters.filterName || filters.filterLabelIds) {
        return filters as PersistedFilters;
    }
}

function persistFilters(filters: { filterName: string; filterLabelIds: string[]; campaignId: string }): void {
    localStorage.setItem(localStorageKeys.characterFilters, JSON.stringify(filters));
}

export const CampaignCharacterList = (props: Props) => {
    const [filterName, setFilterName] = useState<string>('');
    const [filterLabelIds, setFilterLabelIds] = useState<string[]>([]);

    const dispatch = useDispatch();
    const loading = useSelector(campaignCharacterListLoadingSelector);
    const campaign = useSelector((state: RootState) => state.campaign.campaign);
    const characters = useSelector((state: RootState) => state.campaign.characters);
    const labels = useSelector((state: RootState) => state.campaign.labels);

    useEffect(() => {
        dispatch(campaignActions.actions.fetchCharacters(props.campaignId));
        dispatch(campaignActions.actions.fetchLabels(props.campaignId));
        const filters = getPersistedFilters();
        if (filters && filters.campaignId === props.campaignId) {
            setFilterName(filters.filterName);
            setFilterLabelIds(filters.filterLabelIds);
        }
    }, [dispatch, props.campaignId]);

    useEffect(() => {
        persistFilters({ filterName, filterLabelIds, campaignId: props.campaignId });
    }, [filterName, filterLabelIds, props.campaignId]);

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

    const clearFilters = () => {
        setFilterName('');
        setFilterLabelIds([]);
    };

    const create = (name: string, description: string) => {
        dispatch(
            campaignActions.actions.createCharacter({
                campaignId: props.campaignId,
                character: { name, description, visible: true }
            })
        );
    };

    const edit = (id: string, name: string, description: string) => {
        dispatch(
            characterActions.actions.editCharacter({
                campaignId: props.campaignId,
                edit: { characterId: id, name, description, visible: true }
            })
        );
    };

    const del = (id: string) => {
        dispatch(characterActions.actions.deleteCharacter({ id, campaignId: props.campaignId }));
    };

    const addLabel = (characterId: string, labelId: string) => {
        dispatch(characterActions.actions.addLabel({ campaignId: props.campaignId, characterId, labelId }));
    };

    const removeLabel = (characterId: string, labelId: string) => {
        dispatch(characterActions.actions.removeLabel({ campaignId: props.campaignId, characterId, labelId }));
    };

    if (loading || props.campaignId !== campaign?.id) {
        return <></>;
    }
    return (
        <Box>
            <Flex mb={3}>
                <Box>
                    <CharacterCreateDrawer onCreate={create} />
                </Box>
                <Box ml={3}>
                    <CharacterFilterDrawer
                        name={filterName}
                        labels={labels}
                        selectedLabelIds={filterLabelIds}
                        setName={setFilterName}
                        setSelectedLabelIds={setFilterLabelIds}
                        clear={clearFilters}
                    />
                </Box>
            </Flex>
            {(filterName !== '' || filterLabelIds.length > 0) && (
                <Box mb={3}>
                    There are active filters (
                    <Link onClick={clearFilters}>
                        <Text as="u">clear filters</Text>
                    </Link>
                    )
                </Box>
            )}
            <Divider mb={3} />

            {filteredCharacters.length === 0 ? (
                <Flex justify="center" pt={12}>
                    <Text fontSize="xl">No characters found.</Text>
                </Flex>
            ) : (
                filteredCharacters.map((c) => (
                    <CharacterLine
                        key={c.id}
                        character={c}
                        campaignId={props.campaignId}
                        onEdit={edit}
                        onDelete={del}
                        onAddLabel={addLabel}
                        onRemoveLabel={removeLabel}
                    />
                ))
            )}
        </Box>
    );
};
