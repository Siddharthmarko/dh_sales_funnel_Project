import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminHomePage() {

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assign, setAssign] = useState([]);

  useEffect(() => {
    // Fetch users for the dropdown
    axios.get('http://localhost:8080/api/users') //  you have an endpoint to fetch users
      .then(response => {
        setUsers(response.data);
        // console.log(response.data , 'line 14 admin home ')
      })
      .catch(error => {
        console.error("There was an error fetching the users!", error);
      });

      //Projects Fetch Details 
      axios.get('http://localhost:8080/api/projects')
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
      //Assign Proojects Fetch Details 
      axios.get('http://localhost:8080/api/assign-projects')
      .then(response => {
        setAssign(response.data);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });




  }, []);



  return (
    <>
        <div className="container border rounded-4 shadow-lg my-5 ">
          <div className="flex-1  p-6">
            <h1 className="text-4xl font-bold">Welcome back, DOAGuru</h1>
            <div className="  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

              <Link to="">
              
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-gray-600">Total Register Employee</p>
                </div>
              </Link>

              <Link to="">

                <div className="p-4 bg-white rounded-lg shadow-md">

                  <p className="text-2xl font-bold">{projects.length}</p>

                  <p className="text-gray-600">Total Projects</p>
                </div>
              </Link>
              <div className="p-4 bg-white rounded-lg shadow-md">
                <p className="text-2xl font-bold">{assign.length}</p>
                <p className="text-gray-600">Assign Projects </p>
              </div>
            </div>
          </div>
        </div>
   
    </>
  );
}
export default AdminHomePage;
