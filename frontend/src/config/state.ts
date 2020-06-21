import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../store/reducers';
import { rootSaga } from '../store/sagas';

// Redux state
const configureStore = (initialState: object) => {
    const sagaMiddleware = createSagaMiddleware();
    const createdStore = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(sagaMiddleware)));
    sagaMiddleware.run(rootSaga);
    return createdStore;
};

export const store = configureStore({});

// Browser history state
export const history = createBrowserHistory();
