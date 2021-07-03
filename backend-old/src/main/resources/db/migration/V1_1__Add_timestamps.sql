 alter table _character add column added_on timestamp with time zone not null default CURRENT_TIMESTAMP;
 alter table note add column added_on timestamp with time zone not null default CURRENT_TIMESTAMP;
 alter table note add column edited_on timestamp with time zone not null default CURRENT_TIMESTAMP;
