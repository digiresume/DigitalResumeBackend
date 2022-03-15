const express = require('express');
const router = express.Router();

const { userdetail, admin, comments, user, viewprofile, deleteuser, feedback } = require('../controller/userdetail');

// router.route("/register").post(register);
router.route("/resume/:templateNum").post(userdetail);
// router.route("/admin").get(admin);
router.route("/admin").get(user);
router.route("/comments").post(comments);
router.route("/admin/:name").post(viewprofile);
router.route("/admin/:username/deleteuser").post(deleteuser);
router.route("/feedback").get(feedback);

module.exports = router;
