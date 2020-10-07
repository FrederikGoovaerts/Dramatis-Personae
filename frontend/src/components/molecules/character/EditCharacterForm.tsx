import { Paper, Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';

import { characterActions } from '../../../store/actions';
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

export const EditCharacterForm = (props: Props) => {
    const dispatch = useDispatch();

    const handleSubmit = (name: string, description: string, visible: boolean) => {
        dispatch(
            characterActions.actions.editCharacter({
                characterId: props.characterId,
                name,
                description,
                visible
            })
        );
        if (props.onSubmitComplete) {
            props.onSubmitComplete();
        }
    };

    const handleDelete = () => {
        dispatch(characterActions.actions.deleteCharacter(props.characterId));
        if (props.onDelete) {
            setTimeout(props.onDelete, 200);
        }
    };

    return (
        <Paper className="modalPaper">
            <div className="modalContainer">
                <div className="modalHeader">
                    <Typography variant="h5">Update character</Typography>
                    <DeleteButton onConfirm={handleDelete} />
                </div>
                <CharacterForm
                    initialName={props.initialName}
                    initialDescription={props.initialDescription}
                    initialVisibility={props.initialVisibility}
                    owner={props.owner}
                    buttonLabel="Update"
                    onSubmit={handleSubmit}
                />
            </div>
        </Paper>
    );
};
