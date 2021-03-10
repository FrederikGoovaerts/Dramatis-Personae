import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { characterActions, noteActions } from '../../store/actions';
import { characterAllNotesLoadingSelector, RootState } from '../../store/reducers';
import { NoteVisibility } from '../../types/note.types';
import { Notes } from './Notes';

interface Props {
    characterId: string;
}

export const CharacterNotesList = (props: Props) => {
    const dispatch = useDispatch();
    const loading = useSelector(characterAllNotesLoadingSelector);
    const notes = useSelector((state: RootState) => state.character.notes);
    const sharedNotes = useSelector((state: RootState) => state.character.sharedNotes);

    useEffect(() => {
        dispatch(characterActions.actions.fetchNotes(props.characterId));
        dispatch(characterActions.actions.fetchSharedNotes(props.characterId));
    }, [dispatch, props.characterId]);

    const create = (contents: string, visibility: NoteVisibility) => {
        dispatch(characterActions.actions.createNote({ id: props.characterId, contents, visibility }));
    };

    const edit = (id: string, contents: string, visibility: NoteVisibility) => {
        dispatch(noteActions.actions.editCharacterNote({ id: props.characterId, noteId: id, contents, visibility }));
    };

    const del = (id: string) => {
        dispatch(noteActions.actions.deleteCharacterNote({ id: props.characterId, noteId: id }));
    };

    if (loading) {
        return <></>;
    }
    return <Notes notes={notes} sharedNotes={sharedNotes} onCreate={create} onEdit={edit} onDelete={del} />;
};
