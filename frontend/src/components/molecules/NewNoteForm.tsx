import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';

import { characterActions } from '../../store/actions';
import { Paper, Typography } from '@material-ui/core';

interface Props {
    characterId: string;
    className?: string;
    onSubmitComplete?: () => void;
}

interface MapProps {
    createNote: (params: { characterId: string; contents: string }) => void;
}

type AllProps = Props & MapProps;

interface State {
    note: string;
}

class NewNoteFormRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { note: '' };
    }

    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ note: event.target.value });
    };

    handleSubmit = () => {
        this.props.createNote({
            characterId: this.props.characterId,
            contents: this.state.note
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
                        onChange={this.handleChange}
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={this.handleSubmit} disabled={!this.state.note}>
                        Create
                    </Button>
                </div>
            </Paper>
        );
    }
}

export const NewNoteForm = connect(null, { createNote: characterActions.actions.createNote })(NewNoteFormRaw);
