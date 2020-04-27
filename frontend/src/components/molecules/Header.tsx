import './Header.scss';

import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { routes } from '../../config/constants';
import { applicationActions } from '../../store/actions';
import { PersonaeNoCircleIcon } from '../../assets/svg/PersonaeNoCircleIcon';

export interface Props {
    logout: () => void;
}

const HeaderRaw = (props: Props) => (
    <AppBar position="absolute" style={{ marginBottom: 100 }}>
        <Toolbar>
            <div className="Header__content">
                <div className="Header__side">
                    <Link to={routes.root}>
                        <PersonaeNoCircleIcon
                            className={'Header__icon'}
                            width={'2em'}
                            height={'2em'}
                            fill={'#ffffff'}
                        />
                    </Link>
                    <Link to={routes.root} className="unstyled">
                        <Typography variant="h6" color="inherit">
                            Dramatis Personae
                        </Typography>
                    </Link>
                </div>

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
