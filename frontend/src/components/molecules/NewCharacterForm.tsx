import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';

import { characterActions } from '../../store/actions';
import { CharacterPrototype } from '../../types';

interface Props {
    campaignId: string;
    className?: string;
    onSubmitComplete?: () => void;
}

interface MapProps {
    newCharacter: (prototype: CharacterPrototype) => void;
}

type AllProps = Props & MapProps;

interface State {
    name: string;
    description: string;
}

class NewCharacterFormRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { name: '', description: '' };
    }

    handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: event.target.value });
    };

    handleChangeDescription = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ description: event.target.value });
    };

    handleSubmit = () => {
        this.props.newCharacter({
            name: this.state.name,
            description: this.state.description
        });
        this.setState({ name: '', description: '' });
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    render() {
        return (
            <div className={this.props.className}>
                <TextField
                    label="Name"
                    required
                    helperText="The name of the new character."
                    value={this.state.name}
                    onChange={this.handleChangeName}
                    margin="dense"
                />
                <TextField
                    multiline
                    rows={3}
                    variant="outlined"
                    label="Description"
                    helperText="This should contain basic information other characters clearly see or know about the character."
                    value={this.state.description}
                    onChange={this.handleChangeDescription}
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={this.handleSubmit} disabled={!this.state.name}>
                    Create
                </Button>
            </div>
        );
    }
}

export const NewCharacterForm = connect(null, { newCharacter: characterActions.actions.newCharacter })(
    NewCharacterFormRaw
);
