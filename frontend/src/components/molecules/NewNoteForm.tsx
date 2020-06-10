import * as React from 'react';
import { ChangeEvent } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { Paper, Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { NoteVisibility } from '../../types/note.types';

interface Props {
    className?: string;
    create: (contents: string, visibility: NoteVisibility) => void;
    onSubmitComplete?: () => void;
}

interface State {
    note: string;
    visibility: NoteVisibility;
}

export class NewNoteForm extends React.Component<Props, State> {
    constructor(props: Props) {
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
        this.props.create(this.state.note, this.state.visibility);
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
