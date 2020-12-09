# Project for Web software development course in Aalto

## Creating the database
* Create the database by running the following CREATE TABLE commands:

* CREATE TABLE users (
*  id SERIAL PRIMARY KEY,
*  email VARCHAR(320) NOT NULL,
*  password CHAR(60) NOT NULL
* );

* CREATE UNIQUE INDEX ON users((lower(email)));

* CREATE TABLE health_reports (
*    id SERIAL PRIMARY KEY,
*    date DATE,
*    mood INTEGER,
*    sleep_duration FLOAT,
*    sleep_quality INTEGER,
*    exercise_time FLOAT,
*    study_time FLOAT,
*    eating_quality INTEGER,
*    morning_report BOOLEAN,
*    evening_report BOOLEAN,
*    user_id INTEGER REFERENCES users(id)
* );

* ALTER TABLE health_reports ALTER COLUMN morning_report SET DEFAULT false;

* ALTER TABLE health_reports ALTER COLUMN evening_report SET DEFAULT false;
