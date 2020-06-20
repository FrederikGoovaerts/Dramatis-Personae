import { Box, Checkbox, FormControlLabel, Paper, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';

import { campaignActions } from '../../../store/actions';
import { CampaignEditPayload, CampaignSettings } from '../../../types/campaign.types';
import { DeleteButton } from '../../atoms/DeleteButton';

interface Props {
    id: string;
    name: string;
    settings: CampaignSettings;
    onSubmitComplete?: () => void;
    onDelete?: () => void;
}

interface MapProps {
    editCampaign: (payload: CampaignEditPayload) => void;
    deleteCampaign: (params: string) => void;
}

type AllProps = Props & MapProps;

interface State {
    name: string;
    allowPlayerCharacterManagement: boolean;
    allowPlayerLabelManagement: boolean;
    allowPlayerCharacterLabelManagement: boolean;
}

class EditCampaignFormRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            name: props.name,
            allowPlayerCharacterManagement: props.settings.allowPlayerCharacterManagement,
            allowPlayerLabelManagement: props.settings.allowPlayerLabelManagement,
            allowPlayerCharacterLabelManagement: props.settings.allowPlayerCharacterLabelManagement
        };
    }

    handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: event.target.value });
    };

    handleSubmit = () => {
        const {
            allowPlayerCharacterManagement,
            allowPlayerLabelManagement,
            allowPlayerCharacterLabelManagement
        } = this.state;
        this.props.editCampaign({
            id: this.props.id,
            name: this.state.name,
            campaignSettings: {
                allowPlayerCharacterManagement,
                allowPlayerLabelManagement,
                allowPlayerCharacterLabelManagement
            }
        });
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    handleDelete = () => {
        this.props.deleteCampaign(this.props.id);
        if (this.props.onDelete) {
            setTimeout(this.props.onDelete, 500);
        }
    };

    handleChangeAllowPlayerCharacterManagement = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ allowPlayerCharacterManagement: event.target.checked });
    };

    handleChangeAllowPlayerLabelManagement = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ allowPlayerLabelManagement: event.target.checked });
    };

    handleChangeAllowPlayerCharacterLabelManagement = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ allowPlayerCharacterLabelManagement: event.target.checked });
    };

    render() {
        return (
            <Paper className="modalPaper">
                <div className="modalContainer">
                    <div className="modalHeader">
                        <Typography variant="h5">Update campaign</Typography>
                        <DeleteButton onConfirm={this.handleDelete} />
                    </div>
                    <TextField label="Name" value={this.state.name} onChange={this.handleChangeName} margin="normal" />
                    <Box marginY="1em">
                        <Typography variant="h6">Campaign settings</Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.allowPlayerCharacterManagement}
                                    onChange={this.handleChangeAllowPlayerCharacterManagement}
                                    name="allowPlayerCharacterManagement"
                                    color="primary"
                                />
                            }
                            label="Allow players to manage characters"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.allowPlayerLabelManagement}
                                    onChange={this.handleChangeAllowPlayerLabelManagement}
                                    name="allowPlayerLabelManagement"
                                    color="primary"
                                />
                            }
                            label="Allow players to manage campaign labels"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.allowPlayerCharacterLabelManagement}
                                    onChange={this.handleChangeAllowPlayerCharacterLabelManagement}
                                    name="allowPlayerCharacterLabelManagement"
                                    color="primary"
                                />
                            }
                            label="Allow players to apply and remove labels on characters"
                        />
                    </Box>
                    <Button variant="contained" color="primary" onClick={this.handleSubmit} disabled={!this.state.name}>
                        Update
                    </Button>
                </div>
            </Paper>
        );
    }
}

export const EditCampaignForm = connect(null, {
    editCampaign: campaignActions.actions.editCampaign,
    deleteCampaign: campaignActions.actions.deleteCampaign
})(EditCampaignFormRaw);
