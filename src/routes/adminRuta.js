const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const admin = require("../middlewares/admin");

router.get('/dashboard', admin, adminController.dashboard);
router.get('/logout', adminController.logout);

module.exports = router;