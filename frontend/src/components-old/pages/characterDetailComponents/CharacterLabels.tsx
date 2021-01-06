import { Box, Chip, Modal } from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import * as React from 'react';
import { connect } from 'react-redux';

import { characterActions } from '../../../store/actions';
import { Character } from '../../../types/character.types';
import { Label, RemoveLabelPayload } from '../../../types/label.types';
import { AddCharacterLabelForm } from '../../molecules/label/AddCharacterLabelForm';

interface Props {
    campaignId: string;
    character: Character;
}

interface MapProps {
    removeLabel: (payload: RemoveLabelPayload) => void;
}

type AllProps = Props & MapProps;

interface State {
    addOpen: boolean;
}

class CharacterLabelsRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { addOpen: false };
    }

    closeAdd = () => {
        this.setState({ addOpen: false });
    };

    onAdd = () => {
        this.setState({ addOpen: true });
    };

    render = () => (
        <Box marginBottom="1em">
            {this.props.character.labels.map((label: Label) => (
                <Box marginRight="0.5em" key={label.id} display="inline">
                    <Chip
                        color="primary"
                        label={label.name}
                        variant={label.visible ? 'default' : 'outlined'}
                        onDelete={() =>
                            this.props.removeLabel({
                                characterId: this.props.character.id,
                                labelId: label.id
                            })
                        }
                    />
                </Box>
            ))}
            {/* <Chip avatar={<Add />} label="Add label" onClick={this.onAdd} variant="outlined" /> */}
            <Modal open={this.state.addOpen} onClose={this.closeAdd}>
                <div className="modal">
                    <AddCharacterLabelForm
                        campaignId={this.props.campaignId}
                        character={this.props.character}
                        onSubmitComplete={this.closeAdd}
                    />
                </div>
            </Modal>
        </Box>
    );
}

export const CharacterLabels = connect(null, {
    removeLabel: characterActions.actions.removeLabel
})(CharacterLabelsRaw);