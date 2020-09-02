# Vacations Following site
### React Nodejs and MySQL

Node.js and Express server, using rest api method.  
db: mysql  
Client side: React.js. Css design.

### functionality and npm packages:
register, and secure login with Passport.js, bcrypt (hash), and Express-session.

Adding, editing and deleting vacations by admin.  
Add files with 'Multer'. (And Uuid)  
followers graph for the admin with 'react-chartjs-2'

Follow vacation by users.  
Real-time update with Socket.io



### Real-time update method:
Admin added a new vacation: The vacation enters in real time for all users. and pop up a message.

When a user Following or unFollowing a vacation. And also when admin updating vacation:
The change is updated in real time for  all users. And if the user follow the updated vacation, pop up a message.

Admin delete a vacation: The vacation is deleted in real time for all users,
and if the user follow the deleted vacation, pop up a message.
