import { useState, useEffect } from 'react';
import axios from 'axios';

const AddData = () => {
    const [projectName, setProjectName] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [subCategoryName, setSubCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');



    const fetchCategories = () => {
        axios.get('https://sf.doaguru.com/api/category-list')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    };

    const handleAddProject = () => {
        axios.post('https://sf.doaguru.com/api/projects', { name: projectName })
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
        axios.post('https://sf.doaguru.com/api/categories', { name: categoryName })
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
        axios.post('https://sf.doaguru.com/api/subcategories', { name: subCategoryName, category_id: selectedCategoryId })
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
        <div className="max-w-lg mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Add Project</h2>
            <input
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project Name"
            />
            <button
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                onClick={handleAddProject}
            >
                Add Project
            </button>

            <h2 className="text-2xl font-bold mt-8 mb-4">Add Category</h2>
            <input
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name"
            />
            <button
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                onClick={handleAddCategory}
            >
                Add Category
            </button>

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
                className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
                onClick={handleAddSubCategory}
            >
                Add Subcategory
            </button>
        </div>
    );
};

export default AddData;
