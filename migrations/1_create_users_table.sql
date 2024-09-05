create table if not exists users (
  id integer primary key auto_increment,
  username varchar(20) not null unique,
  password varchar(255) not null,
  email varchar(255) not null unique,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default null
);
