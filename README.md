# Project for Web Software Development course in Aalto

## Running the project

### Creating the database
Create the database by running the following CREATE TABLE commands in your own database:  

CREATE TABLE users (  
  id SERIAL PRIMARY KEY,  
  email VARCHAR(320) NOT NULL,  
  password CHAR(60) NOT NULL  
);  

CREATE UNIQUE INDEX ON users((lower(email)));  

CREATE TABLE health_reports (  
    id SERIAL PRIMARY KEY,  
    date DATE,  
    mood INTEGER,  
    sleep_duration FLOAT,  
    sleep_quality INTEGER,  
    exercise_time FLOAT,  
    study_time FLOAT,  
    eating_quality INTEGER,  
    morning_report BOOLEAN,  
    evening_report BOOLEAN,  
    user_id INTEGER REFERENCES users(id)  
 );  

 ALTER TABLE health_reports ALTER COLUMN morning_report SET DEFAULT false;  

 ALTER TABLE health_reports ALTER COLUMN evening_report SET DEFAULT false;  
 
 ### Running the project locally
 The project can be run locally from the file app.js in the root directory of the project.  
 To run the application locally go to the root directory, you should find the file app.js there.  
 Then run the following command:  
 * `deno run --unstable --allow-env --allow-read --allow-net app.js`    
 
 The application should now be running at http://localhost:7777/  
 
 ### Running tests
 All of the tests can be run with the following command:   
 * `deno test --unstable --allow-env --allow-net`  
 
 The different test files can also be run individually with the following command:
 * `deno test --unstable --allow-env --allow-net ./tests/app_test.js` 
 
 Where ./tests/app_test.js should be replaced with the path of the test file that you want to test.  
 Note that the individual test files can't be run without the path to the file!
 
 ### Access application
 The application is currently running and can be accessed at http://www.some-address.com/  
 
 ## Project requirements implemented in the project
 
 ### Application structure
 
 ### Users
 
 ### Authentication
 
 ### Middleware
 
 ### Reporting
 
 ### Summarization
 
 ### Landing page
 
 ### Testing
 
 ### Security
 
 ### Database
 
 ### User interface / views
 
 ### APIs
 
 ### Deployment
 
 ### Documentation
