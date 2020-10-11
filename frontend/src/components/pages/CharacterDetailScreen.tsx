import { Box, Button, Modal, Toolbar } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { match, Redirect } from 'react-router';

import { routes } from '../../config/constants';
import { campaignActions, characterActions, noteActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { NoteVisibility } from '../../types/note.types';
import { EditCharacterForm } from '../molecules/character/EditCharacterForm';
import { CharacterHeader } from '../molecules/header/CharacterHeader';
import { Notes } from '../molecules/note/Notes';
import { CharacterLabels } from './characterDetailComponents/CharacterLabels';

interface Props {
    match: match<{ campaignId: string; characterId: string }>;
}

export const CharacterDetailScreen = (props: Props) => {
    const { campaignId, characterId } = props.match.params;

    const dispatch = useDispatch();
    const character = useSelector((state: RootState) => state.character.character);
    const campaign = useSelector((state: RootState) => state.campaign.campaign);
    const campaignCharacters = useSelector((state: RootState) => state.campaign.characters);
    const otherCharacters = campaignCharacters.filter((c) => c.id !== characterId);
    const notes = useSelector((state: RootState) => state.character.notes);
    const sharedNotes = useSelector((state: RootState) => state.character.sharedNotes);
    const loading = useSelector(
        (state: RootState) =>
            state.character.loading &&
            state.campaign.loading &&
            state.character.notesLoading &&
            state.character.sharedNotesLoading
    );

    const [editCharacterOpen, setEditCharacterOpen] = useState(false);
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        dispatch(characterActions.actions.fetchCharacter(characterId));
        dispatch(campaignActions.actions.fetchCampaign(campaignId));
        dispatch(campaignActions.actions.fetchCharacters(campaignId));
        dispatch(characterActions.actions.fetchNotes(characterId));
        dispatch(characterActions.actions.fetchSharedNotes(characterId));
    }, [dispatch, characterId, campaignId]);

    if (deleted) {
        return <Redirect to={`${routes.campaign.path}${campaignId}`} />;
    }

    const closeEditCharacter = () => {
        setEditCharacterOpen(false);
    };

    const renderEditCharacter = () => {
        if (!character || !campaign) {
            return undefined;
        }
        const onDelete = () => setDeleted(true);
        return (
            <EditCharacterForm
                characterId={character.id}
                campaignId={campaign.id}
                initialName={character.name}
                initialDescription={character.description}
                initialVisibility={character.visible}
                owner={campaign.owner}
                onSubmitComplete={closeEditCharacter}
                onDelete={onDelete}
            />
        );
    };

    const wrapContent = (contents: React.ReactNode) => (
        <Box className="CharacterDetail__container">
            <CharacterHeader campaignId={campaignId} name={character?.name} />
            <Toolbar />
            {contents}
        </Box>
    );

    if (!character || !campaign || loading) {
        return wrapContent(<CircularProgress />);
    } else {
        return wrapContent(
            <Box>
                <Box marginY="1em">
                    {character.description.split('\n').map((el, index) => (
                        <Typography variant="subtitle1" key={index}>
                            {el}
                        </Typography>
                    ))}
                </Box>
                <CharacterLabels
                    character={character}
                    canChange={campaign.owner || campaign.settings.allowPlayerCharacterLabelManagement}
                    campaignId={campaign.id}
                />
                {(campaign.owner || campaign.settings.allowPlayerCharacterManagement) && (
                    <Box marginBottom="1em">
                        <Button size="small" variant="outlined" onClick={() => setEditCharacterOpen(true)}>
                            Edit character
                        </Button>
                    </Box>
                )}
                <Notes
                    campaignOwner={campaign.owner}
                    notes={notes}
                    sharedNotes={sharedNotes}
                    editNote={(noteId: string, contents: string, visibility: NoteVisibility) =>
                        dispatch(
                            noteActions.actions.editCharacterNote({
                                id: character.id,
                                noteId,
                                contents,
                                visibility
                            })
                        )
                    }
                    deleteNote={(noteId: string) =>
                        dispatch(noteActions.actions.deleteCharacterNote({ id: character.id, noteId }))
                    }
                    createNote={(contents: string, visibility: NoteVisibility) =>
                        dispatch(characterActions.actions.createNote({ id: character.id, contents, visibility }))
                    }
                />
                <Modal open={editCharacterOpen} onClose={closeEditCharacter}>
                    <div className="modal">{renderEditCharacter()}</div>
                </Modal>
            </Box>
        );
    }
};
