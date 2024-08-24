import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
console.log(subcategories);
  useEffect(() => {
    // Fetch projects
    axios.get('http://localhost:8080/api/projects')
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });

    // Fetch categories
    axios.get('http://localhost:8080/api/category-list')
      .then(response => {
        setCategories(response.data);
        setSubcategories([]);
        response.data.forEach(category => {
          gettingSubCategory(category.id);
        });
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const gettingSubCategory = (selectedCategory) => {
    axios.get(`http://localhost:8080/api/sub-category-list?category_id=${selectedCategory}`)
      .then(response => {
        setSubcategories(prevSubcategories => [
          ...prevSubcategories,
          ...response.data 
        ]);
      })
      .catch(error => {
        console.error('Error fetching subcategories:', error);
      });
  };

  return (
    <div className="flex justify-center m-auto">
      <div className="EmployeePage container flex flex-col gap-2 justify-center sm:m-5 sm:p-5 mt-16">
        <div className="flex justify-start">
          <span className="m-2 p-3 hover:bg-cyan-100 border border-cyan-600 rounded-lg">
            <Link to="/task/AddProject">Register Projects</Link>
          </span>
        </div>
        <div className="flex">
          <h1 className="m-auto font-bold">Project Details</h1>
        </div>

        {/* Categories Table */}
        <div className="userTable">
          <h2 className="text-lg font-semibold mt-4 mb-2">Categories</h2>
          <div className="relative mx-4 overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-3 py-2">Category ID</th>
                  <th scope="col" className="px-3 py-2">Category Name</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700">
                    <td className="px-3 py-2">{category.id}</td>
                    <td className="px-3 py-2">{category.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subcategories Table */}
        <div className="userTable">
          <h2 className="text-lg font-semibold mt-4 mb-2">Subcategories</h2>
          <div className="relative mx-4 overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-3 py-2">Subcategory ID</th>
                  <th scope="col" className="px-3 py-2">Subcategory Name</th>
                  <th scope="col" className="px-3 py-2">Category ID</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map(subcategory => (
                  <tr key={subcategory.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700">
                    <td className="px-3 py-2">{subcategory.id}</td>
                    <td className="px-3 py-2">{subcategory.name}</td>
                    <td className="px-3 py-2">{subcategory.category_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Projects Table */}
        <div className="userTable">
          <h2 className="text-lg font-semibold mt-4 mb-2">Projects</h2>
          <div className="relative mx-4 overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-3 py-2">Project ID</th>
                  <th scope="col" className="px-3 py-2">Project Name</th>
                  {/* <th scope="col" className="px-3 py-2">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={project.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700">
                    <td className="px-3 py-2">{project.id}</td>
                    <td className="px-3 py-2">{project.name}</td>
                    {/* <td className="px-3 py-2 flex">
                      <Link to="#" onClick={() => { }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline px-1">Edit</Link>
                      <Link to="#" onClick={() => { }} className="font-medium text-red-600 dark:text-red-500 hover:underline px-1">Remove</Link>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProjectsPage;
