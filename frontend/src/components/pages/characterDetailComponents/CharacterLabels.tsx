import * as React from 'react';
import { connect } from 'react-redux';
import { Character } from '../../../types/character.types';
import { characterActions } from '../../../store/actions';
import { AddLabelPayload, RemoveLabelPayload, Label } from '../../../types/label.types';
import { Box, Chip } from '@material-ui/core';
import { Add } from '@material-ui/icons';

interface Props {
    character: Character;
    canChange: boolean;
}

interface MapProps {
    addLabel: (payload: AddLabelPayload) => void;
    removeLabel: (payload: RemoveLabelPayload) => void;
}

type AllProps = Props & MapProps;

class CharacterLabelsRaw extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    onAdd = () => {
        console.log();
    };

    render = () => (
        <Box marginBottom="1em">
            {this.props.character.labels.map((label: Label) => (
                <Box marginRight="0.5em" key={label.id} display="inline">
                    <Chip
                        color="primary"
                        label={label.name}
                        variant={label.visible ? 'default' : 'outlined'}
                        onDelete={
                            this.props.canChange
                                ? () =>
                                      this.props.removeLabel({
                                          characterId: this.props.character.id,
                                          labelId: label.id
                                      })
                                : undefined
                        }
                    />
                </Box>
            ))}
            <Chip avatar={<Add />} label="Add label" onClick={this.onAdd} variant="outlined" />
        </Box>
    );
}

export const CharacterLabels = connect(null, {
    addLabel: characterActions.actions.addLabel,
    removeLabel: characterActions.actions.removeLabel
})(CharacterLabelsRaw);
