import { ParsedQuery, stringify } from 'query-string';
import { format } from 'url';

import { api } from '../config/constants';

export function buildPath(resource: string, parameters: ParsedQuery = {}): string {
    const currentRequest = {
        host: api.API_HOST,
        pathname: resource,
        protocol: api.API_PROTOCOL,
        search: stringify(parameters)
    };

    return format(currentRequest);
}
