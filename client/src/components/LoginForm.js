import React, { useState } from "react";
import {useHistory} from "react-router-dom"

import {Form, Row, Col, Button} from 'react-bootstrap'

import _ from 'lodash';
import axios from "axios";


const LoginForm = (props) => {

	//-----------------------------------
  // I) HOOKS & VARIABLES
  // ----------------------------------

  // i) Lifting States
  const {userLoggedIn, setUserLoggedIn} = props;

	// ii) React Hooks - States
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: ""
  });
  const [errorMessages, setErrorMessages] = useState("");

	// iii) React Router Hooks - History
  const history = useHistory();

	//------------------------------------------
  // II) API CALLS, HANDLERS & AUX FUNCTIONS
  // -----------------------------------------

	// i) API Calls

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
        setUpErrorsMessages(err);
      });
  };

	// ii) Handlers

  const handleChangeInUserFields = (e) => {
    setUserCredentials({
      ...userCredentials,
      [e.target.name]: e.target.value
    });
  }

	const handleLoginForm = (e) => {
		e.preventDefault();
		loginUser();
	}

  // iii) Auxiliar Functions

  const setUpErrorsMessages = (err) => {
    console.log(err)
    setErrorMessages("Invalid Login. Please try again");
  }

	//------------------------------------------
  // II) JSX
  // -----------------------------------------

  return (
    <div className="py-3">
      <h3 className = "text-center">Login</h3>
      <Form onSubmit={handleLoginForm} className ="my-3">
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
            { (errorMessages !== "") &&
              <div className = "text-danger small text-start">{errorMessages}</div>
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
            Login
          </Button>

          
        </div>

      </Form>
    </div>
  );
}

export default LoginForm
