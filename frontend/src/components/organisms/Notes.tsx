import { Box, Button, Divider, Flex, Heading, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

import { Note, NoteVisibility } from '../../types/note.types';
import { NotesCreateDrawer } from './NotesCreateDrawer';
import { NotesEditDrawer } from './NotesEditDrawer';

interface Props {
    notes: Note[];
    sharedNotes: Note[];
    onCreate: (contents: string, visibility: NoteVisibility) => void;
    onEdit: (id: string, contents: string, visibility: NoteVisibility) => void;
    onDelete: (id: string) => void;
}

export const Notes = (props: Props) => {
    const [editNote, setEditNote] = useState<Note | undefined>(undefined);

    const edit = (id: string, contents: string, visibility: NoteVisibility) => {
        props.onEdit(id, contents, visibility);
    };

    const renderNote = (note: Note) => {
        const visibility =
            note.visibility === 'PUBLIC' ? 'Public' : note.visibility === 'PRIVATE' ? 'Private' : 'Shared with DM';
        return (
            <>
                <Box key={note.id} padding="1em">
                    <Flex justify="space-between">
                        <Box>
                            {note.contents
                                .split('\n')
                                .map((el, index) =>
                                    el === '' ? <Box height="0.5em" /> : <Text key={index}>{el}</Text>
                                )}
                        </Box>
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
                <Heading size="lg">Your notes</Heading>
                <Box marginLeft="0.5em">
                    <NotesCreateDrawer onCreate={props.onCreate} />
                </Box>
            </Flex>
            <Box marginBottom="2em">{props.notes.map(renderNote)}</Box>
            {props.sharedNotes.length > 0 && (
                <Box marginBottom="1em">
                    <Heading size="lg">Notes by others</Heading>
                </Box>
            )}
            {props.sharedNotes.length > 0 && <Box marginBottom="2em">{props.sharedNotes.map(renderNote)}</Box>}
            {editNote !== undefined && (
                <NotesEditDrawer
                    note={editNote}
                    onEdit={edit}
                    onClose={() => setEditNote(undefined)}
                    onDelete={props.onDelete}
                />
            )}
        </Box>
    );
};
