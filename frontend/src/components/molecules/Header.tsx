import './Header.scss';

import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import * as React from 'react';
import { connect } from 'react-redux';

import { applicationActions } from '../../store/actions';
import { PersonaeNoCircleIcon } from '../../assets/svg/PersonaeNoCircleIcon';
import { Box } from '@material-ui/core';

interface Props {
    className?: string;
    leftContent?: JSX.Element;
    logout: () => void;
}

const HeaderRaw = (props: Props) => (
    <AppBar position="fixed" className={props.className}>
        <Toolbar>
            <div className="Header__content">
                {props.leftContent || (
                    <Box className="Header__side">
                        <PersonaeNoCircleIcon
                            className={'Header__icon'}
                            width={'2em'}
                            height={'2em'}
                            fill={'#ffffff'}
                        />
                        <Typography variant="h6" color="inherit">
                            Dramatis Personae
                        </Typography>
                    </Box>
                )}

                <div className="Header__side">
                    <Button variant="contained" color="primary" onClick={props.logout}>
                        Logout
                    </Button>
                </div>
            </div>
        </Toolbar>
    </AppBar>
);

export const Header = connect(null, { logout: applicationActions.actions.logout })(HeaderRaw);
