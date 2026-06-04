import './PetImage.css'
import petImage from '../../assets/pet.jpg'

export default function PetImage() {
    return (
        <div className='PetImage'>
            <img src={petImage} />
        </div>
    )
}