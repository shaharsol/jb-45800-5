import type FollowSuggestion from '../../../models/FollowSuggestion'
import type User from '../../../models/User'
import './Suggestion.css'
import profilePic from '../../../assets/profile-pic.jpg'
import useService from '../../../hooks/use-service'
import FollowingService from '../../../services/auth-aware/FollowingService'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { follow } from '../../../redux/following-slice'
import { showErrorToast } from '../../common/show-error-toast'

interface SuggestionProps {
    suggestion: FollowSuggestion
}

export default function Suggestion(props: SuggestionProps) {

    const { suggestion: { userId, name, username, reasonToFollow } } = props

    const isFollowing = useAppSelector(state => state.followingSlice.following.findIndex(follow => follow.id === userId) > -1)

    const followingService = useService(FollowingService)
    const dispatch = useAppDispatch()

    async function followMe() {
        try {
            await followingService.follow(userId)

            const user: User = {
                id: userId,
                name,
                username,
                password: '',
                createdAt: '',
                updatedAt: '',
            }

            dispatch(follow(user))
        } catch (e) {
            showErrorToast(e)
        }
    }

    return (
        <div className='Suggestion'>
            <div className='Suggestion-user'>
                <img src={profilePic} alt={name} />
                <div>
                    <div className='Suggestion-name'>{name}</div>
                    <div className='Suggestion-username'>{username}</div>
                </div>
            </div>
            <p className='Suggestion-reason'>{reasonToFollow}</p>
            {!isFollowing && <button onClick={followMe}>follow</button>}
            {isFollowing && <span className='Suggestion-following'>Following</span>}
        </div>
    )
}
