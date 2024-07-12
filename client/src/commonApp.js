import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
// import App from "./App";
// Sales App
import Sales_Navbar from "./components/navbar";
import Sales_Footer from "./components/footer"; 
import Sales_LoginPage from "./pages/sales_LoginPage";
import Sales_UserHome from "./pages/sales_UserHome";
import FollowUpPage from "./pages/follow_up"

// Task Efforts
import LoginPage from './Task/pages/loginPage';
import Navbar from './Task/components/navbar';
import Footer from './Task/components/footer';
import UserHome from './Task/pages/Employee/userHome';
import TaskView from './Task/pages/Employee/taskShow';

// Admin file import 
import AdminNavbar from './Task/components/adminNavbar';
import AdminHomePage from './Task/pages/Admin/adminHome';
import EmployeePage from './Task/pages/Admin/Employees';
import RegisterUser from './Task/pages/Admin/registerUser';
import ProjectsPage from './Task/pages/Admin/projects';
import AddData from './Task/pages/Admin/Addprojects';
import ProjectAssignmentForm from './Task/pages/Admin/assignProoject';
import TaskReportDownload from './Task/pages/Admin/Report';
import Blank from './Task/pages/blank';


const Commonjs = () => {
    const navigate = useNavigate();
    const [render, setRender] = useState(false);
    const [page, setPage] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const handleLogout = () => {
    // console.log('Logout function called');
    localStorage.removeItem('user')
    setRender(true);
    navigate('/');
    handleRender();
  }

    const handleRender = () => {
    setRender(!render)
  }

    useEffect(() => {
        let path = window.location.pathname;
        if(path.includes('sales')) {
            setPage('sales');
        } else if(path.includes('task')) {
            setPage('task');
        } else {
            setPage(null);
        }
        console.log(page);
        const user = JSON.parse(localStorage.getItem('user'));
          if (user) {
            setUserRole(user.role)
        }
    }, [window.location.pathname]);

    return (
        <>    {
                page == 'task' 
                    ?  userRole === 'admin' 
                        ? <AdminNavbar Logout={handleLogout} render={render} /> 
                        :  <Navbar Logout={handleLogout} render={render} />
                    : page === 'sales' ? <Sales_Navbar Logout={handleLogout} /> 
                : ''

                } 
                <Routes>
                <Route path="/" element={
                        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                    
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-white mb-8">Choose Your Platform</h1>
                            <div className="space-x-4">
                                <Link 
                                    to={'/sales/login'}
                                    className="bg-white text-blue-500 font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-blue-500 hover:text-black transition-all duration-300 transform hover:scale-105"
                                >
                                    Sales
                                </Link>
                                <Link 
                                    to={'/task/login'}
                                    className="bg-white text-purple-500 font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-purple-500 hover:text-black transition-all duration-300 transform hover:scale-105"
                                >
                                    Task
                                </Link>
                            </div>
                        </div>
                    </div>
                    } />
                {/*--------------- Sales app ----------------- */}
                    {/* <App /> */}
                    <Route path="/sales/login" element={<Sales_LoginPage Login={setRender} />}></Route>
                    <Route path="/sales/HomePage" element={<Sales_UserHome />}></Route>
                    <Route path="/sales/HomePage/FollowUpPage/:lead_Id" element={<FollowUpPage/>}></Route>
                
                {/*--------------- Task app ----------------- */}
                    {/* <TaskApp /> */}
                     {/* {userRole === 'admin' ? (<Route path='/' element={<AdminHomePage/>}/>) : (<Route path="/Logout" element={<LoginPage setRender={handleRender} />} />)} */}
                    <Route path="/task/login" element={<LoginPage setRender={handleRender} />} />
                    <Route path="/task/UserHome" element={<UserHome />} />
                    <Route path="/task/TaskView" element={<TaskView />} />

                    {/* Admin Routes  */}
                    <Route path='/task/Admin-Home-page' element={<AdminHomePage/>}/>
                    <Route path='/task/employee-show-register-page' element={<EmployeePage/>}/>
                    <Route path="/task/registerUser" element={<RegisterUser/>} />
                    <Route path="/task/project-add" element={<ProjectsPage/>} />
                    <Route path="/task/AddProject" element={<AddData/>} />
                    <Route path="/task/assign-projects" element={<ProjectAssignmentForm/>} />
                    <Route path="/task/Employee-report" element={<TaskReportDownload/>} />
                    <Route path='/task/blank' element={<Blank/>}/>
            </Routes>
            {
                page == 'task' ? <Footer/> : page == 'sales' ?   <Sales_Footer/> : ''
            }   
        </>
    );
}

export default Commonjs;
