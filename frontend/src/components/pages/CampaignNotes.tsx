import * as React from 'react';
import { CircularProgress } from '@material-ui/core';
import { ProposedCharacter } from '../../types/character.types';
import { RootState } from '../../store/reducers';
import { campaignActions } from '../../store/actions';
import { connect } from 'react-redux';
import { Note, CreateNotePayload, NoteVisibility } from '../../types/note.types';
import { Notes } from '../molecules/Notes';

interface Props {
    campaignId: string;
    owner: boolean;
}

interface MapProps {
    notes: Note[];
    sharedNotes: Note[];
    loading: boolean;
    fetchNotes: (campaignId: string) => void;
    fetchSharedNotes: (campaignId: string) => void;
    createNote: (payload: CreateNotePayload) => void;
}

type AllProps = Props & MapProps;

interface State {
    createOpen: boolean;
    proposeOpen: boolean;
    editProposedCharacter: ProposedCharacter | undefined;
}

class CampaignNotesRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            createOpen: false,
            proposeOpen: false,
            editProposedCharacter: undefined
        };
    }

    componentDidMount() {
        this.props.fetchNotes(this.props.campaignId);
        this.props.fetchSharedNotes(this.props.campaignId);
    }

    render() {
        const { notes, sharedNotes, campaignId, owner, loading } = this.props;
        if (loading) {
            return <CircularProgress />;
        }
        return (
            <Notes
                notes={notes}
                sharedNotes={sharedNotes}
                campaignOwner={owner}
                createNote={(contents: string, visibility: NoteVisibility) =>
                    this.props.createNote({ id: campaignId, contents, visibility })
                }
                deleteNote={console.log}
                editNote={console.log}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    notes: state.campaign.notes,
    sharedNotes: state.campaign.sharedNotes,
    loading: state.campaign.notesLoading || state.campaign.sharedNotesLoading
});

export const CampaignNotes = connect(mapStateToProps, {
    fetchNotes: campaignActions.actions.fetchNotes,
    fetchSharedNotes: campaignActions.actions.fetchSharedNotes,
    createNote: campaignActions.actions.createNote
})(CampaignNotesRaw);
