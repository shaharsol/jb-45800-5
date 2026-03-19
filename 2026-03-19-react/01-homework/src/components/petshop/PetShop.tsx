import Header from '../../header/Header'
import Cats from '../cats/Cats'
import Dogs from '../dogs/Dogs'
import Footer from '../footer/Footer'
import './PetShop.css'

export default function PetShop() {
    return (
        <div className='PetShop'>
            <header>
                <Header />
            </header>
            <main>
                <Dogs />
                <Cats />
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    )
}