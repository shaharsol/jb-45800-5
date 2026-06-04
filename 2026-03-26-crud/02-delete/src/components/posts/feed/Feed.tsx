import { useEffect, useState } from 'react'
import './Feed.css'
import type PostModel from '../../../models/Post'
import feedService from '../../../services/feed'
import Post from '../post/Post'

export default function Feed() {

    const [feed, setFeed] = useState<PostModel[]>([])

    useEffect(() => {
        feedService.getFeed()
            .then(setFeed)
            .catch(e => alert(e.message))

        // (async() => {
        //     try {
        //         const posts = await feedService.getFeed()
        //         setFeed(posts)
        //     } catch (e) {
        //         alert(e)
        //     }
        // })()        
    }, [])

    return (
        <div className='Feed'>
            {feed.map(post => <Post 
                key={post.id} 
                post={post} 
                isReadOnly={true}
            />)}
        </div>
    )
}