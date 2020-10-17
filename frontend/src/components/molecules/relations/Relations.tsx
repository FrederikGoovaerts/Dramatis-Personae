import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    IconButton,
    Input,
    makeStyles,
    MenuItem,
    Modal,
    Paper,
    Select,
    Typography
} from '@material-ui/core';
import { Add, CompareArrows, Delete } from '@material-ui/icons';
import React, { useState } from 'react';

import { history } from '../../../config/state';
import { Relation, RelationCandidate } from '../../../types/relation.types';

interface Props {
    relations: Relation[];
    self: RelationCandidate;
    otherToLink: (id: string) => string;
    onAddRelation: (orig: RelationCandidate, dest: RelationCandidate, relation: string) => void;
    onDeleteRelation: (id: string) => void;
    relationCandidates: RelationCandidate[];
}

const useStyles = makeStyles({
    container: {
        marginBottom: '1em'
    },
    card: {
        padding: '0.2em'
    },
    cardContent: {
        paddingBottom: '0.2em',
        wordWrap: 'break-word'
    },
    addGridItem: {
        display: 'flex'
    },
    addCard: {
        display: 'flex',
        flex: 1
    },
    addCardContent: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        display: 'flex',
        flexDirection: 'row'
    }
});

export const Relations = (props: Props) => {
    const styles = useStyles();

    const [createOpen, setCreateOpen] = useState(false);

    const handleAdd = (relation: string, other: RelationCandidate) => {
        props.onAddRelation(props.self, other, relation);
    };

    const renderRelationGI = (r: Relation) => (
        <Grid item xs={6} sm={3} md={2} key={`${r.origin.id}${r.relation}${r.destination.id}`}>
            <Card className={styles.card}>
                <CardContent className={styles.cardContent}>
                    <Typography variant="h5">{r.origin.name}</Typography>
                    <Typography variant="body2">{r.relation}</Typography>
                    <Typography variant="h5">{r.destination.name}</Typography>
                </CardContent>

                <CardActions>
                    <IconButton
                        onClick={() =>
                            history.push(
                                props.otherToLink(r.origin.id === props.self.id ? r.destination.id : r.origin.id)
                            )
                        }
                    >
                        <CompareArrows />
                    </IconButton>
                    <IconButton onClick={() => props.onDeleteRelation(r.id)}>
                        <Delete />
                    </IconButton>
                </CardActions>
            </Card>
        </Grid>
    );

    return (
        <Box className={styles.container}>
            <Typography variant="h5" gutterBottom>
                Relations
            </Typography>
            <Grid container spacing={2}>
                {props.relations.map(renderRelationGI)}

                <Grid item xs={6} sm={3} md={2} key="addButton" className={styles.addGridItem}>
                    <Card className={styles.addCard}>
                        <CardContent className={styles.addCardContent}>
                            <IconButton onClick={() => setCreateOpen(true)}>
                                <Add />
                            </IconButton>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <CreateRelationModal
                selfName={props.self.name}
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                relationCandidates={props.relationCandidates}
                onAdd={handleAdd}
            />
        </Box>
    );
};

interface ModalProps {
    open: boolean;
    relationCandidates: RelationCandidate[];
    selfName: string;
    onAdd: (relation: string, other: RelationCandidate) => void;
    onClose: () => void;
}

const CreateRelationModal = (props: ModalProps) => {
    const styles = useStyles();

    const [candidateId, setCandidateId] = useState<string>(props.relationCandidates[0].id);
    const [relation, setRelation] = useState<string>('');

    const handleAdd = () => {
        const candidate = props.relationCandidates.find((c) => (c.id = candidateId));
        if (candidate) {
            props.onAdd(relation, candidate);
        }
    };

    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Box className="modal">
                <Paper className="modalPaper">
                    <Box className="modalContainer">
                        <Box className="modalHeader">
                            <Typography variant="h5">Add relation</Typography>
                        </Box>
                        <Box marginY="1em" marginX="0.5em" display="flex" flexDirection="column">
                            <Box display="flex" flexDirection="row" alignItems="flex-end" marginBottom="0.5em">
                                <Box paddingRight="0.5em" paddingY="0.25em">
                                    <Typography>{props.selfName}</Typography>
                                </Box>
                                <Input
                                    value={relation}
                                    style={{ flex: 1 }}
                                    placeholder="Relation"
                                    onChange={(event) => setRelation(event.target.value)}
                                />
                            </Box>
                            <Select
                                value={candidateId}
                                onChange={(event: React.ChangeEvent<{ value: string }>) =>
                                    setCandidateId(event.target.value)
                                }
                            >
                                {props.relationCandidates.map((c) => (
                                    <MenuItem value={c.id} key={c.id}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <Button variant="contained" color="primary" onClick={handleAdd} className={styles.button}>
                            Create
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Modal>
    );
};
