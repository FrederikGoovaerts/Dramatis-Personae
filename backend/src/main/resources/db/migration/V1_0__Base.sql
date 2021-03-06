create table _character (id uuid not null, description text, is_visible boolean not null, name varchar(255), campaign_id uuid, primary key (id));
create table _user (id uuid not null, email varchar(255), full_name varchar(255), google_id varchar(255), primary key (id));
create table campaign (id uuid not null, invite_code uuid, name varchar(255), owner_id uuid, primary key (id));
create table campaign__user (campaign_id uuid not null, members_id uuid not null);
create table note (id uuid not null, contents text, author_id uuid, character_id uuid, primary key (id));
alter table if exists _character add constraint char_campaign_id_ref foreign key (campaign_id) references campaign;
alter table if exists campaign add constraint campaign_owner_id_ref foreign key (owner_id) references _user;
alter table if exists campaign__user add constraint campaign_members_id_ref foreign key (members_id) references _user;
alter table if exists campaign__user add constraint members_campaign_id_ref foreign key (campaign_id) references campaign;
alter table if exists note add constraint note_author_id_ref foreign key (author_id) references _user;
alter table if exists note add constraint note_character_id_ref foreign key (character_id) references _character;
