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
    ListItemIcon
} from '@material-ui/core';
import { Add, Visibility } from '@material-ui/icons';
import { RootState } from '../../../store/reducers';
import { campaignActions } from '../../../store/actions';
import { connect } from 'react-redux';
import { Label } from '../../../types/label.types';

interface Props {
    campaignId: string;
    owner: boolean;
}

interface MapProps {
    labels: Label[];
    loading: boolean;
    fetchLabels: (campaignId: string) => void;
}

type AllProps = Props & MapProps;

interface State {
    createOpen: boolean;
}

class CampaignLabelsRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            createOpen: false
        };
    }

    componentDidMount() {
        this.props.fetchLabels(this.props.campaignId);
    }

    openCreate = (): void => {
        this.setState({ createOpen: true });
    };

    closeModals = (): void => {
        this.setState({ createOpen: false });
    };

    // renderCreateCharacter = () => (
    //     <Paper className="CampaignDetail__createPaper">
    //         <Typography variant="h5">New character</Typography>
    //         <CreateCharacterForm
    //             campaignId={this.props.campaignId}
    //             className="CampaignDetail__createContainer"
    //             onSubmitComplete={this.closeModals}
    //         />
    //     </Paper>
    // );

    renderLabel = (label: Label) => (
        <ListItem>
            <ListItemText primary={label.name} />
            {this.props.owner && (
                <ListItemIcon>
                    <Visibility color={label.visible ? 'primary' : 'disabled'} />
                </ListItemIcon>
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
                            {<List>{labels.sort((a, b) => (a.name > b.name ? 1 : -1)).map(this.renderLabel)}</List>}
                        </Paper>
                    )}
                </Box>
                {this.props.owner && (
                    <Fab className="CampaignDetail__createFab" color="primary" onClick={this.openCreate}>
                        <Add />
                    </Fab>
                )}

                {/* <Modal open={this.state.createOpen} onClose={this.closeModals}>
                    <div className="modal">{this.renderCreateCharacter()}</div>
                </Modal> */}
            </Box>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    labels: state.campaign.labels,
    loading: state.campaign.labelsLoading
});

export const CampaignLabels = connect(mapStateToProps, {
    fetchLabels: campaignActions.actions.fetchLabels
})(CampaignLabelsRaw);
