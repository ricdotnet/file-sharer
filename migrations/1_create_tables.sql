create table if not exists users (
  id integer primary key auto_increment,
  username varchar(20) not null unique,
  password varchar(255) not null,
  email varchar(255) not null unique,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default null
);

create table if not exists files (
  id integer primary key auto_increment,
  filename varchar(255) not null,
  owner integer not null,
  foreign key (owner)
    references users (id)
    on delete cascade
);