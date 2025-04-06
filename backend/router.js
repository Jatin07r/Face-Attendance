const server = require('./server');
const loginRoute = require('./verifyLogin');
const fetchRoute = require('./fetchData');
const viewRoute = require('./viewData');

// Login check
server.use('/', loginRoute);

//Fetch Data
server.use('/',fetchRoute);

//View Data
server.use('/',viewRoute);

