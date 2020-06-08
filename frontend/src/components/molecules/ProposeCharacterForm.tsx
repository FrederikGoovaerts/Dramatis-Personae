import * as React from 'react';
import { connect } from 'react-redux';

import { campaignActions } from '../../store/actions';
import { CharacterPrototype } from '../../types/character.types';
import { NewCharacterForm } from './NewCharacterForm';

interface Props {
    campaignId: string;
    onSubmitComplete?: () => void;
}

interface MapProps {
    proposeCharacter: (params: { campaignId: string; character: CharacterPrototype }) => void;
}

type AllProps = Props & MapProps;

class ProposeCharacterFormRaw extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    handleSubmit = (name: string, description: string) => {
        this.props.proposeCharacter({
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

    render = () => <NewCharacterForm onSubmit={this.handleSubmit} />;
}

export const ProposeCharacterForm = connect(null, { proposeCharacter: campaignActions.actions.proposeCharacter })(
    ProposeCharacterFormRaw
);
