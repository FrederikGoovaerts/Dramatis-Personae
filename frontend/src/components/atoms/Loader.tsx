import { Box, CircularProgress } from '@chakra-ui/react';
import React from 'react';

export const Loader = () => (
    <Box display="flex" justifyContent="center" marginTop="2em" marginBottom="2em">
        <CircularProgress isIndeterminate color="teal.500" />
    </Box>
);
