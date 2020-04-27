import { stringify, ParsedUrlQueryInput } from 'querystring';
import { format } from 'url';
import { api } from '../config/constants';

export function buildPath(resource: string, parameters: ParsedUrlQueryInput = {}): string {
    const currentRequest = {
        host: api.API_HOST,
        pathname: resource,
        protocol: api.API_PROTOCOL,
        search: stringify(parameters)
    };

    return format(currentRequest);
}
