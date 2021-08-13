# Boulder Activity Finder

This project had been initially implemented as a project for CSCI 3308 at UCB.  I have cloned it into my own repository to continue work on August 12, 2021.

Users will first be directed to a login screen where they will have the option to create an account or login.  The user info entered on the registration page will be stored in a PostgresSQL database and will be accessed on future logins.

From there, the user will be directed to the site’s home page where they will be able to browse the event and activity postings that are available from other users based on their own preferences and filters.  They will also have the ability to navigate to pages that control their user settings and their own personal postings.  These postings will also be stored in separate SQL databases.  Users will be able to post comments and pictures under the events posting as well (not currently implemented).

The front-end of the application will be designed using HTML, CSS styling, JavaScript, and EJS. The server-end communication will take place via Node.js which will interact with a PostgresSQL database and a Web Server that will be hosted on Heroku.

We used docker-compose to build our development environment

Contributors:

Sean Lowry, Xiang Chen, David Farrow, Slav Ivanovich
