create table if not exists thumbnails (
    id integer primary key auto_increment,
    `name` varchar(255) not null,
    media_id integer not null,
    foreign key (media_id)
        references files (id)
        on delete cascade
);