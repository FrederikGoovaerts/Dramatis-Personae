import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import App from './components/App';
import { history, store } from './config/state';
// import { theme } from './config/theme';

const theme = extendTheme({});

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <ChakraProvider theme={theme}>
                {/* <MuiThemeProvider theme={theme}> */}
                <App />
                {/* </MuiThemeProvider> */}
            </ChakraProvider>
        </Router>
    </Provider>,
    document.getElementById('root')
);
