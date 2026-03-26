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
        try {
            const newPost = await profileService.createPost(draft)
            // change state, show the new post in the profile...
            reset()
            addPost(newPost)
        } catch (e) {
            alert (e)
        }
    }

    // an example of an attempt to use hook *not inside* the root of the component function
    // rather in a {} block. this will be blocked by eslint
    // if(true) {
    //     const {formState} = useForm<PostDraft>()
    // }

    const { handleSubmit, register, reset, formState } = useForm<PostDraft>()

    return (
        <div className='NewPost'>
            <form onSubmit={handleSubmit(createPost)}>
                <input placeholder='title' {...register('title', {
                    required: {
                        value: true,
                        message: 'title is a required field'
                    },
                    minLength: {
                        value: 10,
                        message: 'title must be at least 10 characters'
                    }

                })} />
                <div className='error'>{formState.errors.title?.message}</div>
                <textarea placeholder='body' {...register('body', {
                    required: {
                        value: true,
                        message: 'body is a required field'
                    },
                    minLength: {
                        value: 20,
                        message: 'body must be at least 20 characters'
                    }
                })}></textarea>
                <div className='error'>{formState.errors.body?.message}</div>
                <button>Add Post</button>
            </form>
        </div>
    )
}