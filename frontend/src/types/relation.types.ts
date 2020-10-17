export interface Relation {
    origin: RelationCandidate;
    destination: RelationCandidate;
    relation: string;
    id: string;
}

export interface RelationCandidate {
    id: string;
    name: string;
}
