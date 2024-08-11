import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import EditModal from "../../components/EditModal";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState('');

  console.log(modalData);


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

  // Function to handle opening the modal

  const handleEditClick = (item, type) => {
    const { name } = item;
    console.log('Item:', item);
    console.log('Type:', type);
    setModalData({ name });
    console.log(setModalData);

    setModalType(type);
  };

  // Function to handle form submission in the modal
  const handleEditSubmit = (updatedData) => {
    // Send a request to update the data in the database
    axios.post(`http://localhost:8080/api/update-${modalType}`, updatedData)
      .then(response => {
        // Handle the response and update the UI
        toast.success(`${modalType} updated successfully`, { position: 'top-right' });
        // Update the state with the new data
        if (modalType === 'project') {
          setProjects(projects.map(project => project.id === updatedData.id ? updatedData : project));
        } else if (modalType === 'category') {
          setCategories(categories.map(category => category.id === updatedData.id ? updatedData : category));
        } else if (modalType === 'subcategory') {
          setSubcategories(subcategories.map(subcategory => subcategory.id === updatedData.id ? updatedData : subcategory));
        }
        setModalData(null); // Close the modal
      })
      .catch(error => {
        console.error('Error updating:', error);
        toast.error(`Failed to update ${modalType}`, { position: 'top-right' });
      });
  };

  // Remove projects and other  handle 
  const handleDeleteTask = (id, type) => {
    // Check condition confirmation 
    const isConfirmed = window.confirm(`Are you sure you want to remove this ${type}?`);

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      axios.post(`http://localhost:8080/api/delete-${type}`, { id })
        .then(response => {
          // Success response handling
          toast.success(`${type} removed successfully`, { position: 'top-right' });

          // Update the UI by removing the deleted item from the state
          if (type === 'projects') {
            setProjects(projects.filter(project => project.id !== id));
          } else if (type === 'category') {
            setCategories(categories.filter(category => category.id !== id));

            // Also remove associated subcategories
            setSubcategories(subcategories.filter(subcategory => subcategory.category_id !== id));
          } else if (type === 'subcategory') {
            setSubcategories(subcategories.filter(subcategory => subcategory.id !== id));
          }
        })
        .catch(error => {
          // Error response handling
          console.error('There was an error!', error);
          toast.error(`Failed to remove ${type}`, { position: 'top-right' });
        });
    }
  };


  useEffect(() => {

  }, [projects])

  return (
    <div className="flex justify-center m-auto">
      <div className="EmployeePage container flex flex-col gap-2 justify-center sm:m-5 sm:p-5 mt-16">
        <div className="flex justify-start">
          <span className="m-1 p-2 hover:bg-cyan-100 border border-cyan-600 rounded-lg">
            <Link to="/task/AddProject">Register Projects</Link>
          </span>
        </div>
        <div className="flex">
          <h1 className="m-auto font-bold">Project Details</h1>
        </div>
        <div className="allTable flex ">


          {/* Projects Table */}
          <div className="projectsTable">
            <h2 className="text-lg font-semibold mt-4 mb-2">Projects</h2>
            <div className="relative mx-4 overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-3 py-2">Project ID</th>
                    <th scope="col" className="px-3 py-2">Project Name</th>
                    <th scope="col" className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => (
                    <tr key={project.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700">
                      <td className="px-3 py-2">{project.id}</td>
                      <td className="px-3 py-2">{project.name}</td>
                      <td className="px-3 py-2 flex">
                        <Link to="#" onClick={() => handleEditClick(project, 'project')} className="font-medium text-blue-600 dark:text-blue-500 hover:underline px-1">Edit</Link>
                        <Link to="#" onClick={() => handleDeleteTask(project.id, 'projects')} className="font-medium text-red-600 dark:text-red-500 hover:underline px-1">Remove</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Categories Table */}
          <div className="CategoriesTable">
            <h2 className="text-lg font-semibold mt-4 mb-2">Categories</h2>
            <div className="relative mx-4 overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-3 py-2">Category ID</th>
                    <th scope="col" className="px-3 py-2">Category Name</th>
                    <th scope="col" className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700">
                      <td className="px-3 py-2">{category.id}</td>
                      <td className="px-3 py-2">{category.name}</td>
                      <td className="px-3 py-2 flex">
                        <Link to="#" onClick={() => handleEditClick(category, 'category')} className="font-medium text-blue-600 dark:text-blue-500 hover:underline px-1">Edit</Link>
                        <Link to="#" onClick={() => handleDeleteTask(category.id, 'category')} className="font-medium text-red-600 dark:text-red-500 hover:underline px-1">Remove</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subcategories Table */}
          <div className="SubcategoriesTable">
            <h2 className="text-lg font-semibold mt-4 mb-2">Subcategories</h2>
            <div className="relative mx-4 overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-3 py-2">Subcategory ID</th>
                    <th scope="col" className="px-3 py-2">Subcategory Name</th>
                    <th scope="col" className="px-3 py-2">Category ID</th>
                    <th scope="col" className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subcategories.map(subcategory => (
                    <tr key={subcategory.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700">
                      <td className="px-3 py-2">{subcategory.id}</td>
                      <td className="px-3 py-2">{subcategory.name}</td>
                      <td className="px-3 py-2">{subcategory.category_id}</td>
                      <td className="px-3 py-2 flex">
                        <Link to="#" onClick={() => handleEditClick(subcategory, 'subcategory')} className="font-medium text-blue-600 dark:text-blue-500 hover:underline px-1">Edit</Link>
                        <Link to="#" onClick={() => handleDeleteTask(subcategory.id, 'subcategory')} className="font-medium text-red-600 dark:text-red-500 hover:underline px-1">Remove</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Edit Modal */}
          <EditModal
            show={modalData !== null}
            onClose={() => setModalData(null)}
            onSubmit={handleEditSubmit}
            item={modalData}
            type={modalType}
          />
        </div>


      </div>
    </div>
  );
}

export default ProjectsPage;
