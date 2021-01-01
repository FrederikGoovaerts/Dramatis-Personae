import { Paper, Typography } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';

import { campaignActions } from '../../../store/actions';
import { LabelForm } from './LabelForm';

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

type AllProps = Props & MapProps;

class CreateLabelFormRaw extends React.Component<AllProps> {
    handleSubmit = (name: string, visible: boolean) => {
        this.props.createLabel({
            id: this.props.campaignId,
            name,
            visible
        });
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    render() {
        return (
            <Paper className="modalPaper">
                <div className="modalContainer">
                    <Typography variant="h5">New label</Typography>
                    <LabelForm
                        owner={this.props.owner}
                        labelOverlaps={this.props.labelOverlaps}
                        submit={this.handleSubmit}
                        submitLabel="Update"
                    />
                </div>
            </Paper>
        );
    }
}

export const CreateLabelForm = connect(null, { createLabel: campaignActions.actions.createLabel })(CreateLabelFormRaw);
