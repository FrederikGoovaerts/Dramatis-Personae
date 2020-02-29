import { createBrowserHistory } from 'history';
import { hosting } from './constants';

export const history = createBrowserHistory({
    basename: hosting.BASE_URL
});
