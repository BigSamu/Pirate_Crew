import React, {useState, useEffect} from 'react'

import {Link, useLocation, useHistory} from "react-router-dom";

import {Navbar, Container, Nav} from 'react-bootstrap'

import pirateLogo from "../assets/pirate-logo.png";

import axios from 'axios';
import _ from 'lodash';

const Navigationbar = () => {
    
  //-----------------------------------
  // I) HOOKS & VARIABLES
  // ----------------------------------
  
  // i) React Hooks - State
  const [currentView, setCurrentView] = useState('');

  // ii) React Router Hooks - Params and History
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    console.log(location.pathname)
    if (location.pathname === "/")
      setCurrentView("mainPage")
    else if(location.pathname === "/pirates/new")
      setCurrentView("addPage")
    else if(_.includes(location.pathname, "edit"))
      setCurrentView("editPage")
    else if(location.pathname === "/login")
      setCurrentView("logRegPage")
    else
      setCurrentView("detailsPage")
  }, [location])

  //------------------------------------------
  // II) API CALLS, HANDLERS & AUX FUNCTIONS
  // -----------------------------------------

  const logoutUser = async () => {
    
    axios.get('http://localhost:8000/api/users/logout',{
      withCredentials: true
    })
    .then(res=> {
      console.log("Response: ", res)
      sessionStorage.clear();
      history.push("/login")
    })
    .catch(err=>{
      console.log("Error: ", err)  
    })
  }

  // ii) Handlers
  const handleLogout = (e) => {
    logoutUser()
  };



  //-----------------------------------
  // III) JSX
  // ----------------------------------

  return (
    <>   
      <Navbar bg="secondary" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt=""
              src={pirateLogo}
              width="50"
              height="50"
              className="bg-white p-1"
            />
            <span className="mx-3">The Pirate App</span>
          </Navbar.Brand>
          <Nav className="ms-auto">
            {
              (currentView !== "logRegPage" && currentView !== "addPage") && 
              <Link 
                to="/pirates/new" 
                className="nav-link active text-decoration-underline"
              >
                New Pirate
              </Link>
            }
            {
              (currentView !== "logRegPage" && currentView !== "mainPage") && 
              <Link 
                to="/" 
                className="nav-link active text-decoration-underline"
              >
                Home
              </Link>
            }
            {
              (currentView !== "logRegPage") && 
              <button  
                className="btn nav-link active text-decoration-underline shadow-none"
                onClick = {handleLogout}
              >
                Logout
              </button>
            }
          </Nav>
        </Container>
      </Navbar>

    </>
  )
}

export default Navigationbar
