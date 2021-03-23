import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    ButtonGroup,
    Divider,
    Flex,
    Heading,
    HStack,
    IconButton,
    useColorMode,
    useColorModeValue
} from '@chakra-ui/react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { PersonaeIcon } from '../../assets/svg/PersonaeIcon';
import { applicationActions } from '../../store/actions';

export const Header = () => {
    const { toggleColorMode, colorMode } = useColorMode();
    const dispatch = useDispatch();

    const iconColor = useColorModeValue('teal.500', 'teal.400');
    const colorIcon = useColorModeValue(<SunIcon />, <MoonIcon />);
    const bgColor = colorMode === 'light' ? 'white' : 'gray.800';

    return (
        <Box position="sticky" top="0" bgColor={bgColor} zIndex={3}>
            <Box marginRight="auto" marginLeft="auto" maxWidth="75rem" height="6em">
                <HStack direction="row" justify="space-between">
                    <Flex alignItems="center" direction="row">
                        <Box margin="1em">
                            <PersonaeIcon boxSize="3em" color={iconColor} />
                        </Box>
                        <Heading size="lg">Dramatis Personae</Heading>
                    </Flex>
                    <ButtonGroup spacing="2" marginRight="1em">
                        <IconButton aria-label="Toggle color mode" onClick={toggleColorMode} icon={colorIcon} />
                        <Button colorScheme="teal" onClick={() => dispatch(applicationActions.actions.logout())}>
                            Log out
                        </Button>
                    </ButtonGroup>
                </HStack>
            </Box>
            <Divider />
        </Box>
    );
};
