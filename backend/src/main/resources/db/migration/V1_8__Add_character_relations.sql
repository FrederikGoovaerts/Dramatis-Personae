create table if not exists character_relation (id uuid not null, relation text not null, origin_id uuid, destination_id uuid, primary key (id));

alter table character_relation add constraint character_relation_origin_id_ref foreign key (origin_id) references _character;
alter table character_relation add constraint character_relation_destination_id_ref foreign key (destination_id) references _character;
