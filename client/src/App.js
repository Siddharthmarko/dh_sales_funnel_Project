import { Routes, Route, useNavigate, Link } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import LoginPage from "./pages/sales_LoginPage";
import UserHome from "./pages/sales_UserHome";
import { useEffect, useState } from "react";
import FollowUpPage from "./pages/follow_up"

function App() {  
  const [Effect, SetEffect] = useState(false)
  // const navigate = useNavigate()
  // const handleLogout = () => {
  //   localStorage.removeItem('user');
  //   // console.log(localStorage.getItem('user'));
  //   navigate('/sales/login');
  //   SetEffect(!Effect);
  // }

  // useEffect(() => {
    
  // }, 
  // [Effect])
  return (
    <div className="App d-flex min-h-screen flex-column bg-red">
      <header className="App-header">
        {/* {
          whichPage == 'sales' ? <Navbar Logout={handleLogout} /> : ''
        }  */}
        
      </header>
      <main>
        {/* <Routes> */}
          {/* <Route path="/sales/login" element={<LoginPage Login={SetEffect} />}></Route>
          <Route path="/HomePage" element={<UserHome />}></Route>
          <Route path="/HomePage/FollowUpPage/:lead_Id" element={<FollowUpPage/>}></Route> */}
        {/* </Routes> */}
      </main>

      <footer>
      {/* {
          whichPage == 'sales' ?   <Footer/> : ''
        }  */}
      
      </footer>
    </div>
  );
}

export default App;
