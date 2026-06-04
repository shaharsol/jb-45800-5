import { useEffect, useState } from 'react'
import { getUserAvatar } from '../../../utils/userAvatar'
import './Profile.css'
// import profileService from '../../../services/profile'
import Post from '../post/Post'
import NewPost from '../new/NewPost'
import Spinner from '../../common/spinner/Spinner'
import useService from '../../../hooks/use-service'
import ProfileService from '../../../services/auth-aware/ProfileService'
import useUsername from '../../../hooks/use-username'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { populate as populateProfile } from '../../../redux/profile-slice'
import { populate as populateFollowers } from '../../../redux/followers-slice'
import { populate as populateFollowing } from '../../../redux/following-slice'
import FollowersService from '../../../services/auth-aware/FollowersService'
import FollowingService from '../../../services/auth-aware/FollowingService'
import FollowModal from './FollowModal'

export default function Profile() {

    const profile = useAppSelector(state => state.profileSlice.posts)
    const followers = useAppSelector(state => state.followersSlice.followers)
    const following = useAppSelector(state => state.followingSlice.following)
    const dispatch = useAppDispatch()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [profileImage, setProfileImage] = useState<string>('')
    const [modalOpen, setModalOpen] = useState<'followers' | 'following' | null>(null)

    const profileService = useService(ProfileService)
    const followersService = useService(FollowersService)
    const followingService = useService(FollowingService)
    const username = useUsername()

    useEffect(() => {
        setProfileImage(getUserAvatar(username))
    }, [username])

    const handleChangeAvatar = () => {
        // Future: Implement file upload functionality
        alert('Image upload functionality coming soon!')
    }

    useEffect(() => {

        (async() => {
            try {
                if(profile.length > 0) {
                    setIsLoaded(true)
                } else {
                    setIsLoading(true)
                    const profileData = await profileService.getProfile()
                    setIsLoaded(true)
                    dispatch(populateProfile(profileData))
                }
            } catch (e) {
                setIsLoaded(false)
                alert(e)
            } finally {
                setIsLoading(false)
            }
        })()        
    }, [])

    useEffect(() => {
        (async() => {
            try {
                const followersData = await followersService.getFollowers()
                dispatch(populateFollowers(followersData))
            } catch (e) {
                console.error('Error loading followers:', e)
            }
        })()
    }, [])

    useEffect(() => {
        (async() => {
            try {
                const followingData = await followingService.getFollowing()
                dispatch(populateFollowing(followingData))
            } catch (e) {
                console.error('Error loading following:', e)
            }
        })()
    }, [])

  return (
    <div className="Profile">

        <div className="ProfileHeader">

            <div className="ProfileCover"></div>

            <div className="ProfileInfo">

                <div className="AvatarWrapper">

                    <img
                        className="ProfileAvatar"
                        src={profileImage}
                        alt={username}
                    />

                    <button
                        className="ChangeAvatar"
                        type="button"
                        onClick={handleChangeAvatar}
                        title="Change profile picture"
                    >
                        +
                    </button>

                </div>

                <div className="ProfileName">
                    {username}
                </div>

                <div className="ProfileBio">
                    BetterX Community Member
                </div>

                <div className="ProfileStats">

                    <div 
                        className="StatItem"
                        onClick={() => setModalOpen('following')}
                    >
                        <strong>{following.length}</strong>
                        <span>Following</span>
                    </div>

                    <div 
                        className="StatItem"
                        onClick={() => setModalOpen('followers')}
                    >
                        <strong>{followers.length}</strong>
                        <span>Followers</span>
                    </div>

                    <div className="StatItem">
                        <strong>{profile.length}</strong>
                        <span>Posts</span>
                    </div>

                </div>

            </div>

        </div>

        {isLoading && <Spinner />}

        {!isLoading && isLoaded && <>
            <NewPost />

            {profile.map(post => (
                <Post
                    key={post.id}
                    post={post}
                    isReadOnly={false}
                />
            ))}
        </>}

        {!isLoading && !isLoaded && (
            <div>
                <h4>error loading data...</h4>
            </div>
        )}

        <FollowModal
            isOpen={modalOpen === 'following'}
            onClose={() => setModalOpen(null)}
            title="Following"
            users={following}
        />

        <FollowModal
            isOpen={modalOpen === 'followers'}
            onClose={() => setModalOpen(null)}
            title="Followers"
            users={followers}
        />

    </div>
)
}
