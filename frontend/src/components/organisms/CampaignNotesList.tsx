import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { campaignActions, noteActions } from '../../store/actions';
import { campaignAllNotesLoadingSelector, RootState } from '../../store/reducers';
import { NoteVisibility } from '../../types/note.types';
import { Notes } from './Notes';

interface Props {
    campaignId: string;
    owner: boolean;
}

export const CampaignNotesList = (props: Props) => {
    const dispatch = useDispatch();
    const loading = useSelector(campaignAllNotesLoadingSelector);
    const campaign = useSelector((state: RootState) => state.campaign.campaign);
    const notes = useSelector((state: RootState) => state.campaign.notes);
    const sharedNotes = useSelector((state: RootState) => state.campaign.sharedNotes);

    useEffect(() => {
        dispatch(campaignActions.actions.fetchNotes(props.campaignId));
        dispatch(campaignActions.actions.fetchSharedNotes(props.campaignId));
    }, [dispatch, props.campaignId]);

    const create = (contents: string, visibility: NoteVisibility) => {
        dispatch(campaignActions.actions.createNote({ id: props.campaignId, contents, visibility }));
    };

    const edit = (id: string, contents: string, visibility: NoteVisibility) => {
        dispatch(noteActions.actions.editCampaignNote({ id: props.campaignId, noteId: id, contents, visibility }));
    };

    const del = (id: string) => {
        dispatch(noteActions.actions.deleteCampaignNote({ id: props.campaignId, noteId: id }));
    };

    if (loading || props.campaignId !== campaign?.id) {
        return <></>;
    }
    return <Notes notes={notes} sharedNotes={sharedNotes} onCreate={create} onEdit={edit} onDelete={del} />;
};
