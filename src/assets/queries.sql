--QUERY FOR GET ALL POSTS--

SELECT
  posts.id, 
  posts.name, 
  posts.price, 
  posts.featuredImageData, 
  users.username AS username, 
  users.avatar AS avatar, 
  users.phone AS phone
FROM posts 
  INNER JOIN users ON posts.userId = users.id
WHERE post.userId != 1
ORDER BY posts.id DESC


--QUERY FOR GET ALL CATEGORIES---
SELECT * FROM categories

--QUERY FOR GET PSPECIFIC POST---
SELECT 
  posts.name, 
  posts.price, 
  posts.description, 
  posts.featuredImageData, 
  users.username, 
  users.avatar, 
  users.phone
FROM posts 
  INNER JOIN users ON posts.userId = users.id
WHERE posts.id =  1

--QUERY GET POSTS BY SPECIFICS ID---
SELECT 
  posts.name,
  posts.price, 
  posts.featuredImageData, 
  users.username
FROM posts 
  INNER JOIN users ON posts.userId = users.id
WHERE posts.id IN (1, 2, 3)
ORDER BY posts.id DESC

--QUERY FOR GET MULTEMEDIA FROM POST--
SELECT mediaData FROM multimedia WHERE multimedia.postId = 1

--QUERY FOR GET BOOKMARS FROM SPECIFIC USER--
SELECT postId FROM bookmarks WHERE userId = 1

--QUERY FOR GET USER BY EMAIL OR USERNAME--
SELECT * FROM users WHERE email = 'test@mail.com' OR username = 'usertest'

--QUERY FOR GET USER AND VALIDATE--
SELECT * FROM users WHERE username = 'usertest' AND password = 'passtest'

--QUERY FOR GET POST FROM CATEGORY--
SELECT 
  posts.id, 
  posts.name, 
  posts.price, 
  posts.featuredImageData, 
  users.username AS username, 
  users.avatar AS avatar, 
  users.phone AS phone
FROM posts 
  INNER JOIN users ON posts.userId = users.id
WHERE posts.categoryId = 3
ORDER BY posts.id DESC

--QUERY FOR GET POST BY A NAME--
SELECT 
  posts.id, 
  posts.name, 
  posts.price, 
  posts.featuredImageData, 
  users.username AS username, 
  users.avatar AS avatar, 
  users.phone AS phone
FROM posts 
  INNER JOIN users ON posts.userId = users.id
WHERE posts.name LIKE 'tesla'
ORDER BY posts.id DESC

--QUERY FOR INSERT NEW POST--
INSERT INTO posts
  (name, description, price, userId, categoryId, featuredImageData)
VALUES
  ('Audi K5', 'Venta de carro Audi K5', 34000, 1, 2, 'urlImagen')

--QUERY FOR INSERT MULTIMEDIA--
INSERT INTO multimedia
(postId, mediaData) VALUES
(1, 'ulImg');

--QUERY FOR INSERT USERS--
INSERT INTO users
  (name, username, avatar, phone, password, email)
VALUES
  ('John', 'johndoe', 'urlImg', '809-234-2423', '****', 'mailTest')

--QUERY FOR UPDATE USERS--
UPDATE users 
  SET 
    name = 'test',
    username = 'usertest', 
    avatar = 'urlImg', 
    phone = '809-234-234-2343', 
    password = '****', 
    email = 'mail@test' 
WHERE id = 1 