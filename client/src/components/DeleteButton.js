import React, {useState} from 'react'
import {useHistory} from "react-router-dom";

import axios from 'axios';
import _ from 'lodash';
import io from 'socket.io-client'

import { Trash } from 'react-bootstrap-icons';

const DeleteButton = (props) => {

  //-----------------------------------
  // I) HOOKS & VARIABLES
  // ----------------------------------

  // i) Lifting States
  const {pirate, buttonLocation, removePirateFromList} = props;

  // ii) React Hooks - States
  const [socket] = useState(() => io('http://localhost:8000')); // setSocket not needed

  // iii) React Router Hooks - History
  const history = useHistory();

  //-----------------------------------
  // II) HANDLERS
  // ----------------------------------

  const deletePirate = (pirateId) =>{
    
    axios.delete('http://localhost:8000/api/pirates/delete/' + pirateId,{
      // send our cookie along with the axios request
        withCredentials: true
      })
      .then(res => {
        socket.emit("deleted_pirate", res.data)
        socket.disconnect()
        if(buttonLocation === "table_component")
          removePirateFromList(pirateId)
        else{
          history.push("/")
        } 
      })
      .catch(err => {
        console.log(err)

      })
  }
  
  //-----------------------------------
  // II) JSX
  // ----------------------------------

  return (
    <>  
      {(buttonLocation==="table_component") 
      ?
        <button 
          name = "deleteButton"
          className="btn btn-link btn-sm py-0 pe-0 ps-1" 
          onClick = {(e) => deletePirate(pirate._id)}
        >
          Delete
        </button>
      :
        <button 
          name = "deleteButton"  
          className="btn btn-danger btn-sm mx-1" 
          onClick = {(e) => deletePirate(pirate._id)}
        >
          <Trash className="mb-1"/> <span className="ps-2">Delete</span>
        </button>
      }
    </>
  )
}

export default DeleteButton
