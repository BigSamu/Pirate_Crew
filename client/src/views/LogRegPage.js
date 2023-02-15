import React from 'react'
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

import {Row, Col, Container} from 'react-bootstrap'

const LogRegPage = (props) => {
  
  //-----------------------------------
  // I) HOOKS & VARIABLES
  // ----------------------------------

	// i) Lifting States
  const {userLoggedIn, setUserLoggedIn} = props;
  
  //-----------------------------------
  // II) JSX
  // ----------------------------------

  return (
    <Container className = "mt-5">
      <hr/>
      <Row>
        <Col>
          <LoginForm
            userLoggedIn = {userLoggedIn}
            setUserLoggedIn = {setUserLoggedIn}
          />
        </Col>
        <Col>
          <RegisterForm
            userLoggedIn = {userLoggedIn}
            setUserLoggedIn = {setUserLoggedIn}
          />
        </Col>
      </Row>
      <hr/>
    </Container>
  )
}

export default LogRegPage
