import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';

import { noteActions } from '../../store/actions';
import { DeleteButton } from '../atoms/DeleteButton';
import { Paper, Typography, FormControl, InputLabel, Select, MenuItem, Box } from '@material-ui/core';
import { Note, NoteVisibility } from '../../types/note.types';
import { AlertBox } from '../atoms/AlertBox';

interface Props {
    characterId: string;
    note: Note;
    className?: string;
    onSubmitComplete?: () => void;
}

interface MapProps {
    editNote: (params: { characterId: string; noteId: string; contents: string; visibility: NoteVisibility }) => void;
    deleteNote: (params: { characterId: string; noteId: string }) => void;
}

type AllProps = Props & MapProps;

interface State {
    contents: string;
    visibility: NoteVisibility;
}

class EditNoteFormRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { contents: this.props.note.contents, visibility: this.props.note.visibility };
    }

    handleChangeContent = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ contents: event.target.value });
    };

    handleChangeVisibililty = (event: ChangeEvent<HTMLSelectElement>) => {
        this.setState({ visibility: event.target.value as NoteVisibility });
    };

    handleSubmit = () => {
        this.props.editNote({
            characterId: this.props.characterId,
            noteId: this.props.note.id,
            contents: this.state.contents,
            visibility: this.state.visibility
        });
        this.setState({ contents: '', visibility: 'PRIVATE' });
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    handleDelete = () => {
        this.props.deleteNote({ characterId: this.props.characterId, noteId: this.props.note.id });
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    render() {
        return (
            <Paper className="modalPaper">
                <div className="modalContainer">
                    <div className="modalHeader">
                        <Typography variant="h5">Update note</Typography>
                        <DeleteButton onConfirm={this.handleDelete} />
                    </div>
                    <TextField
                        multiline
                        rows={5}
                        variant="outlined"
                        label="Note"
                        value={this.state.contents}
                        onChange={this.handleChangeContent}
                        margin="normal"
                    />
                    {this.props.note.owned && (
                        <FormControl variant="outlined" margin="normal">
                            <InputLabel>Visibility</InputLabel>
                            <Select
                                value={this.state.visibility}
                                onChange={this.handleChangeVisibililty}
                                label="Visibility"
                            >
                                <MenuItem value="PRIVATE">Private</MenuItem>
                                <MenuItem value="DM_SHARED">Shared with DM</MenuItem>
                                <MenuItem value="PUBLIC">Public</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                    {!this.props.note.owned && (
                        <Box marginBottom="0.5em">
                            <AlertBox text="When editing a shared note at the same time as a player, only one copy will be saved." />
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmit}
                        disabled={!this.state.contents}
                    >
                        Update
                    </Button>
                </div>
            </Paper>
        );
    }
}

export const EditNoteForm = connect(null, {
    editNote: noteActions.actions.editNote,
    deleteNote: noteActions.actions.deleteNote
})(EditNoteFormRaw);
