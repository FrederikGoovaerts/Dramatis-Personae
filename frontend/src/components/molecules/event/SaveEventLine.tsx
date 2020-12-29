import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';

interface Props {
    initialName?: string;
    initialDesc?: string;
    doSave: (name: string, desc: string) => void;
    doCancel: () => void;
}

export const SaveEventLine = (props: Props) => {
    const [name, setName] = useState<string>(props.initialName || '');
    const [desc, setDesc] = useState<string>(props.initialDesc || '');

    return (
        <Box display="flex" flex={1} justifyContent="space-between" alignItems="center">
            <Box flexDirection="column" display="flex" flex={1}>
                <TextField
                    value={name}
                    size="small"
                    fullWidth={false}
                    label="Event title"
                    onChange={(event) => setName(event.target.value)}
                />
                <TextField
                    value={desc}
                    size="small"
                    fullWidth={true}
                    label="Event description"
                    onChange={(event) => setDesc(event.target.value)}
                />
            </Box>

            <Box flexDirection="column" display="flex">
                <Button onClick={() => props.doSave(name, desc)} disabled={name === ''}>
                    Save
                </Button>
                <Button onClick={props.doCancel}>Cancel</Button>
            </Box>
        </Box>
    );
};
