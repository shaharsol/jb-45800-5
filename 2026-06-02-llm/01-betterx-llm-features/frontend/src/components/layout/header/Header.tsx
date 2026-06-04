import { NavLink } from 'react-router-dom'
import './Header.css'
import useUsername from '../../../hooks/use-username'
import { useContext } from 'react'
import AuthContext from '../../auth/auth/AuthContext'
import Betterx from '../../../assets/Betterx.png'
import { getUserAvatar } from '../../../utils/userAvatar'

export default function Header() {

  const name = useUsername()
  const { logout } = useContext(AuthContext)!
  const userImage = getUserAvatar(name)

  function logMeOut() {
    logout()
  }

  return (
    <div className="Header">

      <div className="HeaderLogo">
        <img
          src={Betterx}
          alt="BetterX"
          className="logo"
        />
      </div>

      <nav className="HeaderNav">
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/feed">Feed</NavLink>
      </nav>

      <div className="HeaderUser">
        <div className="UserProfile">
          <img 
            src={userImage}
            alt={name}
            className="UserAvatar"
          />
          <span className="UserGreeting">Welcome <strong>{name}</strong></span>
        </div>
        <button className="LogoutBtn" onClick={logMeOut}>Logout</button>
      </div>

    </div>
  )
}