import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import { Paper, Typography, FormControlLabel, Checkbox, Box } from '@material-ui/core';

import { DeleteButton } from '../atoms/DeleteButton';
import { Label } from '../../types/label.types';
import { AlertBox } from '../atoms/AlertBox';

interface Props {
    label: Label;
    className?: string;
    owner: boolean;
    labelOverlaps: (name: string, visible: boolean, id: string) => boolean;
    onSubmitComplete?: () => void;
    editLabel: (name: string, visible: boolean) => void;
    deleteLabel: () => void;
}

interface State {
    name: string;
    visible: boolean;
}

export class EditLabelForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { name: this.props.label.name, visible: this.props.label.visible };
    }

    handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: event.target.value });
    };

    handleChangeVisible = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        this.setState({ visible: checked });
    };

    handleSubmit = () => {
        this.props.editLabel(this.state.name, this.state.visible);
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    handleDelete = () => {
        this.props.deleteLabel();
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    render() {
        const overlap = this.props.labelOverlaps(this.state.name, this.state.visible, this.props.label.id);
        return (
            <Paper className="modalPaper">
                <div className="modalContainer">
                    <div className="modalHeader">
                        <Typography variant="h5">Update label</Typography>
                        <DeleteButton onConfirm={this.handleDelete} />
                    </div>
                    <TextField
                        variant="outlined"
                        label="Name"
                        helperText="The name of the label, which will be shown when applied to characters."
                        value={this.state.name}
                        onChange={this.handleChangeName}
                        margin="normal"
                    />
                    {this.props.owner && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.visible}
                                    onChange={this.handleChangeVisible}
                                    color="primary"
                                />
                            }
                            label="Visible"
                        />
                    )}
                    {overlap && (
                        <Box marginY="0.5em">
                            <AlertBox text="This label overlaps with an existing label." />
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmit}
                        disabled={!this.state.name || overlap}
                    >
                        Update
                    </Button>
                </div>
            </Paper>
        );
    }
}
