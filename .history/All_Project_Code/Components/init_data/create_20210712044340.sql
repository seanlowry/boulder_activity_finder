
DROP TABLE IF EXISTS user_details;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS activities;

CREATE TABLE IF NOT EXISTS user_details(
  user_id SERIAL PRIMARY KEY,
  firstName VARCHAR(30),
  lastName VARCHAR(30),
  email VARCHAR(30) UNIQUE,
  user_password VARCHAR(20) NOT NULL,
  
);


INSERT INTO user_details(user_id, firstName, lastName, email, user_password)
VALUES(1,'admin','admin', 'admin@123.com', 'admin');

/*
*/

CREATE TABLE IF NOT EXISTS posts(
  post_id SERIAL PRIMARY KEY,
  author INT NOT NULL,
  title VARCHAR(50),
  img_src TEXT,
  summary VARCHAR(255),
  full_desc TEXT,
  FOREIGN KEY (author)
    REFERENCES user_details(user_id)
);
INSERT INTO  posts(post_id, author, title, summary, full_desc)
VALUES(11,1,'Hiking?', 'Looking for someone interested in hiking', 'join us via XXXXXXXXX');
INSERT INTO  posts(post_id, author, title, summary, full_desc)
VALUES(12,1,'lost shoe', 'I lost my shoe during snowboarding', 'please contact me when you found it');
INSERT INTO  posts(post_id, author, title, summary, full_desc)
VALUES(13,1,'how much is the ticket for fishing?', 'fishing ticket price', 'Me and friends plan to go there this week');
INSERT INTO  posts(post_id, author, title, summary, full_desc)
VALUES(14,1,'Anyone want to do cs review with classmates', 'group now is 4/7', 'please send me xxxxx if you are interested in');
INSERT INTO  posts(post_id, author, title, summary, full_desc)
VALUES(15,1,'Will CS final cancelled due to the upcoming storm', 'Will CS final cancelled due to the upcoming storm', 'I really appreciate ');


CREATE TABLE IF NOT EXISTS messages(
  message_id SERIAL PRIMARY KEY,
  author INT,
  recipient INT,
  body TEXT,
  FOREIGN KEY (author)
    REFERENCES user_details(user_id),
  FOREIGN KEY (recipient)
    REFERENCES user_details(user_id)
);

/*
members implement with member id&id&id to record who join the activities
*/

CREATE TABLE IF NOT EXISTS activities(
  activity_id SERIAL PRIMARY KEY,
  manager VARCHAR(30) NOT NULL,
  members TEXT, 
  activity_name VARCHAR(30) NOT NULL,
  acitivity_time TIMESTAMPTZ
);

INSERT INTO activities(manager, activity_name, acitivity_time)
VALUES('Admin', 'first activity', '2021-07-07 12:00:00');
