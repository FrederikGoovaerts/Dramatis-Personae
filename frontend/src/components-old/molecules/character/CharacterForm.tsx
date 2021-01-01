import { Checkbox, FormControlLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import * as React from 'react';

interface Props {
    owner: boolean;
    buttonLabel: string;
    initialName?: string;
    initialDescription?: string;
    initialVisibility?: boolean;
    onSubmit: (name: string, description: string, visible: boolean) => void;
}

interface State {
    name: string;
    description: string;
    visible: boolean;
}

export class CharacterForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            name: props.initialName || '',
            description: props.initialDescription || '',
            visible: props.initialVisibility === undefined ? !this.props.owner : props.initialVisibility
        };
    }

    handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: event.target.value });
    };

    handleChangeDescription = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ description: event.target.value });
    };

    handleToggleVisible = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ visible: event.target.checked });
    };

    handleSubmit = () => {
        this.props.onSubmit(this.state.name, this.state.description, this.state.visible);
        this.setState({ name: '', description: '' });
    };

    render() {
        return (
            <>
                <TextField
                    label="Name"
                    required
                    helperText="The name of the character."
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
                {this.props.owner && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                onChange={this.handleToggleVisible}
                                checked={this.state.visible}
                            />
                        }
                        label="Visible to players"
                    />
                )}
                <Button variant="contained" color="primary" onClick={this.handleSubmit} disabled={!this.state.name}>
                    {this.props.buttonLabel}
                </Button>
            </>
        );
    }
}
