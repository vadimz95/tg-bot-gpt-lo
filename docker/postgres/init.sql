CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY,
    username TEXT,
    first_name TEXT,
    last_name TEXT
);

CREATE TABLE IF NOT EXISTS photos (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    caption TEXT,
    photo_path TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    media_group_id TEXT
);
