alter table if exists note rename to character_note;

create table campaign_note (
    id uuid not null,
    contents text not null,
    author_id uuid not null,
    campaign_id uuid not null,
    visibility varchar(20) not null,
    added_on timestamp with time zone not null,
    edited_on timestamp with time zone not null,
    primary key (id)
);
alter table if exists campaign_note add constraint note_author_id_ref foreign key (author_id) references _user;
alter table if exists campaign_note add constraint note_campaign_id_ref foreign key (campaign_id) references campaign;

