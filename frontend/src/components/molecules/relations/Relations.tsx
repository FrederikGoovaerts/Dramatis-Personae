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
            <Grid container spacing={2}>
                {props.relations.map(renderRelationGI)}

                <Grid item xs={6} sm={3} md={2} key="addButton" className={styles.addGridItem}>
                    <Card className={styles.addCard}>
                        <CardContent className={styles.addCardContent}>
                            <IconButton onClick={console.log}>
                                <Add />
                            </IconButton>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};
