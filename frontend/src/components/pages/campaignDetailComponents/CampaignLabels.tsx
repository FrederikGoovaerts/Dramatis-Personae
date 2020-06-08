import * as React from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    Fab,
    ListItemText,
    ListItem,
    CircularProgress,
    ListItemIcon,
    Modal,
    IconButton
} from '@material-ui/core';
import { Add, Visibility, Edit } from '@material-ui/icons';
import { RootState } from '../../../store/reducers';
import { campaignActions, labelActions } from '../../../store/actions';
import { connect } from 'react-redux';
import { Label, DeleteLabelPayload, EditLabelPayload } from '../../../types/label.types';
import { CreateLabelForm } from '../../molecules/CreateLabelForm';
import { EditLabelForm } from '../../molecules/EditLabelForm';

interface Props {
    campaignId: string;
    owner: boolean;
}

interface MapProps {
    labels: Label[];
    loading: boolean;
    fetchLabels: (campaignId: string) => void;
    deleteLabel: (payload: DeleteLabelPayload) => void;
    editLabel: (payload: EditLabelPayload) => void;
}

type AllProps = Props & MapProps;

interface State {
    createOpen: boolean;
    editLabel: Label | undefined;
}

class CampaignLabelsRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            createOpen: false,
            editLabel: undefined
        };
    }

    componentDidMount() {
        this.props.fetchLabels(this.props.campaignId);
    }

    openCreate = (): void => {
        this.setState({ createOpen: true });
    };

    openEdit = (label: Label): void => {
        this.setState({ editLabel: label });
    };

    closeModals = (): void => {
        this.setState({ createOpen: false, editLabel: undefined });
    };

    renderEditLabel = () => {
        const label = this.state.editLabel!;

        const editLabel = (name: string, visible: boolean) =>
            this.props.editLabel({ campaignId: this.props.campaignId, labelId: label.id, name, visible });
        const deleteLabel = () => this.props.deleteLabel({ campaignId: this.props.campaignId, labelId: label.id });

        return (
            <EditLabelForm
                label={label}
                deletable={this.props.owner}
                editLabel={editLabel}
                deleteLabel={deleteLabel}
                onSubmitComplete={this.closeModals}
            />
        );
    };

    renderLabel = (label: Label) => (
        <ListItem>
            <ListItemText primary={label.name} />
            {this.props.owner && (
                <>
                    <ListItemIcon>
                        <IconButton onClick={() => this.openEdit(label)}>
                            <Edit />
                        </IconButton>
                    </ListItemIcon>
                    <ListItemIcon>
                        <Visibility color={label.visible ? 'primary' : 'disabled'} />
                    </ListItemIcon>
                </>
            )}
        </ListItem>
    );

    render() {
        const { labels, loading } = this.props;
        if (loading) {
            return <CircularProgress />;
        }
        return (
            <Box>
                <Box marginBottom="1em">
                    {labels.length === 0 ? (
                        <Typography variant="body1">This campaign does not have any labels yet.</Typography>
                    ) : (
                        <Paper elevation={3}>
                            {
                                <List>
                                    {labels
                                        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
                                        .map(this.renderLabel)}
                                </List>
                            }
                        </Paper>
                    )}
                </Box>
                {this.props.owner && (
                    <Fab className="CampaignDetail__createFab" color="primary" onClick={this.openCreate}>
                        <Add />
                    </Fab>
                )}

                <Modal open={this.state.createOpen} onClose={this.closeModals}>
                    <div className="modal">
                        <CreateLabelForm
                            campaignId={this.props.campaignId}
                            className="CampaignDetail__createContainer"
                            onSubmitComplete={this.closeModals}
                        />
                    </div>
                </Modal>
                <Modal open={this.state.editLabel !== undefined} onClose={this.closeModals}>
                    <div className="modal">{this.renderEditLabel()}</div>
                </Modal>
            </Box>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    labels: state.campaign.labels,
    loading: state.campaign.labelsLoading
});

export const CampaignLabels = connect(mapStateToProps, {
    fetchLabels: campaignActions.actions.fetchLabels,
    deleteLabel: labelActions.actions.deleteLabel,
    editLabel: labelActions.actions.editLabel
})(CampaignLabelsRaw);
