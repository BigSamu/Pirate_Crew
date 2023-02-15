import React, {useState, useEffect} from 'react'
import {Link, useParams} from "react-router-dom";

import {Row, Col, Image} from 'react-bootstrap'


import DeleteButton from '../components/DeleteButton'


import {Pencil } from 'react-bootstrap-icons';

import axios from 'axios';
import _ from 'lodash';
import io from 'socket.io-client'

const PirateDetails = (props) => {
  //-----------------------------------
  // I) HOOKS & VARIABLES
  // ----------------------------------

  // i) Lifting States
  const {userLoggedIn} = props;

  // ii) React Hooks - States
  const [pirate, setPirate] = useState({});
  const [socket] = useState(() => io('http://localhost:8000')); // setSocket not needed

  // iii) React Router Hooks - Params and History
  const params = useParams();
  
  // iv) React Hooks - Effetcs

  useEffect(()=>{
    
    socket.on("pirate_updated", pirateToUpdate => {
      setPirate((currentPiratesList) => pirateToUpdate)
    })

    // useEffect will only run the return when the component is closed
    return () => socket.disconnect();
  },[])

  useEffect(() => {
    
    axios.get('http://localhost:8000/api/pirates/' + params.id,{
        // send our cookie along with the axios request
        withCredentials: true
      })
      .then(res => {
        
        setPirate(res.data);
      })
      .catch(err => {
        console.log(err.response);
      });
    
  }, [])


  //-----------------------------------
  // II) JSX
  // ----------------------------------

  return (
    <>
    
      <div className = "row mt-3 p-3 border border-1 border-dark rounded">
        <Row>
          <Col>
          <h2 className = "text-center"> 
            {pirate.name} 
          </h2>   
          <div className = "text-center mh-100">
            <Image src={pirate.imageUrl} thumbnail />
          </div>
          <p className = "fst-italic text-center mt-2">"{pirate.catchPhrase}"</p>
            
          </Col>
          <Col>
          <div className = "bg-light border border-1 rounded mt-4 px-5 py-3">
            <h3 className = "text-center my-1"> 
              About
            </h3> 
              <table className="table w-75 table-borderless mb-2">
                <tbody>
                  <tr >
                    <td className = "fw-bold"># of Treasure Chests</td>
                    <td>{pirate.treasureChests}</td>
                  </tr>
                  
                  <tr>
                    <td className = "fw-bold">Crew Position</td>
                    <td>{pirate.crewPosition}</td>
                  </tr>
                  <tr>
                    <td className = "fw-bold">Peg Leg</td>
                    <td>
                      {(pirate.pirateCharacteristics && 
                        pirate.pirateCharacteristics.pegLeg === true) ? "Yes" : "No"}
                    </td>
                  </tr>
                  <tr>
                    <td className = "fw-bold">Eye Patch</td>
                    <td>
                      { (pirate.pirateCharacteristics && 
                        pirate.pirateCharacteristics.eyePatch === true) ? "Yes" : "No"}
                    </td>
                  </tr>
                  <tr>
                    <td className = "fw-bold">Hook Hand</td>
                    <td>
                      {(pirate.pirateCharacteristics && 
                        pirate.pirateCharacteristics.hookHand === true) ? "Yes" : "No"}
                    </td>
                  </tr>
                </tbody>
              </table>
              
              { (!_.isEmpty(pirate) && (pirate.createdBy._id === userLoggedIn.userId))    &&
                <div className="mb-2">      
                  <DeleteButton
                    pirate = {pirate}
                    buttonLocation = {"form_component"}
                  ></DeleteButton>

                  <Link 
                  className="btn btn-success btn-sm mx-1 " 
                  to = {"/pirates/edit/" + pirate._id}
                  >
                    <><Pencil className="mb-1"/> <span className="ps-2">Edit</span></>
                  </Link>
                </div>
            }
            </div>
          </Col>
        </Row>

        <div className = "mt-2">
          <Link to={"/"}>Back to Home</Link>
        </div>

      </div>
    </>
  )
}

export default PirateDetails
