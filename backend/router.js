const express = require('express');
const router = express();
const loginRoute = require('./verifyLogin');
const fetchAdminRoute = require('./fetchAdminData');
const fetchStudentRoute = require('./fetchStudentData');
const viewRoute = require('./viewData');
const download = require('./download');
const add = require('./add');
const logout = require('./logout');

//Login check
router.use('/', loginRoute);

//Fetch Admin Data
router.use('/',fetchAdminRoute);

//Fetch Student Data
router.use('/',fetchStudentRoute);

//View Data
router.use('/',viewRoute);

//Download Attendance
router.use('/',download);

//Add Attendance
router.use('/',add);

//Logout
router.use('/',logout);

module.exports = router;