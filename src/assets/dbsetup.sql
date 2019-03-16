CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY IDENTITY AUTOINCREMENT,
    name VARCHAR,
    username VARCHAR UNIQUE,
    avatar VARCHAR,
    phone VARCHAR,
    password VARCHAR,
    email VARCHAR
);

CREATE TABLE IF NOT EXISTS categories(
    id INTEGER PRIMARY KEY IDENTITY AUTOINCREMENT,
    name VARCHAR
);

CREATE TABLE IF NOT EXISTS posts(
    id INTEGER PRIMARY KEY IDENTITY AUTOINCREMENT,
    description TEXT,
    name VARCHAR,
    price FLOAT,
    userId INTEGER FOREIGN KEY REFERENCES users(id),
    categoryId INTEGER FOREIGN KEY REFERENCES categories(id),
    negotiable BOOLEAN,
    featuredImageData TEXT
);

CREATE TABLE IF NOT EXISTS multimedia(
    id INTEGER PRIMARY KEY IDENTITY AUTOINCREMENT,
    mediaData TEXT,
    postId INTEGER FOREIGN KEY REFERENCES posts(id)
);

CREATE TABLE IF NOT EXISTS bookmarks(
    id INTEGER PRIMARY KEY IDENTITY AUTOINCREMENT,
    userId INTEGER FOREIGN KEY REFERENCES users(id),
    postId ITEGER FOREIGN KEY REFERENCES posts(id)
);