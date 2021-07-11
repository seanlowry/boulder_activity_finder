DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users(
    name VARCHAR(20) PRIMARY KEY,
    email VARCHAR(30) NOT NULL,
    pwd VARCHAR(20) NOT NULL
);

DROP TABLE IF EXISTS posts;
CREATE TABLE IF NOT EXISTS posts{
    activity_name PRIMARY VARCHAR(40),
    description VARCHAR(30) NOT NULL,
    date DATE,
};

INSERT INTO users(name, email, pwd)
VALUES('admin', 'admin@123.com', 'admin');
