import { Box, Paper, Typography } from '@material-ui/core';
import Warning from '@material-ui/icons/Warning';
import * as React from 'react';

import { grayLight } from '../../assets/Colors';

interface Props {
    text: string;
}

export const AlertBox = (props: Props) => (
    <Paper>
        <Box
            padding="0.5em"
            display="flex"
            flexDirection="row"
            borderRadius="0.2em"
            alignItems="center"
            bgcolor={grayLight}
        >
            <Box margin="0.5em">
                <Warning />
            </Box>
            <Typography>{props.text}</Typography>
        </Box>
    </Paper>
);
