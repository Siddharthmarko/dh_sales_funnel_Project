import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

//alert toast import



let defaultTaskData = {
  ProjectOrClientName: '',
  Category: '',
  SubCategory: '',
  TaskDescription: '',
  ConsumingTimeInMin: '',
}

function UserHome() {
  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState({
    ProjectOrClientName: "",
    Category: "",
    subCategory: "",
    TaskDescription: "",
    ConsumingTimeInMin: "",
  });
  const [date, setDate] = useState(new Date());
  const [allProject, setAllProject] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [userProject, setUserProject] = useState([]);

  const [taskData, setTaskData] = useState([]);

  // Dropdown List select in task time use state 
  const [projects, setProjects] = useState([]);
  const [categorys, setCategory] = useState([]);
  const [subCategorys, setSubCategory] = useState([]);

  const [selectedProjects, setSelectedProjects] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');


  let user = localStorage.getItem('user');
  user = JSON.parse(user);
  // console.log(user);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  // Task Add Form handle   
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(user);
    console.log(formData)

    axios.post('https://sf.doaguru.com/api/add-data', {
      user_id: user.id,
      user_full_name: user.full_name,
      ...formData
    })

      .then(response => {

        toast.success('आपका टास्क सफलतापूर्वक जोड़ दिया गया है।');
        fetchTasks(date);  // Fetch updated tasks after adding new data
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
    setFormData(defaultTaskData)
  };
  // FetchTask by Date 
  const fetchTasks = (selectedDate) => {
    // console.log(selectedDate)
    const formattedDate = selectedDate.toISOString().split('T')[0];
    console.log(formattedDate)

    let user = localStorage.getItem('user');
    user = JSON.parse(user);


    axios.get('https://sf.doaguru.com/api/fetch-data', { params: { date: formattedDate } })
      .then(response => {
        let data = response.data;
        let currentUser = data.filter((iteam) => iteam.user_id == user.id)
        console.log(currentUser, user.id)
        setTaskData(currentUser);
        console.log(response.data)
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };
  // Edit Task handle 
  const handleEditTask = (task) => {
    setIsUpdate(true)
    console.log(task);
    setFormData(task)
    setShowModal(true)
    console.log(formData)
  }
  // Update Task Handle 
  const updateTask = (e) => {
    e.preventDefault()

    console.log("A gya ")
    axios.post('https://sf.doaguru.com/api/update-task', formData)
      .then(response => {
        fetchTasks(date)
        alert('आपका टास्क संपादित हो गया है।');

        console.log(response.data);
        setIsUpdate(false)
        setShowModal(false)
      })
      .catch((err) => {
        console.log("There is a Error to edit : ", err)
      })
    setFormData(defaultTaskData)
  }
  // Remove Task handle 
  const handleDeleteTask = (id) => {
    axios.post('https://sf.doaguru.com/api/delete-task', { id })
      .then(response => {
        toast.success('Task Remove ', { position: 'top-right' });
       
        fetchTasks(date)
      })
      .catch(error => console.error('There was an error!', error));
  };



  // fetc and add select filed and category option 
  const fetchProjectListData = () => {
    axios.get('https://sf.doaguru.com/api/projects')
      .then(response => {
        console.log(response.data)
        setAllProject(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the projects!", error);
      });
  };

  const particularProject = () => {
    axios.get(`https://sf.doaguru.com/api/getProject/${user.id}`)
      .then(response => {
        console.log(response.data);
        const particular_project = response.data; // Assuming response.data is an array of objects with project IDs
        setUserProject(particular_project);
        // console.log(allProject);

        const matchedProjects = [];
        // const matchedCategory = [];
        // Loop through each project in particular_project
        particular_project.forEach(particular => {
          // Find corresponding project details in allProject
          console.log(allProject);
          const match = allProject.find(project => project.id == particular.project_id);
          if (match) {
            matchedProjects.push(match);
          }
        });
        console.log(matchedProjects);
        // Assuming setProjects is a function to update state with matchedProjects
        setProjects(matchedProjects);
        handleProjectsChange();
      })
      .catch(error => {
        console.error("There was an error fetching the projects!", error);
      });
  };


  // dropdown list for add task 

  const particularCategory = () => {
    console.log(allCategory);
    console.log(userProject);
    let matchedCate = [];
    userProject.forEach(particular => {
      // Find corresponding project details in allProject
      console.log(allProject);
      const match = allCategory.find(project => project.id == particular.category_id);
      if (match) {
        matchedCate.push(match);
      }
    });
    console.log(matchedCate);
    setCategory(matchedCate);

  };

  const handleProjectsChange = (e) => {
    const projectId = e?.target.value
    setSelectedProjects(projectId);
    setFormData({
      ...formData,
      ProjectOrClientName: projectId
    });
    console.log(projectId)
    axios.get(`https://sf.doaguru.com/api/category-list?projects_id=${projectId}`)
      .then(response => {
        setAllCategory(response.data);
        particularCategory();
        // setCategory(response.data);
        setSubCategory([]);
        setSelectedCategory('');

      })
      .catch(error => {
        console.error("There was an error fetching the categories!", error);
      });
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const selectedCategoryList = allCategory.find(category => category.name === categoryId);
    setSelectedCategory(categoryId);
    console.log(selectedCategoryList, "Ye check kro ki ye aya  ");
    let obj = { ...formData, Category: categoryId, CategoryName: selectedCategoryList?.name };
    console.log("line 219", categoryId, selectedCategoryList.name)
    console.log(obj)
    setFormData({ ...obj });



    axios.get(`https://sf.doaguru.com/api/sub-category-list?category_id=${selectedCategoryList.id}`)
      .then(response => {
        setSubCategory(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error("There was an error fetching the sub-categories!", error);
      });
  };


  useEffect(() => {
    fetchProjectListData()
    fetchTasks(date);
  }, [date]);


  return (
    <div className="homePage min-h-screen">
      {/* dfsdfd */}
      {/* Add Task Modal Add  */}
      <>

        {showModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-3 max-w-4xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-2 sm:p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className=" text-2xl sm:text-3xl font-semibold center">
                      Add Today Effort Tasks
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="h-6 w-6 text-3xl font-semibold center block outline-none focus:outline-none">
                        X
                      </span>
                    </button>


                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">

                    <div className="container mx-auto px-4 bg-slate-200 max-w-7xl rounded p-3">
                      <div className="m-2 p-2 border border-white rounded-lg">
                        <form onSubmit={!isUpdate ? handleSubmit : updateTask}>
                          {/* <div>
                              <h2 className="text-2xl font-bold text-center py-3 my-2">Add Today Afford Tasks</h2>
                            </div> */}
                          <div className="task-box-1 flex">
                            <div className="max-w-7xl mx-auto flex  justify-start min-[320px]:flex-wrap gap-5">
                              {/* Client and Project  Name Select  */}
                              <div className="project-client-name">
                                <label htmlFor="ProjectClient" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Select Project / Client Name</label>
                                <select id="ProjectClient" required name="ProjectOrClientName" value={formData.ProjectOrClientName} onChange={handleProjectsChange} className="block border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-52 p-2.5 light:bg-white-700 dark:border-gray-600 dark:placeholder-black-400 dark:text-black dark:focus:ring-black-500 dark:focus:border-blue-500">
                                  <option value="">Choose a ProjectOrClientName</option>
                                  {projects.map(project => (
                                    <option key={project.id} value={project.name}>{project.name}</option>
                                  ))}
                                </select>
                              </div>
                              {/* Project and Client work task category select  */}
                              <div className="project-task-category">
                                <label htmlFor="Category" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Select Category</label>
                                <select id="Category" required name="Category" value={formData.Category} onChange={handleCategoryChange} disabled={!selectedProjects} className="block border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-52 p-2.5 light:bg-white-700 dark:border-gray-600 dark:placeholder-black-400 dark:text-black dark:focus:ring-black-500 dark:focus:border-blue-500">
                                  <option value="">Choose a Category</option>
                                  {categorys.map(category => (
                                    <option key={category.id} value={category.name}>{category.name}</option>
                                  ))}
                                </select>
                              </div>
                              {/* After category select sub category under category section  */}
                              <div className="project-task-sub-category">
                                <label htmlFor="SubCategory" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Select Sub-Category</label>
                                <select id="SubCategory" required name="subCategory" value={formData.subCategory} onChange={handleChange} disabled={!selectedCategory} className="block border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-52 p-2.5 light:bg-white-700 dark:border-gray-600 dark:placeholder-black-400 dark:text-black dark:focus:ring-black-500 dark:focus:border-blue-500">
                                  <option value="">Choose a Sub-Category</option>
                                  {subCategorys.map(subCategory => (
                                    <option key={subCategory.id} value={subCategory.name}>{subCategory.name}</option>
                                  ))}
                                </select>
                              </div>
                              {/* Add task description manually */}
                              <div className="project-task-description" style={{ width: "600%", maxWidth: "48rem", minWidth: "15rem" }}>
                                <label htmlFor="Description" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Enter Task Description</label>
                                <textarea
                                  type="text"
                                  name="TaskDescription"
                                  value={formData.TaskDescription}
                                  onChange={handleChange}
                                  id="description"
                                  required
                                  className="block rounded-md border border-gray-300 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text- w-full gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  placeholder="Description"

                                />
                              </div>
                              {/* Enter time in minutes  */}
                              <div className="project-task-description">
                                <label htmlFor="ConsumingTimeInMin" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Task Consuming Time in Min.</label>
                                <input
                                  required
                                  type="number"

                                  name="ConsumingTimeInMin"
                                  value={formData.ConsumingTimeInMin}
                                  onChange={handleChange}

                                  id="ConsumingTimeInMin"
                                  className="block w-52 rounded-md border border-gray-300 p-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 sm:me-64"
                                  placeholder="Time in Min."
                                />
                              </div>

                              <div className="buttons flex justify-start sm:ms-10  ">

                                {

                                  // {/* Add Task Button  */ }
                                  !isUpdate ?
                                    <div className=" m-1 flex flex-col justify-end ">
                                      <button type="submit" className="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-black-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-gray-100 dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                                        <span className="relative px-5 py-1 transition-all ease-in duration-75 bg-gray-100 dark:bg-white-900 rounded-md group-hover:bg-opacity-0">
                                          Add Task
                                        </span>
                                      </button>
                                    </div>
                                    :
                                    // {/* Task Update Button  */}
                                    <div className=" m-1 flex flex-col justify-end ">
                                      <button type="submit" className="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-black-900 rounded-lg group bg-gradient-to-br from-blue-900 to-blue-600 group-hover:from-red-600 group-hover:to-blue-600 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-100">
                                        <span className="relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-white-900 rounded-md group-hover:bg-opacity-0">
                                          Update Task
                                        </span>
                                      </button>
                                    </div>

                                }
                                {/* Task Clear Button */}
                              </div>


                            </div>
                          </div>
                        </form>
                        <div className="m-1 flex flex-col mt-3 justify-end">
                          <button type="reset" onClick={() => setFormData(defaultTaskData)} className="relative w-max	 inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-black-900 rounded-lg group bg-gradient-to-br from-red-400 to-orange-600 hover:from-red-600 hover:to-orange-400 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-oarnge-800">
                            <span className="relative px-5 py-1 transition-all ease-in duration-75 bg-gray-50 dark:bg-white-900 rounded-md group-hover:bg-opacity-0">
                              Clear
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-1 border-t border-solid border-blueGray-500 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>

                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>

      {/* Modal Button Here  */}
      <div className="container mx-auto px-4 bg-slate-200 max-w-7xl rounded p-3">
        <div className="m-2 p-2">
          <div className=" flex justify-between items-center">
            <div className=" ">
              <button onClick={() => { setShowModal(true); particularProject(); }} className="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-black-900 hover:text-gray-100 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 hover:bg-green-400 hover:blue-600  dark:text-black focus:ring-4 focus:outline-none focus:ring-green-900 focus:ring-green-800">
                <span className="relative px-5 py-1 transition-all ease-in duration-75 bg-gray-100 dark:bg-white-900 rounded-md hover:bg-opacity-0">
                  Add Task
                </span>
              </button>
            </div>
            {/* Date picker calender add here  */}
            <div className="my-1  ">
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="yyyy-MM-dd"
                className="p-2 rounded-lg w-28 border-2 border-sky-900"
              />
            </div>
          </div>
          {/* Table task show day wise only */}
          <div>
            <h1 className="text-2xl font-bold text-center py-3 my-2">Task Effort Report</h1>
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-white dark:text-gray">
              <thead className="text-xs  uppercase bg-gray-700 dark:text-white-400">
                <tr>
                  <th scope="col" className="px-3 py-2">S.no.</th>
                  <th scope="col" className="px-3 py-2">Project/Client Name</th>
                  <th scope="col" className="px-3 py-2">Category</th>
                  <th scope="col" className="px-3 py-2">Sub-Category</th>
                  <th scope="col" className="px-3 py-2">Task Description</th>
                  <th scope="col" className="px-3 py-2">Consuming time</th>
                  <th scope="col" className="px-3 py-2">Total Consuming time</th>
                  <th scope="col" className="px-3 py-2 center">Action</th>
                </tr>
              </thead>
              <tbody>
                {taskData.map((task, index) => (
                  <tr key={task.id} className=" odd:bg-gray-900  even:bg-gray-800 border-b border-gray-700">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2">{task.ProjectOrClientName}</td>
                    <td className="px-3 py-2">{task.Category}</td>
                    <td className="px-3 py-2">{task.SubCategory}</td>
                    <td className="px-3 py-2">{task.TaskDescription}</td>
                    <td className="px-3 py-2">{task.ConsumingTimeInMin}</td>
                    <td className="px-3 py-2">{task.TotalConsumingTime}</td>
                    <td className="px-3 py-2 flex-wrap">
                      <Link to="#" onClick={() => { handleEditTask(task) }} className="font-medium text-blue-600 text-blue-500 hover:underline px-1">Edit</Link>
                      <Link to="#" onClick={() => handleDeleteTask(task.id)} className="font-medium text-red-600 text-red-500 hover:underline px-1">Remove</Link>
                    </td>
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

export default UserHome;
