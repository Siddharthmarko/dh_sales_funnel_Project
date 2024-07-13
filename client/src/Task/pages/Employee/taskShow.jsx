import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import toast from "react-hot-toast";


function TaskView() {
  const [taskData, setTaskData] = useState([]);
  const handleDeleteTask = (id) => {
    axios.post('http://localhost:8080/api/delete-task', { id })
      .then(response => {
        toast.success('Task deleted successfully',{position: 'top-right'});

        console.log('task dlete');
        myTask();
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

    myTask();
  }, []);

  return (
    <div className="TaskView min-h-screen">

      {/* Add Task Modal Add  */}
      <>
      </>

      {/* Table task show day wise only */}
      <div>
        <h1 className="text-2xl font-bold text-center py-3 my-2">Task Effort Report</h1>
      </div>
      <div className="relative mx-4 overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray">
          <thead className="text-xs text-white-900 uppercase bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
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
              <tr key={task.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:text-gray-100 dark:border-gray-700">
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
