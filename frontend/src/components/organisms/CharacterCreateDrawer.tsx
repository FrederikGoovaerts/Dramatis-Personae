import React from 'react';

import { CreateDrawer } from './CreateDrawer';

interface Props {
    onCreate: (name: string, description: string) => void;
}

export const CharacterCreateDrawer = (props: Props) => (
    <CreateDrawer
        onCreate={props.onCreate}
        entity="Character"
        nameString="Name"
        namePlaceholder="Character name"
        textarea={false}
    />
);
