import { useState, useEffect } from 'react';
import axios from 'axios';

const TaskReportDownload = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch users for the dropdown
    axios.get('https://sf.doaguru.com/api/users') //  you have an endpoint to fetch users
      .then(response => {
        setUsers(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error("There was an error fetching the users!", error);
      });
  }, []);

  useEffect(() => {
    if (selectedUserId) {   
      console.log(selectedUserId) 
      // console.log('line numebr 24');
      // Fetch tasks for the selected user
      axios.get(`https://sf.doaguru.com/api/getUserTasks/${selectedUserId}`)
        .then(response => {
          setTasks(response.data);
          console.log(response.data)
        })
        .catch(error => {
          console.error("There was an error fetching the tasks!", error);
        });
    }
  }, [selectedUserId]);

  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
  };

  const handleDownload = () => {
    window.location.href = `https://sf.doaguru.com/api/downloadUserTasks/${selectedUserId}`;
  };

  return (
    <div className='container mx-auto px-4 '>
      
    <div>
      <h1 className='text-center font-bold text-2xl'>Admin Report Dashboard</h1>
      <div className='flex gap-3 px-5'>
        <label className='text-xl'>Select User:</label>
        <select onChange={handleUserChange} className='border-2 rounded-lg px-1 border-cyan-600'>
          <option value="" className='text-orange-900 '>Select a user</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.full_name}</option>
          ))}
        </select>
      </div>
      <div className='flex justify-center flex-col '>
        <h2 className='text-center font-bold text-2xl'>Tasks</h2>
        <div className='relative mx-4 overflow-x-auto shadow-md sm:rounded-lg'>
        {tasks.length > 0 ? (
          <table className="w-full text-sm text-left rtl:text-right text-white dark:text-gray">
            <thead className="text-xs text-white-900 uppercase bg-white dark:bg-gray-700 dark:text-white-400">
              <tr>
                <th scope="col" className="px-3 py-2 center " >Project or Client Name</th>
                <th scope="col" className="px-3 py-2 center " >Category</th>
                <th scope="col" className="px-3 py-2 center " >SubCategory</th>
                <th scope="col" className="px-3 py-2 center " >Task Description</th>
                <th scope="col" className="px-3 py-2 center " >Consuming Time in(Min)</th>
                <th scope="col" className="px-3 py-2 center " >Task Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 center ">
                  <td className="px-3 py-2">{task.ProjectOrClientName}</td>
                  <td className="px-3 py-2">{task.Category}</td>
                  <td className="px-3 py-2">{task.SubCategory}</td>
                  <td className="px-3 py-2">{task.TaskDescription}</td>
                  <td className="px-3 py-2">{task.ConsumingTimeInMin}</td>
                  <td className="px-3 py-2">{task.task_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='text-red-600 font-bold m-1 p-2 '>No tasks found for the selected user .</p>
        )}
        </div>
      </div>
      <div className='flex justify-end mt-5'>

      <button className='border-2 rounded-lg border-green-500 px-2 hover:bg-green-100  ' onClick={handleDownload} disabled={!selectedUserId}>
        Download Tasks as Excel
      </button>
      </div>
    </div>

    </div>
  );
};

export default TaskReportDownload;
