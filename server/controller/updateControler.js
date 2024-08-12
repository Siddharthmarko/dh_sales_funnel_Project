const {db} = require('../config/db')  

// Route to update projects
const UpdateProject = (req, res) => {
  const { id, name } = req.body;
  console.log(name, id, 'print');
  
  const updateQuery = `UPDATE projects SET name = ? WHERE id = ?`;
  console.log(updateQuery);

  db.query(updateQuery, [name, id], (err, result) => {
    console.log(updateQuery, name, id);
    
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, error: 'Failed to update project' });
    }
    return res.status(200).json({ success: true, message: 'Project updated successfully' });
  });
};

// Similar routes for categories and subcategories...
// Update Category
const UpdateCategory = (req, res) => {
  const { id, name } = req.body;
  const updateQuery = `UPDATE category SET name = ? WHERE id = ?`;

  db.query(updateQuery, [name, id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Failed to update category' });
    }
    return res.status(200).json({ success: true, message: 'Category updated successfully' });
  });
};

// Update Subcategory
const UpdateSubcategory = (req, res) => {
  const { id, name, category_id } = req.body;
  const updateQuery = `UPDATE subcategory SET name = ?, category_id = ? WHERE id = ?`;

  db.query(updateQuery, [name, category_id, id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Failed to update subcategory' });
    }
    return res.status(200).json({ success: true, message: 'Subcategory updated successfully' });
  });
};


module.exports = {
  UpdateProject,
  UpdateCategory,
  UpdateSubcategory,

}
