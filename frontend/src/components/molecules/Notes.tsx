import * as React from 'react';
import {
    Box,
    ListItem,
    ListItemText,
    Tooltip,
    ListItemIcon,
    ListItemSecondaryAction,
    IconButton,
    Divider,
    Paper,
    List,
    Typography,
    Modal
} from '@material-ui/core';
import { Note } from '../../types/note.types';
import { VisibilityOff, Edit, Add } from '@material-ui/icons';
import { NewNoteForm } from './NewNoteForm';
import { EditNoteForm } from './EditNoteForm';

interface Props {
    campaignOwner: boolean;
    notes: Note[];
    sharedNotes: Note[];
}

interface State {
    createOpen: boolean;
    editNote: Note | undefined;
}

class NotesRaw extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { createOpen: false, editNote: undefined };
    }

    closeCreate = () => {
        this.setState({ createOpen: false });
    };

    closeEdit = () => {
        this.setState({ editNote: undefined });
    };

    renderCreate = () => (
        <NewNoteForm
            className="CharacterDetail__modalContainer"
            onSubmitComplete={this.closeCreate}
            create={console.log}
        />
    );

    renderEdit = () => {
        if (!this.state.editNote) {
            return <div />;
        }
        return (
            <EditNoteForm
                note={this.state.editNote}
                onSubmitComplete={this.closeEdit}
                editCharacterNote={console.log}
                deleteCharacterNote={console.log}
            />
        );
    };

    renderNote = (note: Note, own: boolean) => {
        const openEdit = () => this.setState({ editNote: note });
        return (
            <div key={note.id} className="CharacterDetail__note">
                <ListItem>
                    <ListItemText
                        primary={note.contents}
                        primaryTypographyProps={{ align: 'justify', className: 'CharacterDetail__noteContents' }}
                        secondary={`Created ${note.addedOn.fromNow()}, last edited ${note.editedOn.fromNow()}${
                            !own ? `, by ${note.authorName}` : ''
                        }`}
                    />
                    {!own && note.visibility === 'DM_SHARED' && (
                        <ListItemIcon>
                            <Tooltip title="Shared with DM only">
                                <VisibilityOff />
                            </Tooltip>
                        </ListItemIcon>
                    )}
                    {(own || this.props.campaignOwner) && (
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={openEdit}>
                                <Edit />
                            </IconButton>
                        </ListItemSecondaryAction>
                    )}
                </ListItem>
            </div>
        );
    };

    renderOwnNote = (note: Note) => this.renderNote(note, true);

    renderSharedNote = (note: Note) => this.renderNote(note, false);

    renderNotes = (renderedNotes: JSX.Element[]) => {
        for (let i = 1; i < renderedNotes.length; i = i + 2) {
            renderedNotes.splice(i, 0, <Divider key={`divider${i}`} />);
        }
        return (
            <Paper>
                <List>{renderedNotes}</List>
            </Paper>
        );
    };

    renderOwnNotes = () => {
        const openCreate = () => this.setState({ createOpen: true });
        const renderedNotes = [
            ...this.props.notes.map(this.renderOwnNote),
            <div key={'addButton'} className="CharacterDetail__note">
                <ListItem className="CharacterDetail__addButtonItem">
                    <IconButton edge="end" color="primary" onClick={openCreate}>
                        <Add />
                    </IconButton>
                </ListItem>
            </div>
        ];
        return this.renderNotes(renderedNotes);
    };

    renderSharedNotes = () => this.renderNotes(this.props.sharedNotes.map(this.renderSharedNote));

    render() {
        return (
            <Box>
                <Box marginBottom="1em">
                    <Typography variant="h5">Your notes</Typography>
                </Box>
                <Box marginBottom="2em">{this.renderOwnNotes()}</Box>
                {this.props.sharedNotes.length > 0 && (
                    <Box marginBottom="1em">
                        <Typography variant="h5">Notes by others</Typography>
                    </Box>
                )}
                {this.props.sharedNotes.length > 0 && <Box marginBottom="2em">{this.renderSharedNotes()}</Box>}
                <Modal open={this.state.createOpen} onClose={this.closeCreate}>
                    <div className="modal">{this.renderCreate()}</div>
                </Modal>
                <Modal open={this.state.editNote !== undefined} onClose={this.closeEdit}>
                    <div className="modal">{this.renderEdit()}</div>
                </Modal>
            </Box>
        );
    }
}

export const Notes = NotesRaw;
