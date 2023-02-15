import React, {useState, useEffect} from 'react'
import {Link, useParams, useHistory} from "react-router-dom";

import {Row, Col, Image} from 'react-bootstrap'


import DeleteButton from '../components/DeleteButton'
import PirateDetails from '../components/PirateDetails'

import {Pencil } from 'react-bootstrap-icons';

import axios from 'axios';
import _ from 'lodash';

const DetailsPage = (props) => {

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
      
      <PirateDetails
        userLoggedIn = {userLoggedIn}
      />
      
    </div>
  )
}

export default DetailsPage
