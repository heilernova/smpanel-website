
-- Author: Heiler Nova

drop schema public cascade;
create schema public;

create extension pgcrypto;
create extension unaccent;

create domain cellphone as varchar check (value ~* '^\+\d+ \d{3} \d{3} \d{4}$');
create domain email as varchar(100) check (value ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');

create type user_role as enum('admin', 'user');

create table users
(
    "id" uuid primary key default gen_random_uuid(),
    "create_at" timestamp not null default now(),
    "update_at" timestamp not null default now(),
    "role" user_role not null default 'user',
    "name" varchar(20) not null,
    "last_name" varchar(20) not null,
    "email" email not null unique,
    "cellphone" cellphone default null,
    "permissions" text[] not null default array[]::text[],
    "password" text
);

-- User default
insert into users values(default, default, 'admin', 'admin', 'Admin', 'Admin', 'admin@admin.com', default, default, '$2b$10$9BWIHew0Alqz3WxwR.Hj9OVEgg1Jn75nCadoq13Mip6TleQeHXd1q');

create table servers
(
    "id" uuid primary key default gen_random_uuid(),
    "create_at" timestamp not null default now(),
    "update_at" timestamp not null default now(),
    "user_id" uuid not null,
    "url" varchar(200) not null unique,
    "username" varchar(100) not null,
    "role" varchar(10) not null,
    "token" uuid
);

alter table servers
    add constraint fk_servers__users
    foreign key (user_id)
    references users(id)
    on delete cascade;
