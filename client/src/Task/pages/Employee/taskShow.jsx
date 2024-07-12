import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

let defaultTaskData = {
  ProjectOrClientName: '',
  Category: '',
  SubCategory: '',
  TaskDescription: '',
  ConsumingTimeInMin: '',
  task_date: '',
}

function TaskView() {
  const [showModal, setShowModal] = React.useState(false);

  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState(defaultTaskData);

  const [taskData, setTaskData] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };



  const fetchFullTasks = () => {
    axios.get('http://localhost:8080/api/fetch-full-data')
      .then(response => {
        setTaskData(response.data);
        
        console.log(response.data)
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const handleEditTask = (task) => {
    setIsUpdate(true)
    console.log(task);
    setFormData(task)
    setShowModal(true)
    console.log(formData)

  }
  const handleSubmit = () => {
    console.log('clicked handlesubmit at taskshow')
  }

  const updateTask = (e) => {

    axios.post('http://localhost:8080/api/update-task', formData)
      .then(response => {
        alert('Edit Ho gya');
        console.log(response.data);
        fetchFullTasks()
        setIsUpdate(false)
      })
      .catch((err) => {
        console.log("There is a Error to edit : ", err)
      })
    setFormData(defaultTaskData)
  }


  const handleDeleteTask = (id) => {
    axios.post('http://localhost:8080/api/delete-task', { id })
      .then(response => {
        alert('Task deleted successfully');
        axios.get('http://localhost:8080/api/get-tasks')
          .then(response => setFormData(response.data));
          fetchFullTasks()
      })
      .catch(error => console.error('There was an error!', error));
  };

  const myTask = () => {
    let user = localStorage.getItem('user');
    user = JSON.parse(user);
    // console.log(user);
    axios.get(`http://localhost:8080/api/mytask/${user.id}`)
    .then(res => {
      // console.log(res.data)
      setTaskData(res.data);
    })
    .catch(error => {
            console.error('There was an error!', error);
      });
  }


  useEffect(() => {
    // fetchFullTasks();
    myTask();
  }, []);

  return (
    <div className="TaskView">
    
      {/* Add Task Modal Add  */}
      <>

        {showModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-3 max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold center">
                      Add Today Afford Tasks
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

                    <form>
                      <div className="container mx-auto px-4 bg-slate-200 max-w-7xl rounded p-3">
                        <div className="m-2 p-2 border border-white rounded-lg">
                          {/* <div>
                              <h2 className="text-2xl font-bold text-center py-3 my-2">Add Today Afford Tasks</h2>
                            </div> */}
                          <div className="task-box-1 flex">
                            <div className="max-w-7xl mx-auto flex  justify-center min-[320px]:flex-wrap gap-5">
                              {/* Client and Project  Name Select  */}
                              <div className="project-client-name">
                                <label htmlFor="ProjectClient" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Select Project / Client Name</label>
                                <select id="ProjectClient" name="ProjectOrClientName" value={formData.ProjectOrClientName} onChange={handleChange} className="block border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5 light:bg-white-700 dark:border-gray-600 dark:placeholder-black-400 dark:text-black dark:focus:ring-black-500 dark:focus:border-blue-500">
                                  <option>Choose a ProjectOrClientName</option>
                                  <option value="ABC">ABC</option>
                                  <option value="DEF">DEF</option>
                                  <option value="GHI">GHI</option>
                                  <option value="JKL">JKL</option>
                                </select>
                              </div>
                              {/* Project and Client work task category select  */}
                              <div className="project-task-category">
                                <label htmlFor="Category" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Select Category</label>
                                <select id="Category" name="Category" value={formData.Category} onChange={handleChange} className="block border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5 light:bg-white-700 dark:border-gray-600 dark:placeholder-black-400 dark:text-black dark:focus:ring-black-500 dark:focus:border-blue-500">
                                  <option>Choose a Category</option>
                                  <option value="ABC">ABC</option>
                                  <option value="DEF">DEF</option>
                                  <option value="GHI">GHI</option>
                                  <option value="JKL">JKL</option>
                                </select>
                              </div>
                              {/* After category select sub category under category section  */}
                              <div className="project-task-sub-category">
                                <label htmlFor="SubCategory" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Select Sub-Category</label>
                                <select id="SubCategory" name="SubCategory" value={formData.SubCategory} onChange={handleChange} className="block border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5 light:bg-white-700 dark:border-gray-600 dark:placeholder-black-400 dark:text-black dark:focus:ring-black-500 dark:focus:border-blue-500">
                                  <option>Choose a Sub-category</option>
                                  <option value="ABC">ABC</option>
                                  <option value="DEF">DEF</option>
                                  <option value="GHI">GHI</option>
                                  <option value="JKL">JKL</option>
                                </select>
                              </div>
                              {/* Add task description manually */}
                              <div className="project-task-description">
                                <label htmlFor="Description" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Enter Task Description</label>
                                <textarea
                                  type="text"
                                  name="TaskDescription"
                                  value={formData.TaskDescription}
                                  onChange={handleChange}
                                  id="description"
                                  className="block w-60 rounded-md border border-gray-300 p-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  placeholder="Description"
                                />
                              </div>
                              {/* Enter time in minutes  */}
                              <div className="project-task-description">
                                <label htmlFor="ConsumingTimeInMin" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Task Consuming Time in Min.</label>
                                <input
                                  type="number"
                                  name="ConsumingTimeInMin"
                                  value={formData.ConsumingTimeInMin}
                                  onChange={handleChange}
                                  id="ConsumingTimeInMin"
                                  className="block w-60 rounded-md border border-gray-300 p-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 sm:me-60"
                                  placeholder="Time in Min."
                                />
                              </div>

                              <div className="buttons flex justify-start sm:ms-8  ">

                                {

                                  // {/* Add Task Button  */ }
                                  !isUpdate ?
                                    <div className=" m-1 flex flex-col justify-end ">
                                      <button onClick={handleSubmit} className="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-black-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                                        <span className="relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-white-900 rounded-md group-hover:bg-opacity-0">
                                          Add Task
                                        </span>
                                      </button>
                                    </div>
                                    :
                                    // {/* Task Update Button  */}
                                    <div className=" m-1 flex flex-col justify-end ">
                                      <button type="button" onClick={() => { updateTask(); setShowModal(false); }} className="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-black-900 rounded-lg group bg-gradient-to-br from-blue-900 to-blue-600 group-hover:from-red-600 group-hover:to-blue-600 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-100">
                                        <span className="relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-white-900 rounded-md group-hover:bg-opacity-0">
                                          Update Task
                                        </span>
                                      </button>
                                    </div>

                                }
                                {/* Task Clear Button */}
                                <div className="m-1 flex flex-col justify-end">
                                  <button type="reset" onClick={() => setFormData(defaultTaskData)} className="relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-black-900 rounded-lg group bg-gradient-to-br from-red-400 to-red-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                                    <span className="relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-white-900 rounded-md group-hover:bg-opacity-0">
                                      Clear
                                    </span>
                                  </button>
                                </div>
                              </div>


                            </div>
                          </div>
                        </div>
                      </div>
                    </form>

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
                    {/* <button onClick={() => setShowModal(false)} className="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-black-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                        <span className="relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-white-900 rounded-md group-hover:bg-opacity-0">
                          Add Task
                        </span>
                      </button> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>

          {/* Table task show day wise only */}
          <div>
            <h1 className="text-2xl font-bold text-center py-3 my-2">Task Effort Report</h1>
          </div>
          <div className="relative mx-4 overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-white dark:text-gray">
              <thead className="text-xs text-white-900 uppercase bg-white dark:bg-gray-700 dark:text-white-400">
                <tr>
                  <th scope="col" className="px-3 py-2">S.no.</th>
                  <th scope="col" className="px-3 py-2">Project/Client Name</th>
                  <th scope="col" className="px-3 py-2">Category</th>
                  <th scope="col" className="px-3 py-2">Sub-Category</th>
                  <th scope="col" className="px-3 py-2">Task Description</th>
                  <th scope="col" className="px-3 py-2">Consuming time in min</th>
                
                  <th scope="col" className="px-3 py-2">Task Date</th>
                  <th scope="col" className="px-3 py-2 center">Action</th>
                </tr>
              </thead>
              <tbody>
                {taskData.map((task, index) => (
                  <tr key={task.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2">{task.ProjectOrClientName}</td>
                    <td className="px-3 py-2">{task.Category}</td>
                    <td className="px-3 py-2">{task.SubCategory}</td>
                    <td className="px-3 py-2">{task.TaskDescription}</td>
                    <td className="px-3 py-2">{task.ConsumingTimeInMin}</td>
                   
                    <td className="px-3 py-2">{task.task_date}</td>
                    <td className="px-3 py-2 flex-wrap">
                      {/* <Link to="#" onClick={() => { handleEditTask(task) }} dis className="font-medium text-blue-600 dark:text-blue-500 hover:underline px-1">Edit</Link> */}
                      <Link to="#" onClick={() => handleDeleteTask(task.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline px-1">Remove</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      
   
  );
}

export default TaskView;
