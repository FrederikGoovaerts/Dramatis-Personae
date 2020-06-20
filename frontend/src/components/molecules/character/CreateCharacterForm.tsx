import * as React from 'react';
import { connect } from 'react-redux';

import { campaignActions } from '../../../store/actions';
import { CharacterPrototype } from '../../../types/character.types';
import { CharacterForm } from './CharacterForm';

interface Props {
    campaignId: string;
    owner: boolean;
    onSubmitComplete?: () => void;
}

interface MapProps {
    createCharacter: (params: { campaignId: string; character: CharacterPrototype }) => void;
}

type AllProps = Props & MapProps;

class CreateCharacterFormRaw extends React.Component<AllProps> {
    handleSubmit = (name: string, description: string, visible: boolean) => {
        this.props.createCharacter({
            campaignId: this.props.campaignId,
            character: {
                name,
                description,
                visible
            }
        });
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    render = () => <CharacterForm onSubmit={this.handleSubmit} owner={this.props.owner} buttonLabel="Create" />;
}

export const CreateCharacterForm = connect(null, { createCharacter: campaignActions.actions.createCharacter })(
    CreateCharacterFormRaw
);
