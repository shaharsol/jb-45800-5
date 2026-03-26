import type Post from '../../../models/Post'
import type PostDraft from '../../../models/PostDraft'
import profileService from '../../../services/profile'
import './NewPost.css'
import { useForm } from 'react-hook-form'

interface NewPostProps {
    addPost(post: Post): void
}
export default function NewPost(props: NewPostProps) {

    const { addPost } = props

    async function createPost(draft: PostDraft) {
        const newPost = await profileService.createPost(draft)
        // change state, show the new post in the profile...
        reset()
        addPost(newPost)
    }

    const { handleSubmit, register, reset } = useForm<PostDraft>()

    return (
        <div className='NewPost'>
            <form onSubmit={handleSubmit(createPost)}>
                <input placeholder='title' {...register('title')} />
                <textarea placeholder='body' {...register('body')}></textarea>
                <button>Add Post</button>
            </form>
        </div>
    )
}