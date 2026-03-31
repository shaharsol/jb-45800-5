import { NavLink } from 'react-router-dom'
import './Header.css'
import useUsername from '../../../hooks/use-username'
export default function Header() {
  
  const name = useUsername()

  return (
    <div className='Header'>
      <div>
        Logo
      </div>
      <div>
        {/* NEVER use <a> tags to navigate inside an SPA app */}
        {/* <a href="/profile">Profile</a> | <a href="/feed">Feed</a> */}

        {/* <Link to="/profile">Profile</Link> | <Link to="/feed">Feed</Link> */}
        <NavLink to="/profile">Profile</NavLink> | <NavLink to="/feed">Feed</NavLink>
      </div>
      <div>
        Welcome {name} | Logout
      </div>
    </div>
  )
}
