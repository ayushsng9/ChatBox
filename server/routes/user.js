const express = require('express');
const {registerNewUser, findUser, checkPassword, userDetails, logoutUser,updateUser, searchUser} = require('../controller/user');
const wrapAsync = require('../utilities/wrapAsync');
const { updateSearchIndex } = require('../models/user');
const router = express.Router();


router.route('/register')
    .post(wrapAsync(registerNewUser))

router.route('/email')
    .post(wrapAsync(findUser))

router.route('/password')
    .post(wrapAsync(checkPassword))

router.route('/userDetails')
    .get(wrapAsync(userDetails));

router.route('/logout')
    .get(wrapAsync(logoutUser));

router.route('/update')
    .post(wrapAsync(updateUser));

router.route('/search')
    .post(wrapAsync(searchUser));



module.exports = router;