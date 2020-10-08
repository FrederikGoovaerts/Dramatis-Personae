import { Box, CircularProgress, makeStyles, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { campaignActions, characterActions } from '../../../store/actions';
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
    const loading = useSelector((state: RootState) => state.campaign.charactersLoading);

    const [target, setTarget] = useState<string | undefined>(undefined);

    useEffect(() => {
        dispatch(campaignActions.actions.fetchCharacters(props.campaignId));
    }, [props.campaignId, dispatch]);

    const otherCharacters = characters.filter((c) => c.id !== props.characterId);
    useEffect(() => {
        setTarget(otherCharacters[0]?.id);
    }, [otherCharacters]);

    const merge = () => {
        if (target) {
            dispatch(characterActions.actions.mergeCharacter({ id: props.characterId, target }));
        }
        props.onComplete();
    };

    if (!loading && characters.length === 0) {
        return null;
    }

    return (
        <Box className={styles.container}>
            {loading ? (
                <CircularProgress />
            ) : (
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
            )}
            <MergeButton onConfirm={merge} disabled={!target} />
        </Box>
    );
};
