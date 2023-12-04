create database if not exists ITAcademyDB;
use ITAcademyDB;

create or replace table TrainingTab(
    Id integer not null auto_increment primary key,
    Name varchar(1000) not null,
    Price integer not null,
    Begin date not null default CURRENT_TIMESTAMP,
    End date not null default CURRENT_TIMESTAMP
);
create or replace table UserTab(
    Id integer not null auto_increment primary key,
    Pseudo varchar(1000) not null,
    TrainingId integer,
    constraint `fk_training` foreign key(TrainingId) references TrainingTab(Id)
);

create index User_Pseudo_IDX using BTREE on UserTab(Pseudo);
create index Training_Name_IDX using BTREE on TrainingTab(Name);

create user if not exists 'UserDB'@localhost identified by '1234';

grant select, insert, update, delete
    on UserTab
    to 'UserDB'@localhost;
grant select
    on TrainingTab
    to 'UserDB'@localhost;

FLUSH PRIVILEGES;