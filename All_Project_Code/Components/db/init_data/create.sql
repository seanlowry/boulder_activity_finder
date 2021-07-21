DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS comments;
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

CREATE TABLE IF NOT EXISTS activities(
  activity_id SERIAL PRIMARY KEY,
  manager_id INT NOT NULL,
  member_ids INT[],
  title VARCHAR(30) NOT NULL,
  summary VARCHAR (256) NOT NULL,
  body TEXT NOT NULL,
  activity_time TIMESTAMP WITH TIME ZONE NOT NULL,
  update_time TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY (manager_id)
    REFERENCES users(user_id)
);

INSERT INTO activities(manager_id, member_ids, title, summary, activity_time, body, update_time)
VALUES(1,'{1,2,3}', 'Pick-Up Basketball Game', 'We are wanting to play some 5v5', '2021-07-07 18:00:00', 'just a friendly game of basketball', CURRENT_TIMESTAMP),
(1,'{1,2,3,4}', 'Hiking Mt. Elbert', 'I have a small group that is going to be hiking this mountain next weekend', '2021-07-25 06:00:00', 'We are willing to work out a carpool situation to get out to the trail together', CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS posts(
  post_id SERIAL PRIMARY KEY,
  author_id INT NOT NULL,
  title VARCHAR(50),
  summary VARCHAR(256),
  img_src TEXT,
  body TEXT,
  update_time TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY (author_id)
  REFERENCES users(user_id)
);

INSERT INTO  posts(author_id, title, summary, body, update_time)
VALUES (1, 'Sample Title', 'This is the brief description of the post (limit 256 characters)', 'And this can be a longer description', CURRENT_TIMESTAMP),
(2,'Hiking?', 'Looking for someone interested in hiking', 'join us via XXXXXXXXX', CURRENT_TIMESTAMP),
(2,'lost shoe', 'I lost my shoe during snowboarding', 'please contact me when you found it', CURRENT_TIMESTAMP),
(3,'how much is the ticket for fishing?', '', 'Me and friends plan to go there this week', CURRENT_TIMESTAMP),
(3,'Any party tonight?', '', '', CURRENT_TIMESTAMP),
(4,'Will CS final cancelled due to the upcoming storm', '', 'I really appreciate ', CURRENT_TIMESTAMP);


CREATE TABLE IF NOT EXISTS messages(
  message_id SERIAL PRIMARY KEY,
  author_id INT NOT NULL,
  recipient_id INT NOT NULL,
  body TEXT NOT NULL,
  send_time TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY (author_id)
    REFERENCES users(user_id),
  FOREIGN KEY (recipient_id)
    REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS comments(
  comment_id SERIAL PRIMARY KEY,
  post_id INT NOT NULL,
  author_id INT NOT NULL,
  commentee_ids INT NOT NULL,
  img_src TEXT,
  body VARCHAR(255),
  update_time TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY (author_id)
    REFERENCES users(user_id),
  FOREIGN KEY (post_id)
    REFERENCES posts(post_id)
);

INSERT INTO comments(post_id, author_id, commentee_ids, body, update_time)
VALUES(1,1,1,'first comment', CURRENT_TIMESTAMP);
