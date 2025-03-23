create table if not exists user_upload_defaults (
  user integer primary key,
  is_private boolean default true,
  foreign key (user)
    references users (id)
    on delete cascade
);
