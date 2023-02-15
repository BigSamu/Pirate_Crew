import React, {useState} from 'react'
import { Link } from "react-router-dom";

import PirateForm from '../components/PirateForm'

const AddPage = () => {

  // i) React Hooks - States
  const [pirate, setPirate] = useState({
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

  return (
    <div className ="container mt-3">
      <h2> Add Pirate </h2>
      <p> Know a pirate you would like to add to your list?</p>
      <PirateForm
        formType={"create"}
        pirate={pirate}
        setPirate={setPirate}
      />
    </div>
  )
}

export default AddPage
