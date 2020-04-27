import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';

import { noteActions } from '../../store/actions';
import { DeleteButton } from '../atoms/DeleteButton';
import { Paper, Typography } from '@material-ui/core';

interface Props {
    characterId: string;
    noteId: string;
    noteContents: string;
    className?: string;
    onSubmitComplete?: () => void;
}

interface MapProps {
    editNote: (params: { characterId: string; noteId: string; contents: string }) => void;
    deleteNote: (params: { characterId: string; noteId: string }) => void;
}

type AllProps = Props & MapProps;

interface State {
    note: string;
}

class EditNoteFormRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { note: this.props.noteContents };
    }

    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ note: event.target.value });
    };

    handleSubmit = () => {
        this.props.editNote({
            characterId: this.props.characterId,
            noteId: this.props.noteId,
            contents: this.state.note
        });
        this.setState({ note: '' });
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    handleDelete = () => {
        this.props.deleteNote({ characterId: this.props.characterId, noteId: this.props.noteId });
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
                        value={this.state.note}
                        onChange={this.handleChange}
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={this.handleSubmit} disabled={!this.state.note}>
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
