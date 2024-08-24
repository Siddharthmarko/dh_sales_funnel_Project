import { useState, useEffect } from 'react';
import axios from 'axios';

const AddData = () => {
    const [projectName, setProjectName] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [subCategoryName, setSubCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');



    const fetchCategories = () => {
        axios.get('http://localhost:8080/api/category-list')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    };

    const handleAddProject = () => {
        axios.post('http://localhost:8080/api/projects', { name: projectName })
            .then(response => {
                console.log(response.data);
                setProjectName('');
                alert('project Added')
            })
            .catch(error => {
                console.error('Error adding project:', error);
            });
    };

    const handleAddCategory = () => {
        axios.post('http://localhost:8080/api/categories', { name: categoryName })
            .then(response => {
                console.log(response.data);
                setCategoryName('');
                fetchCategories(); // Fetch categories again after adding new category
                alert('Category Added')
            })
            .catch(error => {
                console.error('Error adding category:', error);
            });
    };

    const handleAddSubCategory = () => {
        axios.post('http://localhost:8080/api/subcategories', { name: subCategoryName, category_id: selectedCategoryId })
            .then(response => {
                console.log(response.data);
                setSubCategoryName('');
                setSelectedCategoryId('');
                alert('Sub Category Added')
            })
            .catch(error => {
                console.error('Error adding subcategory:', error);
            });
    };

    useEffect(() => {
      fetchCategories();
  }, []);

    return (
        <div className="max-w-lg mx-auto p-4 ">
            <div>
            <h2 className="text-2xl font-bold mb-4">Add Project</h2>
            <input
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project Name"
            />
            <button
                className="w-full border-3 border-gray-900 text-gray-900 py-2 rounded font-bold hover:text-gray-50 hover:bg-gray-900"
                onClick={handleAddProject}
            >
                Add Project
            </button>
            </div>
            <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">Add Category</h2>
            <input
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name"
            />
            <button
                className="w-full border-3 border-gray-900 text-gray-900 py-2 rounded font-bold hover:text-gray-50 hover:bg-gray-900"
                onClick={handleAddCategory}
            >
                Add Category
            </button>
            </div>
            <div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Add Subcategory</h2>
            <input
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                type="text"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                placeholder="Subcategory Name"
            />
            <select
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
                <option value="">Select Category</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
            <button
                className="w-full border-3 border-gray-900 text-gray-900 py-2 rounded font-bold hover:text-gray-50 hover:bg-gray-900"
                onClick={handleAddSubCategory}
            >
                Add Subcategory
            </button>
            </div>
        </div>
    );
};

export default AddData;
