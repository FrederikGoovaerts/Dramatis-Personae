import { CreateEventPayload, EditEventPayload, Event } from '../../types/event.types';
import { ActionTypeMapping, ActionUnion, createAction } from './base';

export enum names {
    fetchEvents = 'FETCH_EVENTS',
    createEvent = 'CREATE_EVENT',
    editEvent = 'EDIT_EVENT',
    deleteEvent = 'DELETE_EVENT',
    setLoading = 'SET_EVENTS_LOADING',
    setEvents = 'SET_EVENTS'
}

export const actions = {
    fetchEvents: (p: string) => createAction(names.fetchEvents, p),
    createEvent: (p: CreateEventPayload) => createAction(names.createEvent, p),
    editEvent: (p: EditEventPayload) => createAction(names.editEvent, p),
    deleteEvent: (p: string) => createAction(names.deleteEvent, p),
    setLoading: (p: boolean) => createAction(names.setLoading, p),
    setEvents: (p: Event[]) => createAction(names.setEvents, p)
};

export type allTypes = ActionUnion<typeof actions>;
export type specificTypes = ActionTypeMapping<typeof actions>;
