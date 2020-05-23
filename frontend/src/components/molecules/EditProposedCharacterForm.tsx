import * as React from 'react';
import { connect } from 'react-redux';

import { proposedCharacterActions } from '../../store/actions';
import { BaseEditCharacterForm } from './BaseEditCharacterForm';

interface Props {
    characterId: string;
    campaignId: string;
    initialName: string;
    initialDescription: string;
    onSubmitComplete?: () => void;
}

interface MapProps {
    editProposedCharacter: (payload: {
        campaignId: string;
        characterId: string;
        name: string;
        description: string;
    }) => void;
}

type AllProps = Props & MapProps;

class EditProposedCharacterFormRaw extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    handleSubmit = (name: string, description: string) => {
        this.props.editProposedCharacter({
            campaignId: this.props.campaignId,
            characterId: this.props.characterId,
            name,
            description
        });
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    render = () => (
        <BaseEditCharacterForm
            initialName={this.props.initialName}
            initialDescription={this.props.initialDescription}
            onSubmit={this.handleSubmit}
        />
    );
}

export const EditProposedCharacterForm = connect(null, {
    editProposedCharacter: proposedCharacterActions.actions.editProposedCharacter
})(EditProposedCharacterFormRaw);
