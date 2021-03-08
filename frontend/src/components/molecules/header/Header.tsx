import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    ButtonGroup,
    Divider,
    Flex,
    HStack,
    IconButton,
    Text,
    useColorMode,
    useColorModeValue
} from '@chakra-ui/react';
import React from 'react';

import { PersonaeIcon } from '../../../assets/svg/PersonaeIcon';

export const Header = () => {
    const { toggleColorMode } = useColorMode();

    const iconColor = useColorModeValue('teal.500', 'teal.400');
    const colorIcon = useColorModeValue(<SunIcon />, <MoonIcon />);

    return (
        <header>
            <Box marginRight="auto" marginLeft="auto" maxWidth="75rem" height="6em">
                <HStack direction="row" justify="space-between">
                    <Flex alignItems="center" direction="row">
                        <Box margin="1em">
                            <PersonaeIcon boxSize="3em" color={iconColor} />
                        </Box>
                        <Text textStyle="title">Dramatis Personae</Text>
                    </Flex>
                    <ButtonGroup spacing="2" marginRight="1em">
                        <IconButton aria-label="Toggle color mode" onClick={toggleColorMode} icon={colorIcon} />
                        <Button colorScheme="teal">Log out</Button>
                    </ButtonGroup>
                </HStack>
            </Box>
            <Divider />
        </header>
    );
};
