const express = require("express");
const router = express.Router();
const { UpdateProject } = require("../controller/updateControler");


app.post('/api/update-project', UpdateProject);


module.exports = router;

