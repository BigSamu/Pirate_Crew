import React, {useState, useEffect} from 'react'

import {Link} from "react-router-dom";

import DeleteButton from './DeleteButton'

import axios from 'axios';
import _ from 'lodash';
import io from 'socket.io-client'

const PirateTable = (props) => {

  //-----------------------------------
  // I) HOOKS & VARIABLES
  // ----------------------------------

  // i) Lifting States
  const {userLoggedIn, setUserLoggedIn} = props;

  // ii) React Hooks - States
  const [piratesList, setPiratesList] = useState([]);
  const [socket] = useState(() => io('http://localhost:8000')); // setSocket not needed
  
  // iii) React Hooks - Effects

  useEffect(()=>{
    socket.on("connect", () => {
      console.log("Connected on the client - ID: " + socket.id)
    })
    socket.on("new_pirate_added", pirateToAdd => {
      setPiratesList((currentPiratesList) => {
        let finalPirateList = _.orderBy([...currentPiratesList, pirateToAdd],['crewPosition'],['asc'])
        return finalPirateList
      })
    })
    socket.on("pirate_deleted", pirateToDelete => {
      setPiratesList((currentPiratesList) => {
        let finalPirateList = currentPiratesList.filter(pirate => pirate._id !== pirateToDelete._id);
        return finalPirateList
      })
    })
    socket.on("pirate_updated", pirateToUpdate => {
      setPiratesList((currentPiratesList) => {
        let filteredList = currentPiratesList.filter(pirate => pirate._id !== pirateToUpdate._id);
        console.log(filteredList)
        let finalPirateList = _.orderBy([...filteredList, pirateToUpdate],['crewPosition'],['asc'])
        return finalPirateList
      })
    })

    // useEffect will only run the return when the component is closed
    return () => socket.disconnect();
  },[])

  useEffect(()=>{
    getAllPirates();
  },[])

  //-----------------------------------
  // II) HANDLERS
  // ----------------------------------

  const getAllPirates = async () => {
    await axios.get('http://localhost:8000/api/pirates',{
    // send our cookie along with the axios request
			withCredentials: true
    })
    .then(res=>{  
      setPiratesList(_.orderBy(res.data,['crewPosition'],['asc']));
    }); 
  }

  const removePirateFromList = (pirateId) => {
    setPiratesList(piratesList.filter(pirate => pirate._id !== pirateId));
  }

  //-----------------------------------
  // III) JSX
  // ----------------------------------

  return (
    
      <div className ="w-75">
      <table className="table table-striped">
        <thead>
          <tr className="bg-secondary text-light">
            <th scope="col">#</th>
            <th scope="col"> </th>
            <th scope="col">Name</th>
            <th scope="col">Crew Position</th>
            <th scope="col">Added By</th>
            <th scope="col" className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          { piratesList.map((pirate, index) => 
            <tr key={index}>
              <th scope="row" className="align-middle">{index+1}</th>
              <td> 
                <div className="text-center">
                  <img
                    alt=""
                    src={pirate.imageUrl}
                    height="100"
                    className="bg-white p-1 border border-"
                  /> 
                </div>
              </td>
              <td className="align-middle">{pirate.name}</td>
              <td className="align-middle">{pirate.crewPosition}</td>
              <td className="align-middle">{pirate.createdBy.username}</td>
              <td className="text-center align-middle" >
                <Link 
                  className="btn btn-link btn-sm py-0 pe-1 ps-0" 
                  to = {"/pirates/"+pirate._id}>
                  Details
                </Link>
                
                { (pirate.createdBy._id === userLoggedIn.userId) &&
                  <>
                    |
                    <Link 
                      className="btn btn-link btn-sm py-0 pe-1 ps-1" 
                      to = {"/pirates/edit/" + pirate._id}>
                      Edit
                    </Link>
                    |
                    <DeleteButton 
                      pirate = {pirate}
                      buttonLocation = {"table_component"}
                      removePirateFromList = {removePirateFromList}
                    />
                  </>
                }
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  
  )
}

export default PirateTable
