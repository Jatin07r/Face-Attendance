const server = require('./server');
const loginRoute = require('./verifyLogin');
const fetchAdminRoute = require('./fetchAdminData');
const fetchStudentRoute = require('./fetchStudentData');
const viewRoute = require('./viewData');
const download = require('./download');

// Login check
server.use('/', loginRoute);

//Fetch Admin Data
server.use('/',fetchAdminRoute);

//Fetch Student Data
server.use('/',fetchStudentRoute);

//View Data
server.use('/',viewRoute);

//Download Attendance
server.use('/',download)