import { Paper, Button, TextField, Typography, FormControlLabel, Checkbox } from '@material-ui/core';
import { ChangeEvent } from 'react';
import * as React from 'react';

import { DeleteButton } from '../atoms/DeleteButton';

interface Props {
    initialName: string;
    initialDescription: string;
    initialVisibility: boolean;
    owner: boolean;
    onSubmit: (name: string, description: string, visible: boolean) => void;
    onDelete?: () => void;
}

interface State {
    name: string;
    description: string;
    visible: boolean;
}

export class BaseEditCharacterForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            name: props.initialName,
            description: props.initialDescription,
            visible: props.initialVisibility
        };
    }

    handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: event.target.value });
    };

    handleToggleVisible = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ visible: event.target.checked });
    };

    handleChangeDescription = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ description: event.target.value });
    };

    handleSubmit = () => {
        this.props.onSubmit(this.state.name, this.state.description, this.state.visible);
    };

    handleDelete = () => {
        if (this.props.onDelete) {
            setTimeout(this.props.onDelete, 500);
        }
    };

    render() {
        return (
            <Paper className="modalPaper">
                <div className="modalContainer">
                    <div className="modalHeader">
                        <Typography variant="h5">Update character</Typography>
                        {this.props.onDelete && <DeleteButton onConfirm={this.handleDelete} />}
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
                        Update
                    </Button>
                </div>
            </Paper>
        );
    }
}
