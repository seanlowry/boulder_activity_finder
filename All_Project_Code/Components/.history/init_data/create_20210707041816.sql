DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users{
    name PRIMARY VARCHAR(20),
    email VARCHAR(30) NOT NULL,
    pwd VARCHAR(20) NOT NULL
};

DROP TABLE IF EXISTS posts;
CREATE TABLE IF NOT EXISTS posts{
    activity_name PRIMARY VARCHAR(40),
    description VARCHAR(30) NOT NULL,
    date DATE,
};

INSERT INTO user(name, email, pwd)
VALUES("admin", "admin@abc.com", "admin");

