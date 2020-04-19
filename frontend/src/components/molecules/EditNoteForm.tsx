import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';

import { noteActions } from '../../store/actions';

interface Props {
    characterId: string;
    noteId: string;
    noteContents: string;
    className?: string;
    onSubmitComplete?: () => void;
}

interface MapProps {
    editNote: (params: { characterId: string; noteId: string; contents: string }) => void;
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

    render() {
        return (
            <div className={this.props.className}>
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
        );
    }
}

export const EditNoteForm = connect(null, { editNote: noteActions.actions.editNote })(EditNoteFormRaw);
