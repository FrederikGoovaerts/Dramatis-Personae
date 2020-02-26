import { createBrowserHistory } from 'history';
import { environment } from './constants';

export const history = createBrowserHistory({
    basename: environment.BASE_URL
});
