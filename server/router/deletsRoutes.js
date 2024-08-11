const express = require("express");
const router = express.Router();
const { deleteProject,
   deleteCategory,
   
   } = require("../controller/deleteControler");


// Route to delete a projects
router.post('/api/delete-projects', deleteProject);

router.delete('/api/delete-category', deleteCategory);



module.exports = router;