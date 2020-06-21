import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as React from 'react';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        height: '80vh',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export const Landing = () => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <CircularProgress />
        </div>
    );
};
