import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import LoginPage from "./pages/login-page";
import UserHome from "./pages/user_home";
import { useEffect, useState } from "react";
import FollowUpPage from "./pages/follow_up";

function App() {  
  const [Effect, SetEffect] = useState(false)
<<<<<<< HEAD
    const navigate = useNavigate()
=======
  const navigate = useNavigate()
>>>>>>> host2
  const handleLogout = () => {
    // console.log('in app.js')
    localStorage.removeItem('user');
    console.log(localStorage.getItem('user'));
    navigate('/');
    SetEffect(!Effect);
  }
  useEffect(() => {}, [Effect])
  return (
    <div className="App d-flex flex-column bg-red">
      <header className="App-header">
<<<<<<< HEAD
        <Navbar Logout={handleLogout}/>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<LoginPage Login={SetEffect}/>}></Route>
          <Route path="/HomePage" element={<UserHome/>}></Route>
=======
        <Navbar Logout={handleLogout} />
      </header>
    
      <main>
        <Routes>
          <Route path="/" element={<LoginPage Login={SetEffect} />}></Route>
          <Route path="/HomePage" element={<UserHome />}></Route>
>>>>>>> host2
          <Route path="/HomePage/FollowUpPage/:lead_Id" element={<FollowUpPage/>}></Route>
        </Routes>
      </main>

      <footer>
        <Footer/>
      </footer>
    </div>
  );
}

export default App;
