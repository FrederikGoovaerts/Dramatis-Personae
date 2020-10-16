import { Box, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { characterActions } from '../../../store/actions';
import { RootState } from '../../../store/reducers';
import { MergeButton } from '../../atoms/ConfirmableButton';

interface Props {
    characterId: string;
    campaignId: string;
    onComplete: () => void;
}

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    select: {
        flex: 1,
        marginRight: '1em'
    }
});

export const MergeCharacterForm = (props: Props) => {
    const styles = useStyles();
    const dispatch = useDispatch();

    const characters = useSelector((state: RootState) => state.campaign.characters);
    const otherCharacters = characters.filter((c) => c.id !== props.characterId);

    const [target, setTarget] = useState<string | undefined>(otherCharacters[0]?.id);

    const merge = () => {
        if (target) {
            dispatch(characterActions.actions.mergeCharacter({ id: props.characterId, target }));
        }
        props.onComplete();
    };

    if (otherCharacters.length === 0) {
        return null;
    }

    return (
        <>
            <Box className={styles.container}>
                <Select
                    value={target}
                    onChange={(event: React.ChangeEvent<{ value: string }>) => setTarget(event.target.value)}
                    className={styles.select}
                >
                    {otherCharacters.map((char) => (
                        <MenuItem key={char.id} value={char.id}>
                            {char.name}
                        </MenuItem>
                    ))}
                </Select>
                <MergeButton onConfirm={merge} disabled={!target} />
            </Box>
            <Typography variant="caption" color="textSecondary">
                Merging this character into another will append the descriptions and transfer all notes, labels and
                relations.
            </Typography>
        </>
    );
};
