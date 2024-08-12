const express = require("express");
const router = express.Router();
const { 
   deleteProject,
   deleteCategory,
   
   } = require("../controller/deleteControler");


// Route to delete a projects
router.post('/api/delete-projects', deleteProject);
//Route for Delete Category 
router.post('/api/delete-categorys', deleteCategory);

//Route for delete user Employee 
router.post('/api/',);



module.exports = router;