CREATE TABLE cookies (
    value VARCHAR(32) PRIMARY KEY,
    owner integer NOT NULL,
    expires TIMESTAMP NOT NULL,
    FOREIGN KEY (owner)
        REFERENCES users (id)
        ON DELETE CASCADE
);
