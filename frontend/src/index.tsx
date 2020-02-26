import { MuiThemeProvider } from '@material-ui/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import App from './components/App';
import { history } from './config/history';
import configureStore from './config/store';
import { theme } from './config/theme';

const store = configureStore({});

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <MuiThemeProvider theme={theme}>
                <App />
            </MuiThemeProvider>
        </Router>
    </Provider>,
    document.getElementById('root')
);
