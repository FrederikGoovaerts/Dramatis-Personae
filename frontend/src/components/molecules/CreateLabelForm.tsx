import * as React from 'react';
import { ChangeEvent } from 'react';
import { connect } from 'react-redux';

import { campaignActions } from '../../store/actions';
import { Paper, Typography, TextField, Checkbox, FormControlLabel, Button, Box } from '@material-ui/core';
import { AlertBox } from '../atoms/AlertBox';

interface Props {
    owner: boolean;
    campaignId: string;
    labelOverlaps: (name: string, visible: boolean) => boolean;
    className?: string;
    onSubmitComplete?: () => void;
}

interface MapProps {
    createLabel: (params: { id: string; name: string; visible: boolean }) => void;
}

interface State {
    name: string;
    visible: boolean;
}

type AllProps = Props & MapProps;

class CreateLabelFormRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { name: '', visible: true };
    }

    handleSubmit = () => {
        const { name, visible } = this.state;
        this.props.createLabel({
            id: this.props.campaignId,
            name,
            visible
        });
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: event.target.value });
    };

    handleChangeVisible = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        this.setState({ visible: checked });
    };

    render() {
        const overlap = this.props.labelOverlaps(this.state.name, this.state.visible);
        return (
            <Paper className="modalPaper">
                <div className="modalContainer">
                    <Typography variant="h5">New label</Typography>
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
                        Create
                    </Button>
                </div>
            </Paper>
        );
    }
}

export const CreateLabelForm = connect(null, { createLabel: campaignActions.actions.createLabel })(CreateLabelFormRaw);
