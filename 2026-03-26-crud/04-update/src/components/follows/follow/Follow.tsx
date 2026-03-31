import type User from '../../../models/User'
import './Follow.css'
import profilePic from '../../../assets/profile-pic.jpg'

interface FollowProps {
    user: User
}
export default function Follow(props: FollowProps) {

    const { name, username } = props.user

    return (
        <div className='Follow'>
            <div><img src={profilePic} /></div>
            <div>{name}</div>
            <div>{username}</div>
            <div><button>Unfollow</button></div>
        </div>
    )
}