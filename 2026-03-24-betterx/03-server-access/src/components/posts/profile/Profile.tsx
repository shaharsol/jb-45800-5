import { useEffect, useState } from 'react'
import './Profile.css'
import type Post from '../../../models/Post'
import profileService from '../../../services/profile'

export default function Profile() {

    const [profile, setProfile] = useState<Post[]>([])

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
            {profile.map(({id, title}) => <div key={id}>{title}</div>)}
        </div>
    )
}