import { Box, CircularProgress, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { campaignActions } from '../../../store/actions';
import { RootState } from '../../../store/reducers';
import { MergeButton } from '../../atoms/ConfirmableButton';

interface Props {
    characterId: string;
    campaignId: string;
}

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export const MergeCharacterForm = (props: Props) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const [target, setTarget] = useState<string | undefined>(undefined);

    const characters = useSelector((state: RootState) => state.campaign.characters);
    const loading = useSelector((state: RootState) => state.campaign.charactersLoading);

    useEffect(() => {
        dispatch(campaignActions.actions.fetchCharacters(props.campaignId));
    }, [props.campaignId, dispatch]);

    const otherCharacters = characters.filter((c) => c.id !== props.characterId);

    return (
        <Box className={styles.container}>
            {loading ? <CircularProgress /> : <div>done</div>}
            <MergeButton onConfirm={console.log} />
        </Box>
    );
};
