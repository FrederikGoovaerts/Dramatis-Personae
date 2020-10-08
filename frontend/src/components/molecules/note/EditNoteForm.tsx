import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { ChangeEvent } from 'react';

import { Note, NoteVisibility } from '../../../types/note.types';
import { AlertBox } from '../../atoms/AlertBox';
import { DeleteButton } from '../../atoms/ConfirmableButton';

interface Props {
    note: Note;
    className?: string;
    deletable: boolean;
    onSubmitComplete?: () => void;
    editNote: (contents: string, visibility: NoteVisibility) => void;
    deleteNote: () => void;
}

interface State {
    contents: string;
    visibility: NoteVisibility;
}

export class EditNoteForm extends React.Component<Props, State> {
    constructor(props: Props) {
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
        this.props.editNote(this.state.contents, this.state.visibility);
        this.setState({ contents: '', visibility: 'PRIVATE' });
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    handleDelete = () => {
        this.props.deleteNote();
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
                        {this.props.deletable && <DeleteButton onConfirm={this.handleDelete} />}
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
