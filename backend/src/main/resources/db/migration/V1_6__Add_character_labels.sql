create table if not exists label (id uuid not null, is_visible boolean not null, name varchar(255), campaign_id uuid, primary key (id))
create table if not exists character_label (character_id uuid not null, label_id uuid not null)

alter table campaign add column allow_user_label_management boolean not null default false;
alter table campaign add column allow_user_character_label_management boolean not null default false;

alter table label add constraint label_campaign_id_ref foreign key (campaign_id) references campaign;
alter table character_label add constraint character_label_label_id_ref foreign key (label_id) references label;
alter table character_label add constraint character_label_character_id_ref foreign key (character_id) references _character;
