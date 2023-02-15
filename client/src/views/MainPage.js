import React from 'react'
import { Link } from "react-router-dom";

import PirateTable from '../components/PirateTable'

const MainPage = (props) => {
  

  //-----------------------------------
  // I) HOOKS & VARIABLES
  // ----------------------------------

  // i) Lifting States
  const {userLoggedIn} = props;

  //-----------------------------------
  // II) JSX
  // ----------------------------------
   
  return (
    <div className ="container mt-3">
      
      <h2> Welcome {userLoggedIn.username}! </h2>
      <p> Here the new recruits for your next adventure!!</p>
      <PirateTable
        userLoggedIn = {userLoggedIn}
      />
      

    </div>
  )
}

export default MainPage
