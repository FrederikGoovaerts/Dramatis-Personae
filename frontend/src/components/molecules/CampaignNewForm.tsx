import { Box, Button, Input, InputGroup, InputRightAddon } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { campaignActions } from '../../store/actions';

export const NewCampaignForm = () => {
    const [name, setName] = useState('');
    const dispatch = useDispatch();

    const create = () => {
        dispatch(campaignActions.actions.newCampaign(name));
        setName('');
    };

    return (
        <Box>
            <InputGroup>
                <Input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="New campaign name"
                    focusBorderColor="teal.500"
                    width="30%"
                />
                <InputRightAddon padding="0">
                    <Button onClick={create} disabled={name === ''} variant="ghost" borderRadius="0">
                        Create
                    </Button>
                </InputRightAddon>
            </InputGroup>
        </Box>
    );
};
