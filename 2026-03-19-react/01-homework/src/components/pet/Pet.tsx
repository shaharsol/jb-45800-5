import PetImage from '../petimage/PetImage'
import PetName from '../petname/PetName'
import './Pet.css'

export default function Pet() {
    return (
        <div className='Pet'>
            <PetImage />
            <PetName />
        </div>
    )
}