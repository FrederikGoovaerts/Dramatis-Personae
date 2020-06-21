import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Typography
} from '@material-ui/core';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { campaignActions, characterActions } from '../../../store/actions';
import { RootState } from '../../../store/reducers';
import { Character } from '../../../types/character.types';
import { AddLabelPayload, Label } from '../../../types/label.types';

interface Props {
    campaignId: string;
    character: Character;
    onSubmitComplete: () => void;
}

interface MapProps {
    labels: Label[];
    loading: boolean;
    fetchLabels: (campaignId: string) => void;
    addLabel: (payload: AddLabelPayload) => void;
}

type AllProps = Props & MapProps;

const AddCharacterLabelFormRaw = (props: AllProps) => {
    const { campaignId, fetchLabels } = props;

    const [selected, setSelected] = useState('');

    useEffect(() => {
        fetchLabels(campaignId);
    }, [fetchLabels, campaignId]);

    if (props.loading) {
        return <CircularProgress />;
    }

    const handleSelect = (event: React.ChangeEvent<{ value: string }>) => {
        setSelected(event.target.value);
    };

    const handleSubmit = () => {
        props.addLabel({ characterId: props.character.id, labelId: selected });
        props.onSubmitComplete();
    };

    const characterLabelIds = props.character.labels.map((label) => label.id);
    const filteredLabels = props.labels.filter((label: Label) => !characterLabelIds.includes(label.id));
    return (
        <Paper className="modalPaper">
            <div className="modalContainer">
                <div className="modalHeader">
                    <Typography variant="h5">Add label(s)</Typography>
                </div>
                {filteredLabels.length > 0 ? (
                    <FormControl margin="dense">
                        <InputLabel>Label</InputLabel>
                        <Select value={selected} onChange={handleSelect}>
                            {filteredLabels.map((label: Label) => (
                                <MenuItem key={label.id} value={label.id}>
                                    <Box display="flex">
                                        <Typography>{label.name}</Typography>
                                        {!label.visible && (
                                            <Box marginLeft="0.5em" display="flex" alignItems="center">
                                                <VisibilityOff />
                                            </Box>
                                        )}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    <Box marginTop="1em">
                        <Typography>There are no unapplied labels for this character.</Typography>
                    </Box>
                )}
                <Box marginTop="1em" display="flex" flexDirection="column">
                    <Button onClick={handleSubmit} color="primary" variant="contained" disabled={selected === ''}>
                        Add
                    </Button>
                </Box>
            </div>
        </Paper>
    );
};

const mapStateToProps = (state: RootState) => ({
    labels: state.campaign.labels,
    loading: state.campaign.labelsLoading
});

export const AddCharacterLabelForm = connect(mapStateToProps, {
    addLabel: characterActions.actions.addLabel,
    fetchLabels: campaignActions.actions.fetchLabels
})(AddCharacterLabelFormRaw);
