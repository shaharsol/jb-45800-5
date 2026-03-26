import type PostCommentModel from '../../../models/PostComment'
import PostComment from '../post-comment/PostComment'
import './Comments.css'

interface CommentsProps {
    comments: PostCommentModel[]
}
export default function Comments(props: CommentsProps) {

    const { comments } = props
    return (
        <div className='Comments'>
            <NewComment />
            {comments.map(comment => <PostComment 
                key={comment.id} 
                comment={comment}
            /> )}
        </div>
    )
}