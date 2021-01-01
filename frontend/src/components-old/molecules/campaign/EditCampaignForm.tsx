import { Paper, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';

import { campaignActions } from '../../../store/actions';
import { CampaignEditPayload } from '../../../types/campaign.types';
import { DeleteButton } from '../../atoms/ConfirmableButton';

interface Props {
    id: string;
    name: string;
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
}

class EditCampaignFormRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            name: props.name
        };
    }

    handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: event.target.value });
    };

    handleSubmit = () => {
        this.props.editCampaign({
            id: this.props.id,
            name: this.state.name
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

    render() {
        return (
            <Paper className="modalPaper">
                <div className="modalContainer">
                    <div className="modalHeader">
                        <Typography variant="h5">Update campaign</Typography>
                        <DeleteButton onConfirm={this.handleDelete} />
                    </div>
                    <TextField label="Name" value={this.state.name} onChange={this.handleChangeName} margin="normal" />
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
