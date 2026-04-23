import { NavLink } from 'react-router-dom'
import './Header.css'

export default function Header() {
    return (
        <div className='Header'>
            <nav>
                <NavLink to="/search">Search</NavLink>
                <NavLink to="/history">History</NavLink>
            </nav>
        </div>
    )
}