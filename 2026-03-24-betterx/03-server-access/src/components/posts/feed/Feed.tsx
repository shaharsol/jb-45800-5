import { useEffect, useState } from 'react'
import './Feed.css'
import type Post from '../../../models/Post'
import feedService from '../../../services/feed'

export default function Feed() {

    const [feed, setFeed] = useState<Post[]>([])

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
            {feed.map(({id, title}) => <div key={id}>{title}</div>)}
        </div>
    )
}