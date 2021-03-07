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

    const bgColor = useColorModeValue('white', 'gray.800');
    const iconColor = useColorModeValue('teal.500', 'teal.400');
    const colorIcon = useColorModeValue(<SunIcon />, <MoonIcon />);

    return (
        <Box position="sticky" background="brand" top="0" backgroundColor={bgColor}>
            <header>
                <Flex direction="column">
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
                    <Divider />
                </Flex>
            </header>
        </Box>
    );
};
