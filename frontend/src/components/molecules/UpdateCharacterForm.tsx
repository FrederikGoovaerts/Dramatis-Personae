import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';

import { characterActions } from '../../store/actions';
import { CharacterUpdatePayload } from '../../types';

interface Props {
    characterId: number;
    className?: string;
    initialName: string;
    initialDescription: string;
}

interface MapProps {
    updateCharacter: (payload: CharacterUpdatePayload) => void;
}

type AllProps = Props & MapProps;

interface State {
    name: string;
    description: string;
}

class UpdateCharacterFormRaw extends React.Component<AllProps, State> {
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
        this.props.updateCharacter({
            characterId: this.props.characterId,
            update: {
                name: this.state.name || this.props.initialName,
                description: this.state.description,
            },
        });
    };

    isDirty = () =>
        this.state.name !== this.props.initialName || this.state.description !== this.props.initialDescription;

    render() {
        return (
            <div className={this.props.className}>
                <TextField label="Name" value={this.state.name} onChange={this.handleChangeName} margin="dense" />
                <TextField
                    multiline
                    variant="outlined"
                    label="Description"
                    value={this.state.description}
                    onChange={this.handleChangeDescription}
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={this.handleSubmit} disabled={!this.isDirty()}>
          Update
                </Button>
            </div>
        );
    }
}

export const UpdateCharacterForm = connect(
    null,
    { updateCharacter: characterActions.actions.updateCharacter },
)(UpdateCharacterFormRaw);
