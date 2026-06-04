import { useEffect, useState } from 'react'
import './Profile.css'
import type PostModel from '../../../models/Post'
// import profileService from '../../../services/profile'
import Post from '../post/Post'
import NewPost from '../new/NewPost'
import type PostComment from '../../../models/PostComment'
import Spinner from '../../common/spinner/Spinner'
import useService from '../../../hooks/use-service'
import ProfileService from '../../../services/auth-aware/ProfileService'

export default function Profile() {

    const [profile, setProfile] = useState<PostModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    function deletePost(id: string) {
        const newProfile = profile.filter(post => post.id !== id)
        setProfile(newProfile)
    }

    function addPost(post: PostModel) {
        setProfile([post, ...profile])
    }

    function addComment(comment: PostComment) {
        const newProfile = [...profile]
        newProfile.find(post => post.id === comment.postId)?.comments.push(comment)
        setProfile(newProfile)
    }

    const profileService = useService(ProfileService)

    useEffect(() => {

        // profileService.getProfile()
        //     .then(profile => setProfile(profile.sort((a: PostModel, b: PostModel) => a.createdAt < b.createdAt ? 1 : -1)))
        //     .catch(e => alert(e.message))

        (async() => {
            try {
                setIsLoading(true)
                const profile = await profileService.getProfile()
                setIsLoaded(true)
                setProfile(profile.sort((a: PostModel, b: PostModel) => a.createdAt < b.createdAt ? 1 : -1))
            } catch (e) {
                setIsLoaded(false)
                alert(e)
            } finally {
                setIsLoading(false)
            }
        })()        
    }, [])

    return (
        <div className='Profile'>

            {isLoading && <Spinner />}

            {!isLoading && isLoaded && <>
                <NewPost addPost={addPost}/>
                {profile.map(post => <Post 
                    key={post.id} 
                    post={post} 
                    isReadOnly={false} 
                    deletePost={deletePost}
                    addComment={addComment}
                />)}
            </>}

            {!isLoading && !isLoaded && <div>
                <h4>error loading data...</h4>
            </div>}

            
        </div>
    )
}