import * as React from 'react';
import { Box, Typography, FormControlLabel, IconButton, Button, Modal } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { ConfirmableButton } from '../atoms/DeleteButton';
import { EditCampaignForm } from '../molecules/EditCampaignForm';
import { Campaign } from '../../types/campaign.types';
import { campaignActions } from '../../store/actions';
import { connect } from 'react-redux';

interface Props {
    campaign: Campaign;
    inviteCode: string;
    onInaccessible: () => void;
}

interface MapProps {
    deleteCampaign: (id: string) => void;
    leaveCampaign: (id: string) => void;
    rotateInviteCode: (id: string) => void;
    fetchMembers: (campaignId: string) => void;
}

type AllProps = Props & MapProps;

interface State {
    editOpen: boolean;
}

class CampaignDetailsRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { editOpen: false };
    }

    componentDidMount(): void {
        this.props.fetchMembers(this.props.campaign.id);
    }

    openEditCampaign = (): void => {
        this.setState({ editOpen: true });
    };

    closeEdit = (): void => {
        this.setState({ editOpen: false });
    };

    leaveCampaign = (): void => {
        if (this.props.campaign) {
            this.props.leaveCampaign(this.props.campaign.id);
            this.props.onInaccessible();
        }
    };

    rotateInviteCode = (): void => {
        if (this.props.campaign) {
            this.props.rotateInviteCode(this.props.campaign.id);
        }
    };

    renderEditCampaign = () => {
        if (!this.props.campaign) {
            return <div />;
        }
        return (
            <EditCampaignForm
                id={this.props.campaign.id}
                name={this.props.campaign.name}
                settings={this.props.campaign.settings}
                onSubmitComplete={this.closeEdit}
                onDelete={this.props.onInaccessible}
            />
        );
    };

    render() {
        const { inviteCode, campaign } = this.props;
        const { owner, ownerName } = campaign;
        return (
            <Box>
                <Typography variant={'subtitle1'}>{`Run by ${owner ? 'you' : ownerName}`}</Typography>
                <Box marginTop="1em" marginBottom="1em">
                    {owner && (
                        <FormControlLabel
                            control={
                                <IconButton onClick={this.openEditCampaign}>
                                    <Edit />
                                </IconButton>
                            }
                            label="Edit campaign"
                        />
                    )}
                </Box>
                {inviteCode && (
                    <Box>
                        <Typography variant="caption">Invite code: {inviteCode}</Typography>
                        <Box marginTop="0.5em">
                            <Button onClick={this.rotateInviteCode} variant="outlined" size="small">
                                Reset Invite Code
                            </Button>
                        </Box>
                    </Box>
                )}
                {!owner && (
                    <Box>
                        <ConfirmableButton
                            onConfirm={this.leaveCampaign}
                            defaultText="Leave campaign"
                            confirmedText="Leaving..."
                        />
                    </Box>
                )}

                <Modal open={this.state.editOpen} onClose={this.closeEdit}>
                    <div className="modal">{this.renderEditCampaign()}</div>
                </Modal>
            </Box>
        );
    }
}

export const CampaignDetails = connect(null, {
    fetchMembers: campaignActions.actions.fetchMembers,
    deleteCampaign: campaignActions.actions.deleteCampaign,
    leaveCampaign: campaignActions.actions.leaveCampaign,
    rotateInviteCode: campaignActions.actions.rotateInviteCode
})(CampaignDetailsRaw);
