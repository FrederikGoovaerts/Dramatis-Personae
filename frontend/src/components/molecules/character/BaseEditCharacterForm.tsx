import { Paper, Typography } from '@material-ui/core';
import * as React from 'react';

import { DeleteButton } from '../../atoms/DeleteButton';
import { CharacterForm } from './CharacterForm';

interface Props {
    initialName: string;
    initialDescription: string;
    initialVisibility: boolean;
    owner: boolean;
    onSubmit: (name: string, description: string, visible: boolean) => void;
    onDelete?: () => void;
}

export class BaseEditCharacterForm extends React.Component<Props> {
    handleDelete = () => {
        if (this.props.onDelete) {
            setTimeout(this.props.onDelete, 200);
        }
    };

    render() {
        return (
            <Paper className="modalPaper">
                <div className="modalContainer">
                    <div className="modalHeader">
                        <Typography variant="h5">Update character</Typography>
                        {this.props.onDelete && <DeleteButton onConfirm={this.handleDelete} />}
                    </div>
                    <CharacterForm
                        initialName={this.props.initialName}
                        initialDescription={this.props.initialDescription}
                        initialVisibility={this.props.initialVisibility}
                        owner={this.props.owner}
                        buttonLabel="Update"
                        onSubmit={this.props.onSubmit}
                    />
                </div>
            </Paper>
        );
    }
}
