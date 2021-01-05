import { Button } from '@chakra-ui/react';
import React, { useState } from 'react';

type ButtonState = 'DEFAULT' | 'CLICKED' | 'DELETING';

interface Props {
    onConfirm: () => void;
    defaultText: string;
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

    const variant = state === 'DEFAULT' ? 'outline' : 'solid';
    const disabled = state === 'DELETING' || props.disabled;
    const contents = state === 'DEFAULT' ? props.defaultText : 'Confirm';

    return (
        <Button variant={variant} color="secondary" onClick={click} disabled={disabled}>
            {contents}
        </Button>
    );
};
