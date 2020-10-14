import {
    Box,
    Card,
    CardActions,
    CardContent,
    Grid,
    IconButton,
    makeStyles,
    Paper,
    Typography
} from '@material-ui/core';
import { Add, CompareArrows, Delete } from '@material-ui/icons';
import React from 'react';

import { history } from '../../../config/state';
import { Relation, RelationCandidate } from '../../../types/relation.types';

interface Props {
    relations: Relation[];
    self: RelationCandidate;
    otherToLink: (id: string) => string;
    onAddRelations: (orig: RelationCandidate, dest: RelationCandidate, relation: string) => void;
    onDeleteRelation: (id: string) => void;
    relationCandidates: RelationCandidate[];
}

const useStyles = makeStyles({
    card: {
        padding: '0.2em'
    },
    cardContent: {
        paddingBottom: '0.2em',
        wordWrap: 'break-word'
    },
    addPaper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',

        marginTop: '1em',
        marginBottom: '1em'
    },
    container: {
        marginBottom: '1em'
    }
});

export const Relations = (props: Props) => {
    const styles = useStyles();
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
            <Typography variant="h5">Relations</Typography>
            {props.relations.length > 0 && (
                <Grid container spacing={2}>
                    {props.relations.map(renderRelationGI)}
                </Grid>
            )}
            <Paper className={styles.addPaper}>
                <IconButton onClick={console.log}>
                    <Add />
                </IconButton>
            </Paper>
        </Box>
    );
};
