const express = require('express');
const router = express.Router();

const { register, login, forgotpassword, resetpassword, adduser, deleteuser } = require('../controller/auth');

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotpassword);
router.route("/resetpassword/:resetToken").put(resetpassword);
router.route("/admin/adduser").post(adduser);
router.route("/admin/:username/deleteuser").post(deleteuser);

module.exports = router;