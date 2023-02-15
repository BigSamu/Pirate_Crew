import React, { useState } from "react";
import {useHistory} from "react-router-dom"

import {Form, Row, Col, Button} from 'react-bootstrap'

import _ from 'lodash';
import axios from "axios";

const RegisterForm = (props) => {

  //-----------------------------------
  // I) HOOKS & VARIABLES
  // ----------------------------------

  // i) Lifting States
  const {userLoggedIn, setUserLoggedIn} = props;

	// i) React Hooks - States
  const [confirmReg, setConfirmReg] = useState("");
  const [ userCredentials, setUserCredentials ] = useState({
    username: "",
    email: "", 
    password: "", 
    confirmPassword: "",
  })
  const [errorMessages, setErrorMessages] = useState({});

  // iii) React Router Hooks - History
  const history = useHistory();
  
  //------------------------------------------
  // II) API CALLS, HANDLERS & AUX FUNCTIONS
  // -----------------------------------------

  // i) API Calls
  const registerUser = () => {
    
    axios.post("http://localhost:8000/api/users/register", userCredentials,             
    {
      // this will force the sending of the credentials / cookies so they can be updated
      // XMLHttpRequest from a different domain cannot set cookie values for their own domain 
      // unless withCredentials is set to true before making the request
      withCredentials: true,
    })
    .then(res => {
      // when we successfully created the account, reset state for registration form
      // We do this if we are NOT navigating automatically away from the page
      setUserCredentials({
        username: "",
        email: "", 
        password: "", 
        confirmPassword: "",
      })

      setConfirmReg("Thank you for Registering, you can now log in!");
      setErrorMessages({});  // remember to reset errors state if it was successful
      loginUser();
    })
    .catch((err) => {
      console.log(err.response.data.errors);
      setUpErrorsMessages(err)
    });
    
  };

  const loginUser = () => {
   
    axios.post("http://localhost:8000/api/users/login", userCredentials,
      {
        // this will force the sending of the credentials / cookies so they can be updated
        //    XMLHttpRequest from a different domain cannot set cookie values for their own domain 
        //    unless withCredentials is set to true before making the request
        withCredentials: true
      })
      .then((res) => {
        setUserLoggedIn(res.data.userLoggedIn)
        history.push("/");
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  // ii) Handlers
  const handleChangeInUserFields = (e) => {
    setUserCredentials({
      ...userCredentials,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    registerUser();
  };

  // iii) Auxiliar Functions

  const setUpErrorsMessages = (err) => {
    let errors = err.response.data.errors;
    let auxErrors = {
      username: "",
      email: "", 
      password: "", 
      confirmPassword: "",
    }
    _.keys(errors).map(errorType => 
      auxErrors[errorType] = errors[errorType].message
    )
    console.log(auxErrors)
    setErrorMessages(auxErrors);
  }


  //------------------------------------------
  // II) JSX
  // -----------------------------------------

  return (
    <div className="py-3">
      <h3 className = "text-center">Register</h3>
      <Form onSubmit={handleSubmitRegistration} className ="my-3">
        
        <Form.Group as={Row} controlId="username" className="mb-2 text-end">
          <Form.Label column sm={3}>
            Username
          </Form.Label>
          <Col sm={7}>
            <Form.Control 
              type="text"
              name = "username" 
              placeholder="John Doe"
              onChange ={handleChangeInUserFields}
              value = {userCredentials.username}
            />
            {(_.has(errorMessages, 'username')) &&
              <div className = "text-danger small text-start">{errorMessages.username}</div>
            }
          </Col>
        </Form.Group>
        
        <Form.Group as={Row} controlId="email" className="mb-2 text-end">
          <Form.Label column sm={3}>
            Email
          </Form.Label>
          <Col sm={7}>
            <Form.Control 
              type="email"
              name = "email" 
              placeholder="johndoe@gmail.com"
              onChange ={handleChangeInUserFields}
              value = {userCredentials.email}
            />
            {(_.has(errorMessages, 'email')) &&
                  <div className = "text-danger small text-start">{errorMessages.email}</div>
            }
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="password" className="mb-2 text-end">
          <Form.Label column sm={3}>
            Password
          </Form.Label>
          <Col sm={7}>
            <Form.Control 
              type="password"
              name = "password" 
              onChange ={handleChangeInUserFields}
              value = {userCredentials.password}
            />
            {(_.has(errorMessages, 'password')) &&
              <div className = "text-danger small text-start">{errorMessages.password}</div>
            }
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="password" className="mb-2 text-end">
          <Form.Label column sm={3}>
            Confirm Password
          </Form.Label>
          <Col sm={7}>
            <Form.Control 
              type="password"
              name = "confirmPassword" 
              onChange ={handleChangeInUserFields}
              value = {userCredentials.confirmPassword}
            />
            {(_.has(errorMessages, 'password')) &&
              <div className = "text-danger small text-start">{errorMessages.confirmPassword}</div>
            }
          </Col>
        </Form.Group>

        <div className="text-center">
          
          <Button 
            variant="primary" 
            type="submit"
            size="sm"
            className = "mt-2 px-4"
          >
            Register
          </Button>

          
        </div>

      </Form>
    </div>
  );
}

export default RegisterForm;


