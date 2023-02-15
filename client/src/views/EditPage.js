import React, {useState, useEffect} from 'react'
import {Link, useParams, useHistory} from "react-router-dom";

import axios from 'axios';
import _ from 'lodash';

import PirateForm from '../components/PirateForm'
import {Pencil} from 'react-bootstrap-icons';

const EditPage = () => {
	
   // i) React Hooks - States
  const [pirate, setPirate] = useState({});
  const [pirateExist, setPirateExist] = useState(false);

  // ii) React Router Hooks - Params and History
  const params = useParams();

  // iii) React Hooks - Effects
  useEffect(() => {
    
    axios.get('http://localhost:8000/api/pirates/' + params.id,{
        // send our cookie along with the axios request
        withCredentials: true
      })
      .then(res => {
        setPirate(res.data);
        setPirateExist(true);
      })
      .catch(err => {
        console.log(err)
        setPirateExist(false);
      })
    
  }, [])
  
  return (

		<div className ="container mt-3">
      
      {pirateExist &&
        <>
          <h2> Edit Pirate </h2>
          <p> Want to modify your pirate? Here below you can do it</p>
          <PirateForm
            formType={"update"}
            pirate={pirate}
            setPirate={setPirate}
          />
        </>
      }

    </div>
	)
}

export default EditPage
