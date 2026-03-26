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

    useEffect(() => {
        profileService.getProfile()
            .then(setProfile)
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
            <NewPost />
            {profile.map(post => <Post 
                key={post.id} 
                post={post} 
                isReadOnly={false} 
                deletePost={deletePost}
            />)}
        </div>
    )
}