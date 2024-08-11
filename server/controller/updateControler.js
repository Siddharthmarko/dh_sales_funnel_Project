const {db} = require('../config/db')  

// Route to update projects
const UpdateProject = (req, res) => {
  const { id, name } = req.body;
  const updateQuery = `UPDATE projects SET name = ? WHERE id = ?`;

  db.query(updateQuery, [name, id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Failed to update project' });
    }
    return res.status(200).json({ success: true, message: 'Project updated successfully' });
  });
};

// Similar routes for categories and subcategories...


module.exports = {UpdateProject}
