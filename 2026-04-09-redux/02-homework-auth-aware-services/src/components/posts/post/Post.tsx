import './Post.css'
import type PostModel from '../../../models/Post'
import Comments from '../comments/Comments'
import { displayDate } from '../../../utils/dates'
// import profileService from '../../../services/profile'
import type PostCommentModel from '../../../models/PostComment'
import { useNavigate } from 'react-router-dom'
import useService from '../../../hooks/use-service'
import ProfileService from '../../../services/auth-aware/ProfileService'
import SpinnerButton from '../../common/spinner-button/SpinnerButton'
import { useState } from 'react'

interface PostProps {
    post: PostModel,
    isReadOnly: boolean
    deletePost?(id: string): void
    addComment(comment: PostCommentModel): void
}
export default function Post(props: PostProps) {

    const { id, title, createdAt, body, user: {name}, comments } = props.post
    const { isReadOnly, deletePost, addComment } = props

    const [ isDeleting, setIsDeleting ] = useState<boolean>(false)

    const profileService = useService(ProfileService)
    async function deleteMe() {
        if(confirm('are you sure you want to delete this post?')) {
            try {
                setIsDeleting(true)
                await profileService.deletePost(id)
                // change state of parent component
                deletePost!(id)
            } catch (e) {
                alert(e)
            } finally {
                setIsDeleting(false)
            }
        }
    }

    // this hook provides a function that allows me to proactively navigate to 
    // some url within the app
    const navigate = useNavigate()

    function updateMe() {
        navigate(`/update-post/${id}`)
    }

    return (
        <div className='Post'>
            <h4>{title}</h4>
            <div className='by-line'>by {name} at {displayDate(createdAt)}</div>
            <div>{body}</div>
            <div><Comments 
                postId={id}
                comments={comments}
                addComment={addComment}
            /></div>
            {!isReadOnly && 
                <div>
                    {/* <button onClick={deleteMe} className="delete-button">Delete</button> */}
                    <SpinnerButton 
                        buttonText='Delete'
                        spinningText='deleting post...'
                        isSpinning={isDeleting}
                        onClick={deleteMe}
                    />
                    <button onClick={updateMe} className="update-button">Update</button>
                </div>
            }
        </div>
    )
}