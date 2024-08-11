const {db} = require('../config/db')  



// Route to delete projects 
const deleteProject = (req, res) => {
  const { id } = req.body;
// console.log(id);
  const deleteData = `DELETE FROM projects WHERE id = ?`;

  db.query(deleteData, [id], (err, result) => {
    if (err) {
      // Error handling block
      return res.status(500).json({
        success: false,
        error: 'Project Not Delete Internal Server Error',
      });
    }
    
    // Success block
    return res.status(200).json({ message: 'Project Deleted Successfully' });
  });
};


// Route to delete category 
const deleteCategory = (req, res) => {
  const { id } = req.body;
// console.log(id);
  const deleteData = `DELETE FROM category WHERE id = ?`;

  db.query(deleteData, [id], (err, result) => {
    if (err) {
      // Error handling block
      return res.status(500).json({
        success: false,
        error: 'Categoryu Not Delete Internal Server Error',
      });
    }
    
    // Success block
    return res.status(200).json({ message: 'Project Deleted Successfully' });
  });
};

// Route to delete sub-category 






module.exports = {
  deleteProject,
  deleteCategory,

}