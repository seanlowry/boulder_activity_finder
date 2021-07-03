DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users{
    fullname PRIMARY VARCHAR(20),
    email VARCHAR(30) NOT NULL,
    password VARCHAR(20) NOT NULL
};

DROP TABLE IF EXISTS posts;
CREATE TABLE IF NOT EXISTS posts{
    activity_name PRIMARY VARCHAR(40),
    description VARCHAR(30) NOT NULL,
    date DATE,
};

INSERT INTO  users(fullname, email, password)


