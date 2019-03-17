CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR,
    username VARCHAR UNIQUE,
    avatar VARCHAR,
    phone VARCHAR,
    password VARCHAR,
    email VARCHAR
);

CREATE TABLE IF NOT EXISTS categories(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR
);

CREATE TABLE IF NOT EXISTS posts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT,
    name VARCHAR,
    price FLOAT,
    userId INTEGER,
    categoryId INTEGER,
    featuredImageData TEXT,
    FOREIGN KEY(userId) REFERENCES user(id),
    FOREIGN KEY(categoryId) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS multimedia(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mediaData TEXT,
    postId INTEGER,
    FOREIGN KEY(postId) REFERENCES posts(id)
);

CREATE TABLE IF NOT EXISTS bookmarks(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    postId INTEGER,
    FOREIGN KEY(userId) REFERENCES user(id),
    FOREIGN KEY(postId) REFERENCES posts(id)
);


INSERT INTO categories(name) VALUES ('Accesorios');
INSERT INTO categories(name) VALUES ('Vehiculos');
INSERT INTO categories(name) VALUES ('Inmuebles');
INSERT INTO categories(name) VALUES ('Electronicos');
INSERT INTO categories(name) VALUES ('Hogar');
