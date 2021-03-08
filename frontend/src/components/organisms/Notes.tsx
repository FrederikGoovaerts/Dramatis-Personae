import { LockIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, Heading, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

import { Note, NoteVisibility } from '../../types/note.types';

interface Props {
    notes: Note[];
    sharedNotes: Note[];
    createNote: (contents: string, visibility: NoteVisibility) => void;
    editNote: (id: string, contents: string, visibility: NoteVisibility) => void;
    deleteNote: (id: string) => void;
}

export const Notes = (props: Props) => {
    const [createOpen, setCreateOpen] = useState(false);
    const [editNote, setEditNote] = useState<Note | undefined>(undefined);

    const renderNote = (note: Note) => {
        return (
            <Box key={note.id} paddingX="1em">
                {note.contents.split('\n').map((el, index) => (
                    <Text key={index}>{el}</Text>
                ))}
                {note.visibility === 'PUBLIC' && <ViewIcon />}
                {note.visibility === 'DM_SHARED' && <LockIcon />}
                {note.visibility === 'PRIVATE' && <ViewOffIcon />}

                <Button onClick={() => setEditNote(note)}>Edit</Button>
            </Box>
        );
    };

    const renderNotes = (renderedNotes: JSX.Element[]) => {
        for (let i = 1; i < renderedNotes.length; i = i + 2) {
            renderedNotes.splice(i, 0, <Divider key={`divider${i}`} />);
        }
        return <Box>{renderedNotes}</Box>;
    };

    const renderOwnNotes = () => {
        const renderedNotes = [
            ...props.notes.map(renderNote),
            <Box display="flex" flexDirection="row" justifyContent="center" paddingTop="0.5em" key={'addButton'}>
                <Button onClick={() => setCreateOpen(true)}>Add</Button>
            </Box>
        ];
        return renderNotes(renderedNotes);
    };

    return (
        <Box>
            <Box marginBottom="1em">
                <Heading>Your notes</Heading>
            </Box>
            <Box marginBottom="2em">{renderOwnNotes()}</Box>
            {props.sharedNotes.length > 0 && (
                <Box marginBottom="1em">
                    <Heading>Notes by others</Heading>
                </Box>
            )}
            {props.sharedNotes.length > 0 && (
                <Box marginBottom="2em">{renderNotes(props.sharedNotes.map(renderNote))}</Box>
            )}
        </Box>
    );
};
