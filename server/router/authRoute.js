const express = require('express');
const router = express.Router();
const {registerController, loginController, UserLogin, UserRegister, AdminLogin} = require('../controller/authController');

router.post('/register', registerController);
router.post('/login', loginController);
// Route to Register User
router.post("/api/login", UserLogin);
// Router to Register New user By admin side
router.post("/api/register", UserRegister);

// Admin Routes
router.post("/api/admin-login", AdminLogin);

module.exports = router;