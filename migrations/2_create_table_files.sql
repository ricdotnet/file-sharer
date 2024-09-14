create table if not exists files (
  id integer primary key auto_increment,
  filename varchar(255) not null,
  owner integer not null,
  foreign key (owner)
    references users (id)
    on delete cascade
);
