import './Post.css'
import type PostModel from '../../../models/Post'
import Comments from '../comments/Comments'
import { displayDate } from '../../../utils/dates'
import profileService from '../../../services/profile'

interface PostProps {
    post: PostModel,
    isReadOnly: boolean
    deletePost?(id: string): void
}
export default function Post(props: PostProps) {

    const { id, title, createdAt, body, user: {name}, comments } = props.post
    const { isReadOnly, deletePost } = props

    async function deleteMe() {
        if(confirm('are you sure you want to delete this post?')) {
            try {
                await profileService.deletePost(id)
                // change state of parent component
                deletePost!(id)
            } catch (e) {
                alert(e)
            }
        }
    }

    return (
        <div className='Post'>
            <h4>{title}</h4>
            <div className='by-line'>by {name} at {displayDate(createdAt)}</div>
            <div>{body}</div>
            <div><Comments comments={comments}/></div>
            {!isReadOnly && <div><button onClick={deleteMe} className="delete-button">Delete</button></div>}
        </div>
    )
}