import type PostDraft from '../../../models/PostDraft'
import profileService from '../../../services/profile'
import './NewPost.css'
import { useForm } from 'react-hook-form'

export default function NewPost() {

    async function createPost(draft: PostDraft) {
        const newPost = await profileService.createPost(draft)
        // change state, show the new post in the profile...
    }

    const { handleSubmit, register } = useForm<PostDraft>()

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