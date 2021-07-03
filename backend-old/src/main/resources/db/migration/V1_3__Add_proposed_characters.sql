create table proposed_character (id uuid not null, description text not null, name varchar(255) not null, proposed_on timestamp with time zone not null, campaign_id uuid not null, proposed_by_id uuid not null, primary key (id));
alter table if exists proposed_character add constraint proposed_char_campaign_id_ref foreign key (campaign_id) references campaign;
alter table if exists proposed_character add constraint proposed_char_owner_id_ref foreign key (proposed_by_id) references _user;
