import React from 'react';

import { CreateDrawer } from './CreateDrawer';

interface Props {
    onCreate: (name: string, description: string) => void;
}

export const EventCreateDrawer = (props: Props) => (
    <CreateDrawer
        onCreate={props.onCreate}
        entity="Event"
        nameString="Title"
        namePlaceholder="Event title"
        textarea={true}
    />
);
