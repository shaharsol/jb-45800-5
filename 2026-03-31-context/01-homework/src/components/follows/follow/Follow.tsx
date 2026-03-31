import type User from '../../../models/User'
import './Follow.css'
import profilePic from '../../../assets/profile-pic.jpg'
import followingService from '../../../services/following'

interface FollowProps {
    user: User
    isFollowing: boolean
    unfollow(id: string): void
}
export default function Follow(props: FollowProps) {

    const { unfollow, isFollowing, user: { id, name, username }} = props
    
    async function unfollowMe() {
        try {
            await followingService.unfollow(id)
            unfollow(id)

        } catch (e) {
            alert(e)
        }
    }

    return (
        <div className='Follow'>
            <div><img src={profilePic} /></div>
            <div>{name}</div>
            <div>{username}</div>
            {isFollowing && <div><button onClick={unfollowMe}>Unfollow</button></div>}
            
        </div>
    )
}