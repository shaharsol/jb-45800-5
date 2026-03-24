import './Post.css'
import type PostModel from '../../../models/Post'
import Comments from '../comments/Comments'

interface PostProps {
    post: PostModel
}
export default function Post(props: PostProps) {

    const {title, createdAt, body, user: {name}, comments } = props.post

    function displayDate(date: string): string {
        return (new Date(date)).toLocaleDateString()
    }

    return (
        <div className='Post'>
            <h4>{title}</h4>
            <div className='by-line'>by {name} at {displayDate(createdAt)}</div>
            <div>{body}</div>
            <div><Comments comments={comments}/></div>
        </div>
    )
}