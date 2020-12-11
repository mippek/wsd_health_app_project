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
    date TIMESTAMP WITH TIME ZONE,  
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
 * `PGHOST='dbhost' PGDATABASE='db' PGUSER='dbuser' PGPASSWORD='dbpassword' PGPORT=5432 deno run --unstable --allow-env --allow-read --allow-net app.js`    
 
 Where PGHOST is the host of your database, PGDATABASE the database, PGUSER the user of the database(usually same as the database), PGPASSWORD the password 
 for the database and PGPORT the port where the database is running. The environmental variables are the same as those used during the course when setting up our own databases.  
 The application should now be running at http://localhost:7777/  
 
 ### Running tests
 All of the tests can be run at once with the following command:   
 * `PGHOST='dbhost PGDATABASE='db' PGUSER='dbuser PGPASSWORD='dbpassword' PGPORT=5432 deno test --unstable --allow-env --allow-net --allow-read` 
 
 The different test files can also be run individually with the following command:
 * `PGHOST='dbhost' PGDATABASE='db' PGUSER='dbuser' PGPASSWORD='dbpassword' PGPORT=5432 deno test --unstable --allow-env --allow-net --allow-read ./tests/app_test.js` 
 
 Where PGHOST is the host of your database, PGDATABASE the database, PGUSER the user of the database(usually same as the database), PGPASSWORD the password 
 for the database and PGPORT the port where the database is running.  
 While running test files individually ./tests/app_test.js should be replaced with the path of the test file that you want to run test for.  
 Note that the individual test files can't be run without the path to the file!
 
 ### Access application
 The application is currently running and can be accessed at http://www.some-address.com/  
 
 ## Project requirements implemented in the project
 
 ### Application structure
 * The application is divided into logical parts as in the part on Structuring Web Applications in the course material.  
 * All dependencies are exported from deps.js.  
 * Projects is launched from app.js, which can be found in the root folder of the project.  
 * Configurations are in a separate folder, config. Configurations are loaded from environmental variables. Production configurations are added with the environmental variable DATABASE_URL. Otherwise, the configurations for testing and running the program locally are loaded from environmental variables PGPORT, PGDATABASE, PGHOST, PGUSER and PGPASSWORD.  
 
 ### Users
 For each user, email and password are stored in the database. The passwords are stored as a hash counted from the password where the password is encrypted with bcrypt. Emails are unique, each email can only be stored once in the database.  
 Users can register to the application.  
 Registration is at /auth/registration that is accessible to everyone. The registration form has labels for fields to clarify their purpose. The form has a link to the login form. Sending the registration form redirects the user to /auth/login if the registration was successful or if there are some errors renders the registration form again with the errors.  
 The form is validated on the server. The email must be a valid email and password and verification password must be at least 4 characters. The password and verification must naturally be the same. Each of the fields are required. The validation errors are shown on the page, in case of an validation error email field is populated but the password fields are not.  
 The user-specific functionality is structured into logical parts, to userController.js and userService.js where userService makes queries to the database, sets the sessions and contains the validation and encrypting and decrypting functionalities and userController has the functions for handling different requests.   
 
 ### Authentication
 The application uses session-based authentication. At login in the session 'authenticated' is set to true and 'user' is set to a user object with the id and email of the logged-in user. At logout the session is cleared by setting 'autheticated' to false and 'user' to a null object.  
 The login form is acceddible at /auth/login and is accessible to everyone. The login form has two fields, email and password, and it uses labels to clarify the purpose of the fields. The login form has a link to the registration form. If a user types in an invalid email or password, the text 'invalid email or password' is shown on the page but the form fields are not populated. Sending the login form redirects the user to the main page, /, if the login wass successful or if there were some errors renders the login form again with the errors.  
 Authentication functionality is structured into logical parts. Functions handling authentication are added to the userController.js and userService.js and are divided similarly as the registration functionality is.  
 The application has a logout button that logs out the user and cleans out the session by setting 'authentication' to false and 'user' to null object in the session. Logout functionality is at /auth/logout. Logging out redirects the user to the main page, /.   
 
 ### Middleware
 The application has middleware for logging all the errors that occurred.  
 The application has middleware that logs all requests made to the application. The middleware logs the request method, requested path, current time(time of the request) containing the date and the time and the user id of the logged-in user or anonymous if the user is not logged in.  
 The application has middleware to control access to the application. Landing page /, paths starting with /api and paths starting with /auth are accessible to all. Other paths are not and require that the user has logged in and is authenticated. Requests by non-authenticated users to addresses that need authentication are redirected to /auth/login.  
 The application has middleware that controls access to static files. All static files, code.js and style.css, are placed under /static.  
 The middleware functionality is structured into logical parts, all middleware can be found in a separate middlewares folder.  
 
 ### Reporting
 Reporting functionality is available at /behavior/reporting.  
 Reporting can not be done if the user is not authenticated, all requests to /reporting/behavior by non-authenticated users are redirected to /auth/login.  
 When accessing /behavior/reporting, the user can choose whether morning or evening reporting is being reported. The page contains two buttons, morning report and evening report. The button morning report shows the morning report form  with morning reporting questions at /behavior/reporting/morning and the button evening report shows the evening report form with evening reporting questions at /behavior/reporting/evening. The page /behavior/reporting shows under the two buttons whether morning report or evening report or both has already been done for today.  
 The morning reporting form at /behavior/reporting/morning contains fields for date, sleep duration, sleep quality and generic mood. The date is populated by default to today but can be changed to a another date between 2017-01-01 and 2020-12-31. The date field in the form is of input type date. Sleep duration is reported in hours with 0.5 hours accuracy, the sleep duration can contain one decimal. The sleep duration field is of input type number. Sleep quality and generic mood are reported with a number from 1 to 5, where 1 is very poor and 5 is very good. The sleep quality and mood fields are of type range (are sliders). All fields are required. Each field has labels that clarify the purposes of the fields and accepted values. The form fields are validated, sleep duration must be a number and can't be negative and sleep quality and mood must be reported as integers between 1 and 5. In case of validation errors, form fields are populated.  
 The evening reporting form at /behavior/reporting/evening contains fields for date, time spent on exercise (and sports), time spent studying, quality (and reqularity) of eating and generic mood. The date is populated by default to today but can be changed to a another date between 2017-01-01 and 2020-12-31. The date field in the form is of input type date. Time spent on exercise and time spent on studying is reported in hours with 0.5 hours accuracy, they can contain one decimal. The fields for these are of input type number. Eating quality and generic mood are reported with a number from 1 to 5, where 1 is very poor and 5 is very good. The eating quality and mood fields are of type range (are sliders). All fields are required. Each field has labels that clarify the purposes of the fields and accepted values. The form fields are validated, exercise time and study time must be numbers and can't be negative and eating quality and mood must be reported as integers between 1 and 5. In case of validation errors, form fields are populated.  
 The reported values are stored into the database. The database schema used contains only one database with all the attributes in the morning and reports forms. The schema also contains boolean values morning_report and evening_report that tell whether the report is a morning or evening report. When report values are stored in the database, those attributes that the report does not have are stored as null. For morning reports, exercise_time, study_time and eating_quality are null and for evening reports sleep_duration and sleep_quality are null. The reporting is user specific, the database contains the field user_id that tells who the report belongs to. All reports made are stored for the user who is currently logged in and authenticated. If the same report is already given for a specific day, the old report is removed.  
 Reporting functionality is structured into logical parts. The views are structured into a separate views folder where there are three different reporting views, reporting.ejs for /behavior/reporting, morning.ejs for /behavior/reporting/morning and evening.ejs for /behavior/reporting/evening. The functionality is structured in reportController.js and reportService.js where reportController handles the different requests and reportService makes queries to the database and contains validation functionality.  
 
 ### Summarization
 
 ### Landing page
 The landing page contains a description of the application.  
 The landing page shows a glimpse of the data in the database and indicates a trend. It shows the users' average mood for today and for yesterday. If the average mood was better yesterday than today it shows the text 'things are looking gloomy today' and if the average mood was worse yesterday than today it shows the text 'things are looking bright today'.  
 The landing page has links for login and register functionality. The links are in the navigation bar at the top of the page and can be seen from every page. The links for login and register are only visible if the user isn't logged in. Then, when the user logs in, the navigation bar contains the logout link and the email of the user logged in.  
 The landing page has links for reporting functionality. The links are in the navigation bar at the top of the page and can be seen from every page. The links report and summary for making reports and viewing the summary are only visible when the user is logged in.  
 
 ### Testing
 The application has at least 20 meaningful automated tests, 25 tests, that detect if the tested functionality is chenged so that it no longer works as expected.  
 
 ### Security
 Passwords are not stored in plaintext, they are stored as hashes using bcrypt.  
 Fiels types in the database match the content, date uses timezone with timestamp, email and password use varchar and char, number values use either float or integer depending on whether they can have decimals or not and fields for defining whether the report is morning or evening report use boolean.  
 All database queries use parameterized queries, code can not be injected to SQL queries.  
 Data retrieved from the database is sanitized, <%= %> is always used with data from the database.  
 Users can't access data of other users. They see summaries only from their own data.  
 Users can't post reports to other user's account, all reports made are made for the user that is logged in.  
 
 ### Database
 Expensive calculations are done in the database, all averages are calculated in the database with SQL queries.  
 Indices would have been used if there would have been queries joining tables. However, tables aren't joined in queries that are used often so indices aren't used.
 The database uses a connection pool.  
 The database credentials are not included in the code, the credentials are given as environmental variables on the command line while testing and running the program locally.  
 
 ### User interface / views
 All views are stored in a separate folder views.  
 The user interface uses partials for the header content and for the footer content.  
 The recurring parts are separated into own partials. Validation errors are separated into its own partial as well as the table for showing all averages and table for showing the average for the day and form inputs with their labels that are used often (input of type date, input of type number and input of type range).  
 Pages with forms quide the user. The form fields have labels that are shown next to (on top of) the fields, the form fields are validated and the user sees validation errors close to (beneath) the form fields and in case of validation errors the form fields are validated. The login page is, of course, not validated. In the selection for week or month in the summary page, the form fields are not validated in case of a validation error because the types of the fields are either week or month if those types are supported in the browser or otherwise select. Instead, the value of the selected week and year or month and year are shown on the page above the form fields where the user can see the previously selected month and year. If the user submits an empty form, '--' and '----' are shown for the week and the year or month and the year.  
 The user interface uses a style library. The style library used is milligram. The user interface also has some self-made styles such as the navigation bar. Milligram, the external style library is used over a content delivery network.  
 All different pages of the application follow the same style.  
 The user sees if the user has logged in. If the user has logged in, the text 'Logged in as user@email.com' appears at the top of the page to the navigation bar, where user@email.com is the email of the user.  
 
 ### APIs
 The application provides API endpoints for retrieving summary data generated over all users in a JSON format.  
 The API is accessible by all.  
 The API allows cross-origin requests.  
 The endpoint /api/summary provides a JSON document with averages for sleep duration, exercise time, study time, sleep quality and mood over the last 7 days. It looks at the last 7 days, including today, not the last week as in the summary for individual users.  
 The endpoint /api/summary/:year/:month/:day provides a JSON document with averages for sleep duration, exercise time, study time, sleep quality and mood for the given day.  
 
 ### Deployment
 The application is available and working at an online location, Heroku, at the address provided in the beginning of this document in the part access application.  
 The application can be run locally by following the instructions in the beginning of this document at the part running the project locally.  
 
 ### Documentation
 The documentation (this) contains the necessary CREATE TABLE statements needed to create the database used by the application.  
 The documentation contains the address at with the application can currently be accessed (in Heroku).  
 The documentation contains guidelines for running the application.  
 The documentation contains guidelines for running the tests.  
