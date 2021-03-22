import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { eventActions } from '../../store/actions';
import { eventsLoadingSelector, RootState } from '../../store/reducers';
import { EventLine } from '../molecules/EventLine';
import { EventCreateDrawer } from './EventCreateDrawer';

interface Props {
    campaignId: string;
}

export const CampaignEventList = (props: Props) => {
    const dispatch = useDispatch();
    const loading = useSelector(eventsLoadingSelector);
    const campaign = useSelector((state: RootState) => state.campaign.campaign);
    const events = useSelector((state: RootState) => state.events.events);

    useEffect(() => {
        dispatch(eventActions.actions.fetchEvents(props.campaignId));
    }, [dispatch, props.campaignId]);

    const create = (name: string, description: string) => {
        dispatch(eventActions.actions.createEvent({ campaignId: props.campaignId, name, description }));
    };

    const edit = (id: string, name: string, description: string) => {
        dispatch(eventActions.actions.editEvent({ id, name, description }));
    };

    const del = (id: string) => {
        dispatch(eventActions.actions.deleteEvent(id));
    };

    if (loading || props.campaignId !== campaign?.id) {
        return <></>;
    }
    return (
        <div>
            <EventCreateDrawer onCreate={create} />
            {events.map((e) => (
                <EventLine key={e.id} event={e} campaignId={props.campaignId} onDelete={del} onEdit={edit} />
            ))}
        </div>
    );
};
