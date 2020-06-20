import * as React from 'react';
import { Paper, Typography } from '@material-ui/core';

import { DeleteButton } from '../../atoms/DeleteButton';
import { Label } from '../../../types/label.types';
import { LabelForm } from './LabelForm';

interface Props {
    label: Label;
    className?: string;
    owner: boolean;
    labelOverlaps: (name: string, visible: boolean, id: string) => boolean;
    onSubmitComplete?: () => void;
    editLabel: (name: string, visible: boolean) => void;
    deleteLabel: () => void;
}

export class EditLabelForm extends React.Component<Props> {
    handleSubmit = (name: string, visible: boolean) => {
        this.props.editLabel(name, visible);
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    handleDelete = () => {
        this.props.deleteLabel();
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    labelOverlaps = (name: string, visible: boolean) => this.props.labelOverlaps(name, visible, this.props.label.id);

    render() {
        return (
            <Paper className="modalPaper">
                <div className="modalContainer">
                    <div className="modalHeader">
                        <Typography variant="h5">Update label</Typography>
                        <DeleteButton onConfirm={this.handleDelete} />
                    </div>
                    <LabelForm
                        label={this.props.label}
                        owner={this.props.owner}
                        labelOverlaps={this.labelOverlaps}
                        submit={this.handleSubmit}
                        submitLabel="Update"
                    />
                </div>
            </Paper>
        );
    }
}
