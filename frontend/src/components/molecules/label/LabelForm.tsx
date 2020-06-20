import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import { FormControlLabel, Checkbox, Box } from '@material-ui/core';

import { Label } from '../../../types/label.types';
import { AlertBox } from '../../atoms/AlertBox';

interface Props {
    label?: Label;
    owner: boolean;
    labelOverlaps: (name: string, visible: boolean) => boolean;
    submitLabel: string;
    submit: (name: string, visible: boolean) => void;
}

interface State {
    name: string;
    visible: boolean;
}

export class LabelForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            name: this.props.label?.name || '',
            visible: this.props.label ? this.props.label.visible : true
        };
    }

    handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: event.target.value });
    };

    handleChangeVisible = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        this.setState({ visible: checked });
    };

    handleSubmit = () => {
        this.props.submit(this.state.name, this.state.visible);
    };

    render() {
        const overlap = this.props.labelOverlaps(this.state.name, this.state.visible);
        return (
            <>
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
                    {this.props.submitLabel}
                </Button>
            </>
        );
    }
}
