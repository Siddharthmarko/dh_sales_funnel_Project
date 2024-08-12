const express = require("express");
const router = express.Router();
const { 
  UpdateProject,
  UpdateSubcategory,

} = require("../controller/updateControler");


router.post('/api/update-projects', UpdateProject);

router.post('/api/update-category', UpdateSubcategory);

router.post('/api/update-subcategory', UpdateSubcategory);

module.exports = router;
