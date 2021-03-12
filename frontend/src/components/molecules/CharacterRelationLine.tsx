import { Flex, Link as ChakraLink, ListItem, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

import { characterRoute } from '../../config/constants';
import { Relation, RelationCandidate } from '../../types/relation.types';

interface Props {
    campaignId: string;
    characterId: string;
    relation: Relation;
    onDelete: () => void;
}

export const CharacterRelationListItem = (props: Props) => {
    const { origin, destination } = props.relation;

    const transformCharacterName = (can: RelationCandidate, capitalize: boolean) =>
        can.id === props.characterId ? (
            <Text>{capitalize ? 'T' : 't'}his character</Text>
        ) : (
            <Link to={characterRoute(props.campaignId, can.id)}>
                <Text as="u">{can.name}</Text>
            </Link>
        );

    return (
        <ListItem>
            <Flex>
                {transformCharacterName(origin, true)}
                <Text mx={1}>{props.relation.relation}</Text>
                {transformCharacterName(destination, false)}
                <Text ml={1}>
                    (
                    {
                        <ChakraLink onClick={props.onDelete}>
                            <Text as="u">remove</Text>
                        </ChakraLink>
                    }
                    )
                </Text>
            </Flex>
        </ListItem>
    );
};
