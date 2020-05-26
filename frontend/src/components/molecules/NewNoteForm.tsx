import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';

import { characterActions } from '../../store/actions';
import { Paper, Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { NoteVisibility } from '../../types/note.types';

interface Props {
    characterId: string;
    className?: string;
    onSubmitComplete?: () => void;
}

interface MapProps {
    createNote: (params: { id: string; contents: string; visibility: NoteVisibility }) => void;
}

type AllProps = Props & MapProps;

interface State {
    note: string;
    visibility: NoteVisibility;
}

class NewNoteFormRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { note: '', visibility: 'PRIVATE' };
    }

    handleChangeContent = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ note: event.target.value });
    };

    handleChangeVisibililty = (event: ChangeEvent<HTMLSelectElement>) => {
        this.setState({ visibility: event.target.value as NoteVisibility });
    };

    handleSubmit = () => {
        this.props.createNote({
            id: this.props.characterId,
            contents: this.state.note,
            visibility: this.state.visibility
        });
        this.setState({ note: '' });
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    render() {
        return (
            <Paper className="modalPaper">
                <div className="modalContainer">
                    <Typography variant="h5">New note</Typography>
                    <TextField
                        multiline
                        rows={5}
                        variant="outlined"
                        label="Note"
                        helperText="A note on the character, containing your thoughts on, experiences with, or suspicions about the character."
                        value={this.state.note}
                        onChange={this.handleChangeContent}
                        margin="normal"
                    />
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
                    <Button variant="contained" color="primary" onClick={this.handleSubmit} disabled={!this.state.note}>
                        Create
                    </Button>
                </div>
            </Paper>
        );
    }
}

export const NewNoteForm = connect(null, { createNote: characterActions.actions.createNote })(NewNoteFormRaw);
