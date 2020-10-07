import { Box, Button, CircularProgress, IconButton, Modal, Typography } from '@material-ui/core';
import HighlightOff from '@material-ui/icons/HighlightOff';
import Person from '@material-ui/icons/Person';
import * as React from 'react';
import { connect } from 'react-redux';

import { campaignActions } from '../../../store/actions';
import { RootState } from '../../../store/reducers';
import { Campaign, CampaignMember } from '../../../types/campaign.types';
import { ConfirmableButton } from '../../atoms/ConfirmableButton';
import { CampaignInviteInfo } from '../../molecules/campaign/CampaignInviteInfo';
import { EditCampaignForm } from '../../molecules/campaign/EditCampaignForm';

interface Props {
    campaign: Campaign;
    onInaccessible: () => void;
}

interface MapProps {
    members: CampaignMember[];
    membersLoading: boolean;
    fetchMembers: (campaignId: string) => void;
    deleteCampaign: (id: string) => void;
    leaveCampaign: (id: string) => void;
    kickFromCampaign: (params: { campaignId: string; userId: string }) => void;
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

    handleKick = (member: CampaignMember) => {
        this.props.kickFromCampaign({ campaignId: this.props.campaign.id, userId: member.id });
    };

    renderMember = (member: CampaignMember) => {
        const kick = () => this.handleKick(member);
        return (
            <Box key={member.id} flexDirection="row" display="flex" alignItems="center">
                {this.props.campaign.owner ? (
                    <IconButton onClick={kick} disabled={member.owner}>
                        <HighlightOff />
                    </IconButton>
                ) : (
                    <Box margin="0.5em">
                        <Person />
                    </Box>
                )}
                <Typography>{member.name}</Typography>
            </Box>
        );
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
        const { owner, ownerName, inviteCode, id } = this.props.campaign;
        return (
            <Box>
                <Typography gutterBottom variant={'subtitle1'}>{`Campaign owner: ${ownerName}`}</Typography>
                {owner && (
                    <Box marginY="1em">
                        <Button variant="contained" onClick={this.openEditCampaign}>
                            Edit campaign
                        </Button>
                    </Box>
                )}
                <Box marginY="1em">
                    <Typography variant="h6">Campaign members</Typography>
                    {this.props.membersLoading ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        this.props.members.map(this.renderMember)
                    )}
                </Box>
                {inviteCode && <CampaignInviteInfo campaignId={id} inviteCode={inviteCode} />}
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

const mapStateToProps = (state: RootState) => ({
    members: state.campaign.members,
    membersLoading: state.campaign.membersLoading
});

export const CampaignDetails = connect(mapStateToProps, {
    fetchMembers: campaignActions.actions.fetchMembers,
    kickFromCampaign: campaignActions.actions.kickFromCampaign,
    deleteCampaign: campaignActions.actions.deleteCampaign,
    leaveCampaign: campaignActions.actions.leaveCampaign
})(CampaignDetailsRaw);
