import './PetName.css'

export default function PetName() {

    const petName: string = 'Lucky'

    return (
        <div className='PetName'>
            <span>{petName}</span>
        </div>
    )
}