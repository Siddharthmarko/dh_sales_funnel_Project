import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

// import all image
import BLogoImg from '../assets/images/brand_logo.png'
// import LogoutImg from '../assets/images/logout.png'
import { GrLogin } from "react-icons/gr";
import { BiLogOut } from "react-icons/bi";
<<<<<<< HEAD

function Navbar({Logout}) {
  const [user,setUser] = useState(localStorage.getItem('user'));

 useEffect(()=>{
  setUser(localStorage.getItem('user'))
=======
import { FaRegUserCircle } from "react-icons/fa";


function Navbar({Logout}) {
  const [user,setUser] = useState(localStorage.getItem('user'));
  const [userName, setUserName] = useState('defai;t nmame');

 useEffect(()=>{
  setUser(localStorage.getItem('user'))
  let obj = localStorage.getItem('user');
  obj = JSON.parse(obj);
  console.log(obj);
  setUserName(obj?.name || 'defualt name');
>>>>>>> host2
 },[localStorage.getItem('user')])

  return (
    <Wrapper>
<<<<<<< HEAD
      <div className="navbarSection m-2 p-1 border rounded">
=======
      <div className="navbarSection m-2 p-1 border rounded fs-5">
>>>>>>> host2
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand p-2" to="#"><img src={BLogoImg} alt="Logo_image" /></Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">

<<<<<<< HEAD
                  {!localStorage.getItem('user') || <Link className="nav-link active mpadding " aria-current="page" to="/HomePage">Home</Link>
=======
                  {!localStorage.getItem('user') || <Link className="nav-link active mpadding  " aria-current="page" to="/HomePage">Home</Link>
>>>>>>> host2

                  }

                </li>
<<<<<<< HEAD
              </ul>
              {
                localStorage.getItem('user') ? <> <button onClick={Logout} className="btn btn-outline-none text-danger logout my-2 px-3"><BiLogOut /> Logout</button> </> :
=======
                
              </ul>
              {
                localStorage.getItem('user') ? <> <span className='text-center '> < FaRegUserCircle className='mx-3'/> {userName}
                </span> <button onClick={Logout} className="btn btn-outline-none text-danger logout my-2 px-3"><BiLogOut /> Logout</button> </> :
>>>>>>> host2
                  <button  className="btn login my-2 px-3 " type="login" > Login <GrLogin /></button>
              }

            </div>
          </div>
        </nav>
      </div>
    </Wrapper>
  );
};

export default Navbar;

//CSS Styled Section use only low css styled

const Wrapper = styled.section`
.navbar-brand img{
  width: 7rem;
}
.logout a{
  text-decoration: none;
  color: red;
}

@media screen and (max-width: 992px){

  
}
button a{
  text-decoration: none;
}

.mpadding{
    padding: 0 0.5rem; 
    margin: 1rem;

  }



`