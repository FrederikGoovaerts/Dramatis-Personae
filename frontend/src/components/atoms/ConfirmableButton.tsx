import { Button } from '@material-ui/core';
import React, { useState } from 'react';

type ButtonState = 'DEFAULT' | 'CLICKED' | 'DELETING';

interface Props {
    onConfirm: () => void;
    defaultText: string;
    confirmedText: string;
    disabled?: boolean;
}

export const ConfirmableButton = (props: Props) => {
    const [state, setState] = useState<ButtonState>('DEFAULT');

    const click = () => {
        if (state === 'DEFAULT') {
            setState('CLICKED');
        } else if (state === 'CLICKED') {
            setState('DELETING');
            props.onConfirm();
        }
    };

    const variant = state === 'DEFAULT' ? 'outlined' : 'contained';
    const disabled = state === 'DELETING' || props.disabled;
    const contents = state === 'DEFAULT' ? props.defaultText : state === 'CLICKED' ? 'Confirm' : props.confirmedText;

    return (
        <Button variant={variant} color="secondary" onClick={click} disabled={disabled}>
            {contents}
        </Button>
    );
};

interface PredefinedButtonProps {
    onConfirm: () => void;
    disabled?: boolean;
}

export const DeleteButton = (props: PredefinedButtonProps) => (
    <ConfirmableButton
        onConfirm={props.onConfirm}
        defaultText="Delete"
        confirmedText="Deleting..."
        disabled={props.disabled}
    />
);

export const MergeButton = (props: PredefinedButtonProps) => (
    <ConfirmableButton
        onConfirm={props.onConfirm}
        defaultText="Merge into"
        confirmedText="Merging..."
        disabled={props.disabled}
    />
);
