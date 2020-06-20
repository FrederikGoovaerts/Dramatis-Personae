import * as React from 'react';
import { connect } from 'react-redux';

import { characterActions } from '../../../store/actions';
import { BaseEditCharacterForm } from './BaseEditCharacterForm';
import { CharacterEditPayload } from '../../../types/character.types';

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
            setTimeout(this.props.onDelete, 500);
        }
    };

    render = () => (
        <BaseEditCharacterForm
            initialName={this.props.initialName}
            initialDescription={this.props.initialDescription}
            initialVisibility={this.props.initialVisibility}
            owner={this.props.owner}
            onSubmit={this.handleSubmit}
            onDelete={this.handleDelete}
        />
    );
}

export const EditCharacterForm = connect(null, {
    editCharacter: characterActions.actions.editCharacter,
    deleteCharacter: characterActions.actions.deleteCharacter
})(EditCharacterFormRaw);