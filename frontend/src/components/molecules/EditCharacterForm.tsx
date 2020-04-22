import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';

import { characterActions } from '../../store/actions';
import { Paper, Typography } from '@material-ui/core';
import { DeleteButton } from '../atoms/DeleteButton';

interface Props {
    characterId: string;
    initialName: string;
    initialDescription: string;
    onSubmitComplete?: () => void;
}

interface MapProps {
    editCharacter: (payload: { characterId: string; name: string; description: string }) => void;
    deleteCharacter: (params: string) => void;
}

type AllProps = Props & MapProps;

interface State {
    name: string;
    description: string;
}

class EditCharacterFormRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { name: props.initialName, description: props.initialDescription };
    }

    handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: event.target.value });
    };

    handleChangeDescription = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ description: event.target.value });
    };

    handleSubmit = () => {
        this.props.editCharacter({
            characterId: this.props.characterId,
            name: this.state.name,
            description: this.state.description
        });
    };

    handleDelete = () => {
        this.props.deleteCharacter(this.props.characterId);
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    canSubmit = () => this.state.name && this.state.description;

    render() {
        return (
            <Paper className="modalPaper">
                <div className="modalContainer">
                    <div className="modalHeader">
                        <Typography variant="h5">Update character</Typography>
                        <DeleteButton onConfirm={this.handleDelete} />
                    </div>
                    <TextField label="Name" value={this.state.name} onChange={this.handleChangeName} margin="dense" />
                    <TextField
                        multiline
                        variant="outlined"
                        label="Description"
                        value={this.state.description}
                        onChange={this.handleChangeDescription}
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmit}
                        disabled={!this.canSubmit()}
                    >
                        Update
                    </Button>
                </div>
            </Paper>
        );
    }
}

export const EditCharacterForm = connect(null, {
    editCharacter: characterActions.actions.editCharacter,
    deleteCharacter: characterActions.actions.deleteCharacter
})(EditCharacterFormRaw);
