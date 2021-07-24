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
  activity_date DATE NOT NULL,
  activity_time TIME WITH TIME ZONE NOT NULL,
  user_region TEXT NOT NULL,
  update_date DATE NOT NULL,
  update_time TIME WITH TIME ZONE NOT NULL,
  FOREIGN KEY (manager_id)
    REFERENCES users(user_id)
);

INSERT INTO activities(manager_id, member_ids, title, summary, body, activity_time, activity_date, user_region, update_time, update_date)
VALUES(1,'{1,2,3}', 'Pick-Up Basketball Game', 'We are wanting to play some 5v5', 'just a friendly game of basketball', '18:00:00 MST', '2021-07-20', 'America/Denver', '18:30:00', '2021-07-10'),
(1,'{1,2,3,4}', 'Hiking Mt. Elbert', 'I have a small group that is going to be hiking this mountain next weekend', 'We are willing to work out a carpool situation to get out to the trail together', '06:00:00 MST', '2021-07-25', 'America/Denver', '18:30:00 MST', '2021-07-02');

CREATE TABLE IF NOT EXISTS posts(
  post_id SERIAL PRIMARY KEY,
  author_id INT NOT NULL,
  title VARCHAR(50),
  summary VARCHAR(256),
  img_src TEXT,
  body TEXT,
  update_date DATE NOT NULL,
  update_time TIME WITH TIME ZONE NOT NULL,
  FOREIGN KEY (author_id)
    REFERENCES users(user_id)
);

INSERT INTO  posts(author_id, title, summary, body, update_time, update_date)
VALUES (1, 'Sample Title', 'This is the brief description of the post (limit 256 characters)', 'And this can be a longer description', CURRENT_TIME, CURRENT_DATE),
(2,'Hiking?', 'Looking for someone interested in hiking', 'join us via XXXXXXXXX', CURRENT_TIME, CURRENT_DATE),
(2,'lost shoe', 'I lost my shoe during snowboarding', 'please contact me when you found it', CURRENT_TIME, CURRENT_DATE),
(3,'how much is the ticket for fishing?', '', 'Me and friends plan to go there this week', CURRENT_TIME, CURRENT_DATE),
(3,'Any party tonight?', '', '', CURRENT_TIME, CURRENT_DATE),
(4,'Will CS final cancelled due to the upcoming storm', '', 'I really appreciate ', CURRENT_TIME, CURRENT_DATE);


CREATE TABLE IF NOT EXISTS messages(
  message_id SERIAL PRIMARY KEY,
  author_id INT NOT NULL,
  recipient_id INT NOT NULL,
  body TEXT NOT NULL,
  send_date DATE NOT NULL,
  send_time TIME WITH TIME ZONE NOT NULL,
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
  update_date DATE NOT NULL,
  update_time TIME WITH TIME ZONE NOT NULL,
  FOREIGN KEY (author_id)
    REFERENCES users(user_id),
  FOREIGN KEY (post_id)
    REFERENCES posts(post_id)
);

INSERT INTO comments(post_id, author_id, commentee_ids, body, update_time, update_date)
VALUES(1,1,1,'first comment', CURRENT_TIME, CURRENT_DATE);
