drop table if exists proposed_character;
alter table campaign rename column auto_accept_proposed_character to allow_player_character_management;
