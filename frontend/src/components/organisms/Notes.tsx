import { Box, Button, Divider, Flex, Heading, Text } from '@chakra-ui/react';
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
        const visibility =
            note.visibility === 'PUBLIC' ? 'Public' : note.visibility === 'PRIVATE' ? 'Private' : 'Shared with DM';
        return (
            <>
                <Box key={note.id} padding="1em">
                    <Flex justify="space-between">
                        {note.contents.split('\n').map((el, index) => (
                            <Text key={index}>{el}</Text>
                        ))}
                        <Flex direction="column">
                            <Button onClick={() => setEditNote(note)} marginBottom="0.5em">
                                Edit
                            </Button>
                            <Text fontStyle="italic">{visibility}</Text>
                        </Flex>
                    </Flex>
                </Box>
                <Divider key={`divider-${note.id}`} />
            </>
        );
    };

    return (
        <Box>
            <Flex marginBottom="1em" alignItems="center">
                <Heading>Your notes</Heading>
                <Button onClick={() => setCreateOpen(true)} size="sm" marginLeft="1em">
                    Add
                </Button>
            </Flex>
            <Box marginBottom="2em">{props.notes.map(renderNote)}</Box>
            {props.sharedNotes.length > 0 && (
                <Box marginBottom="1em">
                    <Heading>Notes by others</Heading>
                </Box>
            )}
            {props.sharedNotes.length > 0 && <Box marginBottom="2em">{props.sharedNotes.map(renderNote)}</Box>}
        </Box>
    );
};
