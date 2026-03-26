import { useEffect, useState } from 'react'
import './Profile.css'
import type PostModel from '../../../models/Post'
import profileService from '../../../services/profile'
import Post from '../post/Post'
import NewPost from '../new/NewPost'

export default function Profile() {

    const [profile, setProfile] = useState<PostModel[]>([])

    function deletePost(id: string) {
        const newProfile = profile.filter(post => post.id !== id)
        setProfile(newProfile)
    }

    function addPost(post: PostModel) {
        setProfile([post, ...profile])
    }

    useEffect(() => {
        profileService.getProfile()
            .then(profile => setProfile(profile.sort((a: PostModel, b: PostModel) => a.createdAt < b.createdAt ? 1 : -1)))
            .catch(e => alert(e.message))

        // (async() => {
        //     try {
        //         const posts = await profileService.getProfile()
        //         setProfile(posts)
        //     } catch (e) {
        //         alert(e)
        //     }
        // })()        
    }, [])

    return (
        <div className='Profile'>
            <NewPost addPost={addPost}/>
            {profile.map(post => <Post 
                key={post.id} 
                post={post} 
                isReadOnly={false} 
                deletePost={deletePost}
            />)}
        </div>
    )
}