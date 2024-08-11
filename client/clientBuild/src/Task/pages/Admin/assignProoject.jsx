import { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectAssignmentForm = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Fetch users
    axios.get('https://sf.doaguru.com/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });

    // Fetch projects
    axios.get('https://sf.doaguru.com/api/projects')
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });

    // Fetch categories
    axios.get('https://sf.doaguru.com/api/category-list')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://sf.doaguru.com/api/assignProject', {
      userId: selectedUser,
      projectId: selectedProject,
      categoryId: selectedCategory
    })
      .then(response => {
        console.log(response.data);
        alert('Project assigned successfully!');
      })
      .catch(error => {
        console.error('Error assigning project:', error);
        alert('Failed to assign project.');
      });
  };

  return (
    <div className="max-w-md mx-auto mt-8 border rounded-xl shadow-xl p-9 border-cyan-600 m-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="user" className="block text-sm font-medium text-gray-700">Select User</label>
          <select
            id="user"
            name="user"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="mt-1 block w-full py-1 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border-2 border-cyan-600"
          >
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.full_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700">Select Project</label>
          <select
            id="project"
            name="project"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="mt-1 block w-full py-1 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border-2 border-cyan-600"
          >
            <option value="">Select Project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Select Category</label>
          <select
            id="category"
            name="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full py-1 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border-2 border-cyan-600"
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 text-base font-medium rounded-md shadow-sm text-black border-2 border-cyan-600 hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-black"
          >
            Assign Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectAssignmentForm;
