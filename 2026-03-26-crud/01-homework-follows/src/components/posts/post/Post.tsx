import './Post.css'
import type PostModel from '../../../models/Post'
import Comments from '../comments/Comments'
import { displayDate } from '../../../utils/dates'

interface PostProps {
    post: PostModel,
    isReadOnly: boolean
}
export default function Post(props: PostProps) {

    const {title, createdAt, body, user: {name}, comments } = props.post
    const { isReadOnly } = props

    return (
        <div className='Post'>
            <h4>{title}</h4>
            <div className='by-line'>by {name} at {displayDate(createdAt)}</div>
            <div>{body}</div>
            <div><Comments comments={comments}/></div>
            {!isReadOnly && <div><button className="delete-button">Delete</button></div>}
        </div>
    )
}