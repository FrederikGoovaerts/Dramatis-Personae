import { Box, Button, Input, InputGroup, InputRightAddon } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { campaignActions } from '../../store/actions';

interface Props {
    campaignId: string;
}

export const LabelNewForm = (props: Props) => {
    const [name, setName] = useState('');
    const dispatch = useDispatch();

    const create = () => {
        dispatch(campaignActions.actions.createLabel({ id: props.campaignId, name, visible: true }));
        setName('');
    };

    return (
        <Box>
            <InputGroup>
                <Input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="New label name"
                    focusBorderColor="teal.500"
                    width="30%"
                />
                <InputRightAddon padding="0">
                    <Button onClick={create} variant="ghost" borderRadius="0">
                        Create
                    </Button>
                </InputRightAddon>
            </InputGroup>
        </Box>
    );
};
