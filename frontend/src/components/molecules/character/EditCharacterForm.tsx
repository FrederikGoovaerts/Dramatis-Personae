import { Paper, Typography } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';

import { characterActions } from '../../../store/actions';
import { CharacterEditPayload } from '../../../types/character.types';
import { DeleteButton } from '../../atoms/ConfirmableButton';
import { CharacterForm } from './CharacterForm';

interface Props {
    characterId: string;
    initialName: string;
    initialDescription: string;
    initialVisibility: boolean;
    owner: boolean;
    onSubmitComplete?: () => void;
    onDelete?: () => void;
}

interface MapProps {
    editCharacter: (payload: CharacterEditPayload) => void;
    deleteCharacter: (params: string) => void;
}

type AllProps = Props & MapProps;

class EditCharacterFormRaw extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    handleSubmit = (name: string, description: string, visible: boolean) => {
        this.props.editCharacter({
            characterId: this.props.characterId,
            name,
            description,
            visible
        });
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    handleDelete = () => {
        this.props.deleteCharacter(this.props.characterId);
        if (this.props.onDelete) {
            setTimeout(this.props.onDelete, 200);
        }
    };

    render = () => (
        <Paper className="modalPaper">
            <div className="modalContainer">
                <div className="modalHeader">
                    <Typography variant="h5">Update character</Typography>
                    <DeleteButton onConfirm={this.handleDelete} />
                </div>
                <CharacterForm
                    initialName={this.props.initialName}
                    initialDescription={this.props.initialDescription}
                    initialVisibility={this.props.initialVisibility}
                    owner={this.props.owner}
                    buttonLabel="Update"
                    onSubmit={this.handleSubmit}
                />
            </div>
        </Paper>
    );
}

export const EditCharacterForm = connect(null, {
    editCharacter: characterActions.actions.editCharacter,
    deleteCharacter: characterActions.actions.deleteCharacter
})(EditCharacterFormRaw);
