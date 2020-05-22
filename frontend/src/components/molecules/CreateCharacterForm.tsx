import * as React from 'react';
import { connect } from 'react-redux';

import { campaignActions } from '../../store/actions';
import { CharacterPrototype } from '../../types/character.types';
import { NewCharacterForm } from './NewCharacterForm';

interface Props {
    campaignId: string;
    className?: string;
    onSubmitComplete?: () => void;
}

interface MapProps {
    createCharacter: (params: { campaignId: string; character: CharacterPrototype }) => void;
}

type AllProps = Props & MapProps;

class CreateCharacterFormRaw extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    handleSubmit = (name: string, description: string) => {
        this.props.createCharacter({
            campaignId: this.props.campaignId,
            character: {
                name: name,
                description: description
            }
        });
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    render = () => <NewCharacterForm className={this.props.className} onSubmit={this.handleSubmit} />;
}

export const CreateCharacterForm = connect(null, { createCharacter: campaignActions.actions.createCharacter })(
    CreateCharacterFormRaw
);