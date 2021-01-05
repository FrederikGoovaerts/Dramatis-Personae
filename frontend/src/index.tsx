import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import App from './components/App';
import { history, store } from './config/state';

const theme = extendTheme({
    fonts: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif'
    },
    textStyles: {
        title: {
            fontSize: ['24px', '28px'],
            fontWeight: 'semibold'
        }
    }
});

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <ChakraProvider theme={theme}>
                <App />
            </ChakraProvider>
        </Router>
    </Provider>,
    document.getElementById('root')
);
