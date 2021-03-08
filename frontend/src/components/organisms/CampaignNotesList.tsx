import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { campaignActions } from '../../store/actions';
import { campaignAllNotesLoadingSelector, RootState } from '../../store/reducers';
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

    if (loading || props.campaignId !== campaign?.id) {
        return <></>;
    }
    return (
        <Notes
            notes={notes}
            sharedNotes={sharedNotes}
            onCreate={console.log}
            onEdit={console.log}
            onDelete={console.log}
        />
    );
};
