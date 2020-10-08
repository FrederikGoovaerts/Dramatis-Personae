import { Box, Divider, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';

import { characterActions } from '../../../store/actions';
import { DeleteButton } from '../../atoms/ConfirmableButton';
import { CharacterForm } from './CharacterForm';
import { MergeCharacterForm } from './MergeCharacterForm';

interface Props {
    characterId: string;
    campaignId: string;
    initialName: string;
    initialDescription: string;
    initialVisibility: boolean;
    owner: boolean;
    onSubmitComplete?: () => void;
    onDelete?: () => void;
}

const useStyles = makeStyles({
    spaced: {
        marginTop: '0.5em',
        marginBottom: '0.5em'
    },
    flexRowEnd: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
});

export const EditCharacterForm = (props: Props) => {
    const styles = useStyles();
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

    const handleMerge = () => {
        if (props.onDelete) {
            setTimeout(props.onDelete, 200);
        }
    };

    return (
        <Paper className="modalPaper">
            <div className="modalContainer">
                <div className="modalHeader">
                    <Typography variant="h5">Update character</Typography>
                </div>
                <CharacterForm
                    initialName={props.initialName}
                    initialDescription={props.initialDescription}
                    initialVisibility={props.initialVisibility}
                    owner={props.owner}
                    buttonLabel="Update"
                    onSubmit={handleSubmit}
                />
                <Divider className={styles.spaced} />
                <Typography variant="h6">Danger zone</Typography>
                <Box className={styles.spaced}>
                    <MergeCharacterForm
                        characterId={props.characterId}
                        campaignId={props.campaignId}
                        onComplete={handleMerge}
                    />
                </Box>
                <Box className={`${styles.spaced} ${styles.flexRowEnd}`}>
                    <DeleteButton onConfirm={handleDelete} />
                </Box>
            </div>
        </Paper>
    );
};
