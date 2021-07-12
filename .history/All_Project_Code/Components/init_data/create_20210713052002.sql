
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS activities;

CREATE TABLE IF NOT EXISTS users(
  user_id SERIAL PRIMARY KEY,
  firstname VARCHAR(30),
  lastname VARCHAR(30),
  username VARCHAR(30) UNIQUE,
  email VARCHAR(30) UNIQUE,
  user_password VARCHAR(20) NOT NULL
);

INSERT INTO users (firstName, lastName, username, email, user_password)
VALUES ('Big','Boss','admin','admin@123.com','admin'),
('Sean', 'Lowry', 'selo', 'selo4751@colorado.edu', 'password'),
('David', 'Farrow', 'dafa', 'dafa9718@colorado.edu', 'password'),
('Xiang', 'Chen', 'xich', 'xich4932@colorado.edu', 'password');

CREATE TABLE IF NOT EXISTS posts(
  post_id SERIAL PRIMARY KEY,
  author_id INT NOT NULL,
  title VARCHAR(50),
  img_src TEXT,
  summary VARCHAR(255),
  full_desc TEXT,
  FOREIGN KEY (author_id)
    REFERENCES users(user_id)
);

INSERT INTO  posts(author_id, title, summary, full_desc)
VALUES (1, 'PostTitle', 'This is the brief description of the post', 'And this will be a longer description'),
(2,'Hiking?', 'Looking for someone interested in hiking', 'join us via XXXXXXXXX'),
(2,'lost shoe', 'I lost my shoe during snowboarding', 'please contact me when you found it'),
(3,'how much is the ticket for fishing?', '', 'Me and friends plan to go there this week'),
(3,'Any party tonight?', '', ''),
(4,'Will CS final cancelled due to the upcoming storm', '', 'I really appreciate ');


CREATE TABLE IF NOT EXISTS messages(
  message_id SERIAL PRIMARY KEY,
  author_id INT NOT NULL,
  recipient_id INT NOT NULL,
  body TEXT NOT NULL,
  FOREIGN KEY (author_id)
    REFERENCES users(user_id),
  FOREIGN KEY (recipient_id)
    REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS comments(
  comment_id SERIAL PRIMARY KEY,
  post_id INT NOT NULL,
  author_id INT NOT NULL,
  img_src TEXT,
  body VARCHAR(255),
  FOREIGN KEY (author_id)
    REFERENCES users(user_id),
  FOREIGN KEY (post_id)
    REFERENCES posts(post_id)
);

INSERT INTO comments(post_id, author_id, body)
VALUES(1,1,'first comment');

/*
members implement with member id&id&id to record who join the activities
*/

CREATE TABLE IF NOT EXISTS activities(
  activity_id SERIAL PRIMARY KEY,
  manager_id INT NOT NULL,
  member_ids INT[],
  title VARCHAR(30) NOT NULL,
  activity_date DATE NOT NULL,
  acitivity_time TIMESTAMPTZ NOT NULL,
  description TEXT NOT NULL,
  FOREIGN KEY (manager_id)
    REFERENCES users(user_id)
);

INSERT INTO activities(manager_id,title ,activity_date, acitivity_time, description)
VALUES(1, 'first activity','20210707', '2021-07-07 12:00:00', 'no idea');
