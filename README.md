===========================================
Running the App for Dev (C9):
===========================================

Step 1:
Open a new terminal and type:
$ mongod --bind_ip=$IP --nojournal
(this is the config default for running mongoDB in C9 without sucking up too much CPU)

Step 2:
Open a second terminal and type:
$ mongo
It should respond: "connecting to: test"
Then, type:
$ use openimpactdb
It should respond: switched to db openimpactdb

Step 3: 
Open a third terminal and type:
$ grunt
The last line of the response should be: "[nodemon] starting `node app.js`"

Step 4: 
Open a new browser tab and navigate to: 
https://open-impact-jordajm.c9.io/

Explanation:
Running "grunt" builds the app and launches two "watching" services that monitor the project for any file changes.
Once a change to a file is detected, the app is automatiaclly either rebuilt with Grunt or the server is restarted, or both, 
depending on what type of file has been changed. 

So, there is no need to manually restart the server or rebuild the project - this should all happen automagically. 