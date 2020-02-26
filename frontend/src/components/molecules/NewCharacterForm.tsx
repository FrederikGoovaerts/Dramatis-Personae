import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';

import { characterActions } from '../../store/actions';
import { CharacterPrototype } from '../../types';

interface Props {
    campaignId: number;
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
            description: this.state.description,
            campaignId: this.props.campaignId
        });
        this.setState({ name: '', description: '' });
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

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
                <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                    Create
                </Button>
            </div>
        );
    }
}

export const NewCharacterForm = connect(null, { newCharacter: characterActions.actions.newCharacter })(
    NewCharacterFormRaw
);
