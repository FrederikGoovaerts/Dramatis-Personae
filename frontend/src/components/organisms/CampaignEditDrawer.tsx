import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Input,
    Link,
    ListItem,
    Text,
    UnorderedList
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { joinRoute } from '../../config/constants';
import { campaignActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { Campaign } from '../../types/campaign.types';
import { ConfirmableButton } from '../atoms/ConfirmableButton';

interface Props {
    campaign: Campaign | undefined;
    onEdit: (id: string, name: string) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}

export const CampaignEditDrawer = (props: Props) => {
    const dispatch = useDispatch();
    const [name, setName] = useState(props.campaign?.name);
    const members = useSelector((state: RootState) => state.campaign.members);
    const membersLoading = useSelector((state: RootState) => state.campaign.membersLoading);

    useEffect(() => {
        if (props.campaign !== undefined) {
            dispatch(campaignActions.actions.fetchMembers(props.campaign.id));
        }
    }, [dispatch, props.campaign]);

    useEffect(() => {
        setName(props.campaign?.name);
    }, [props.campaign]);

    const save = () => {
        if (props.campaign && name !== undefined) {
            props.onEdit(props.campaign.id, name);
            props.onClose();
        }
    };

    const del = () => {
        if (props.campaign) {
            props.onDelete(props.campaign.id);
            props.onClose();
        }
    };

    const kick = (userId: string) => {
        if (props.campaign) {
            dispatch(campaignActions.actions.kickFromCampaign({ campaignId: props.campaign.id, userId }));
            props.onClose();
        }
    };

    const rotateInviteCode = () => {
        if (props.campaign) {
            dispatch(campaignActions.actions.rotateInviteCode(props.campaign.id));
            props.onClose();
        }
    };

    return (
        <Drawer isOpen={props.campaign !== undefined} onClose={props.onClose} size="lg">
            <DrawerOverlay>
                <DrawerContent>
                    <DrawerHeader>Edit campaign</DrawerHeader>
                    <DrawerBody>
                        <Text marginY="1em">Name:</Text>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Campaign name" />
                        {!membersLoading && members.length > 0 && (
                            <>
                                <Text marginY="1em">Members:</Text>
                                <UnorderedList mt={3}>
                                    {members.map((m) => (
                                        <ListItem key={m.id}>
                                            {m.name} (
                                            <Link onClick={() => kick(m.id)}>
                                                <Text as="u">kick</Text>
                                            </Link>
                                            )
                                        </ListItem>
                                    ))}
                                </UnorderedList>
                                <Text my={3}>Invite link:</Text>
                                {props.campaign?.inviteCode && (
                                    <>
                                        <Text>{window.location.origin + joinRoute(props.campaign?.inviteCode)}</Text>
                                        <Button onClick={rotateInviteCode}>Reset Invite link</Button>
                                    </>
                                )}
                            </>
                        )}
                    </DrawerBody>
                    <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={props.onClose}>
                            Close
                        </Button>
                        <Box mr={3}>
                            <ConfirmableButton onConfirm={del} defaultText="Delete" />
                        </Box>
                        <Button onClick={save} disabled={name === ''}>
                            Save
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    );
};
