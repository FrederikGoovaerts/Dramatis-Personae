import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Box, Button, ButtonGroup, Divider, Flex, HStack, IconButton, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';

import { PersonaeIcon } from '../../../assets/svg/PersonaeIcon';

export const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <header>
            <Flex position="sticky" background="brand" direction="column" top="0">
                <HStack direction="row" justify="space-between">
                    <Flex alignItems="center" direction="row">
                        <Box margin="1em">
                            <PersonaeIcon boxSize="3em" color={colorMode === 'light' ? 'teal.500' : 'teal.400'} />
                        </Box>
                        <Text textStyle="title">Dramatis Personae</Text>
                    </Flex>
                    <ButtonGroup spacing="2" marginRight="1em">
                        <IconButton
                            aria-label="Toggle color mode"
                            onClick={toggleColorMode}
                            icon={colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
                        />
                        <Button colorScheme="teal">Log out</Button>
                    </ButtonGroup>
                </HStack>
                <Divider />
            </Flex>
        </header>
    );
};
