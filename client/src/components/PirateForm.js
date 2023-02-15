import React, {useState, useEffect} from 'react'
import {Link, useParams, useHistory} from "react-router-dom";

import {Form, Row, Col, Button} from 'react-bootstrap'
import {PlusSquareFill, Pencil } from 'react-bootstrap-icons';

import DeleteButton from './DeleteButton'

import axios from 'axios';
import _ from 'lodash';
import io from 'socket.io-client'


const PirateForm = (props) => {

  //-----------------------------------
  // I) HOOKS & VARIABLES
  // ----------------------------------

  // i) Lifting States
  const {formType, pirate, setPirate} = props;

  // ii) React Hooks - States
  
  const [errorMessages, setErrorMessages] = useState({
    name: '',
    imageUrl: '',
    treasureChests: '',
    catchPhrase: '',
    crewPosition: '',
    pirateCharacteristics: {
      pegLeg: false,
      eyePatch: false,
      hookHand: false
    }
  });

  const [updateAction, setUpdateAction] = useState('') // Delete or Edit
  const [socket] = useState(() => io('http://localhost:8000')); // setSocket not needed

  // iii) React Router Hooks - Params and History
  const params = useParams();
  const history = useHistory();

  // v) React Hooks - Effetcs

  useEffect(() => {
    
    if(formType === "update") {
      axios.get('http://localhost:8000/api/pirates/' + params.id,{
        // send our cookie along with the axios request
        withCredentials: true
      })
        .then(res => {
          setPirate(res.data);
          console.log(res.data)
        })
    }
  }, [])
 

  //------------------------------------------
  // II) API CALLS, HANDLERS & AUX FUNCTIONS
  // -----------------------------------------

  // i) API Calls
  const createPirate = async (pirate) => {
    await axios.post('http://localhost:8000/api/pirates/new', pirate,{
        // send our cookie along with the axios request
        withCredentials: true
      })
      .then(res=>{
        console.log("Response: ", res)
        socket.emit("added_new_pirate", res.data)
        socket.disconnect()
        setPirate({
          name: '',
          imageUrl: '',
          treasureChests: '',
          catchPhrase: '',
          crewPosition: '',
          pirateCharacteristics: {
            pegLeg: false,
            eyePatch: false,
            hookHand: false
          }
        })
        history.push("/")
      })
      .catch(err=>{
        console.log("Error: ", err)
        setUpErrorsMessages(err)
        
      })
  }

  const updatePirate = async (pirate) => {
    
    axios.put('http://localhost:8000/api/pirates/edit/'+params.id, pirate,{
      // send our cookie along with the axios request
      withCredentials: true
    })
    .then(res=> {
      socket.emit("updated_pirate", res.data)
      socket.disconnect()
      if(updateAction==='edit')
        history.push("/pirates/"+params.id)
      else
        history.push("/")
    })
    .catch(err=>{
      console.log(err)
      setUpErrorsMessages(err)
      
    })
  }

  // ii) Handlers
  const handleChangeInFields = (e) => {
    
    if(e.target.name !== "pegLeg" &&
       e.target.name !== 'eyePatch' && 
       e.target.name !== 'hookHand'){
      setPirate({
        ...pirate,
        [e.target.name]: e.target.value
      });
    }
    else{
      
      setPirate({
        ...pirate,
        pirateCharacteristics:{
          ...pirate.pirateCharacteristics,
          [e.target.name]: !pirate.pirateCharacteristics[e.target.name]
        }
      });
    }


  };
  
  const handleSubmitPirateDetails = (e) => {
    e.preventDefault();
    if(formType === "create"){
      createPirate(pirate)
    }
    else if (formType === "update"){
      updatePirate(pirate)
    }
  }

  // iii) Auxiliar Functions

  const setUpErrorsMessages = (err) => {
    let errors = err.response.data.errors;
    let auxErrors = {
      name: '',
      imageUrl: '',
      treasureChests: '',
      catchPhrase: '',
      crewPosition: '',
      pirateCharacteristics: {
        pegLeg: false,
        eyePatch: false,
        hookHand: false
      }
    }
    _.keys(errors).map(errorType => 
      auxErrors[errorType] = errors[errorType].message
    )
    setErrorMessages(auxErrors);
  }

  //-----------------------------------
  // III) JSX
  // ----------------------------------

  return (
    <div className="p-4 w-50 border border-1 border-dark">

      <Form onSubmit={handleSubmitPirateDetails}>
        <Form.Group as={Row} controlId="name" className="mb-2 text-end">
          <Form.Label column sm={4}>
            Name
          </Form.Label>
          <Col sm={8}>
            <Form.Control 
              type="text"
              name = "name" 
              placeholder="Blackbeard"
              onChange ={handleChangeInFields}
              value = {pirate.name}
            />
            {(_.has(errorMessages, 'name')) &&
                  <div className = "text-danger small text-start">{errorMessages.name}</div>
            }
          </Col>
          
        </Form.Group>

        <Form.Group as={Row} controlId="imageUrl" className="mb-2 text-end">
          <Form.Label column sm={4}>
            Image URL
          </Form.Label>
          <Col sm={8}>
            <Form.Control 
              type="text"
              name = "imageUrl"
              placeholder="www.pirates.com/blacbeard.jpeg"
              onChange ={handleChangeInFields}
              value = {pirate.imageUrl}
            />
            {(_.has(errorMessages, 'imageUrl')) &&
              <div className = "text-danger small text-start">{errorMessages.imageUrl}</div>
            }
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="treasureChests" className="mb-2 text-end">
          <Form.Label column sm={4}>
            Treasure Chests
          </Form.Label>
          <Col sm={8}>
            <Form.Control 
              type="number"
              name = "treasureChests"
              placeholder="5"
              onChange ={handleChangeInFields}
              value = {pirate.treasureChests}
            />
            {(_.has(errorMessages, 'treasureChests')) &&
              <div className = "text-danger small text-start">{errorMessages.treasureChests}</div>
            }
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="catchPhrase" className="mb-2 text-end">
          <Form.Label column sm={4}>
            Catch Phrase
          </Form.Label>
          <Col sm={8}>
            <Form.Control 
              type="text"
              name = "catchPhrase"
              placeholder="A new treasure we found!!!"
              onChange ={handleChangeInFields}
              value = {pirate.catchPhrase}
            />
            {(_.has(errorMessages, 'catchPhrase')) &&
              <div className = "text-danger small text-start">{errorMessages.catchPhrase}</div>
            }
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="crewPosition" className="mb-2 text-end">
          <Form.Label column sm={4}>
            Crew Position
          </Form.Label>
          <Col sm={8}>
            <Form.Control 
              type="text"
              as="select" 
              name = "crewPosition"
              onChange ={handleChangeInFields}
              value = {pirate.crewPosition}
            >
              <option value="" disabled defaultValue> Select Crew Position...</option>
              <option value="Captain">Captain</option>
              <option value="First Mate">First Mate</option>
              <option value="Quarter Master">Quarter Master</option>
              <option value="Boatswain">Bootswain</option>
              <option value="Powder Monkey">Powder Monkey</option>
            </Form.Control>
            {(_.has(errorMessages, 'crewPosition')) &&
              <div className = "text-danger small text-start">{errorMessages.crewPosition}</div>
            }
          </Col>
        </Form.Group>
      

        <fieldset className="mb-2">
          <Form.Group as={Row}>
            <Form.Label as="legend" column sm={4} className="text-end">
              Pirate Characteristics
            </Form.Label>
            <Col sm={8}>
              <Form.Check
                label="Peg Leg"
                name="pegLeg"
                id="pegLeg"
                onChange ={handleChangeInFields}
                checked = {pirate.pirateCharacteristics.pegLeg === true}
              />
              <Form.Check
                label="Eye Patch"
                name="eyePatch"
                id="eyePatch"
                onChange ={handleChangeInFields}
                checked = {pirate.pirateCharacteristics.eyePatch === true}
              />
              <Form.Check
                label="Hook Hand"
                name="hookHand"
                id="hookHand"
                onChange ={handleChangeInFields}
                checked = {pirate.pirateCharacteristics.hookHand === true}
              />
            </Col>
          </Form.Group>
        </fieldset>

        <div className="text-end">
          
          <Button 
            variant="success" 
            type="submit"
            size="sm"
            className = "mx-1"
            onClick = {(e) => setUpdateAction("edit")}
          >
            {(formType === "create") 
              ? <> <PlusSquareFill className="mb-1"/> <span className="ps-2">Add</span> </>
              : <> <Pencil className="mb-1"/> <span className="ps-2">Save</span> </>
            } 
          </Button>
          
          {(formType === "update") &&
            <DeleteButton
              pirate = {pirate}
              buttonLocation = {"form_component"}
            ></DeleteButton>
          }
          
        </div>
        
        {(formType === "update") &&
          <div>
            <Link to={"/pirates/"+params.id}> Check Pirate Details </Link>
          </div>
        }

      </Form>

    </div>
  )
}

export default PirateForm
