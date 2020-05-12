import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';
import { Paper, Typography, Box, IconButton } from '@material-ui/core';

import { campaignActions } from '../../store/actions';
import { DeleteButton } from '../atoms/DeleteButton';
import { RootState } from '../../store/reducers';
import { CampaignMember } from '../../types';
import { HighlightOff } from '@material-ui/icons';

interface Props {
    id: string;
    name: string;
    onSubmitComplete?: () => void;
    onDelete?: () => void;
}

interface MapProps {
    members: CampaignMember[];
    editCampaign: (payload: { id: string; name: string }) => void;
    deleteCampaign: (params: string) => void;
    kickFromCampaign: (params: { campaignId: string; userId: string }) => void;
}

type AllProps = Props & MapProps;

interface State {
    name: string;
}

class EditCampaignFormRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { name: props.name };
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

    handleKick = (member: CampaignMember) => {
        this.props.kickFromCampaign({ campaignId: this.props.id, userId: member.id });
    };

    renderMember = (member: CampaignMember) => {
        const kick = () => this.handleKick(member);
        return (
            <Box key={member.id} flexDirection="row" display="flex" alignItems="center">
                <IconButton onClick={kick} disabled={member.owner}>
                    <HighlightOff />
                </IconButton>
                <Typography>{member.name}</Typography>
            </Box>
        );
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
                    <Box marginTop="1em">
                        <Typography variant="h6">Campaign members</Typography>
                        {this.props.members.map(this.renderMember)}
                    </Box>
                </div>
            </Paper>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    members: state.campaign.members
});

export const EditCampaignForm = connect(mapStateToProps, {
    editCampaign: campaignActions.actions.editCampaign,
    deleteCampaign: campaignActions.actions.deleteCampaign,
    kickFromCampaign: campaignActions.actions.kickFromCampaign
})(EditCampaignFormRaw);
