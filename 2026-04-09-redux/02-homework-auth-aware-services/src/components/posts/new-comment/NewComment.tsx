import { useForm } from 'react-hook-form'
import type PostComment from '../../../models/PostComment'
import type PostCommentDraft from '../../../models/PostCommentDraft'
import './NewComment.css'
import SpinnerButton from '../../common/spinner-button/SpinnerButton'
import useService from '../../../hooks/use-service'
import CommentsService from '../../../services/auth-aware/CommentsService'

interface NewCommentProps {
    postId: string,
    addComment(comment: PostComment): void
}
export default function NewComment(props: NewCommentProps) {

    const { postId, addComment } = props

    const commentsService = useService(CommentsService)

    async function createComment(draft: PostCommentDraft) {
        try {
            const newComment = await commentsService.createComment(postId, draft)
            reset()
            addComment(newComment)
        } catch (e) {
            alert(e)
        }
    }

    const { handleSubmit, register, reset, formState } = useForm<PostCommentDraft>()

    return (
        <div className='NewComment'>
            <form onSubmit={handleSubmit(createComment)}>
                <textarea placeholder='new comment...' {...register('body', {
                    required: {
                        value: true,
                        message: 'you cant submit an empty comment'
                    },
                    minLength: {
                        value: 20,
                        message: 'comment must be at least 20 characters'
                    },
                    maxLength: {
                        value: 100,
                        message: 'comment must be no longer than 100 characters'
                    }
                })}></textarea>
                <div className='error'>{formState.errors.body?.message}</div>
                {/* <button>Add Comment</button> */}

                <SpinnerButton 
                    buttonText='Add Comment'
                    spinningText='adding new comment...'
                    isSpinning={formState.isSubmitting}
                />
            </form>
        </div>
    )
}