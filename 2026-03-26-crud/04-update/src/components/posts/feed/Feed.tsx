import { useEffect, useState } from 'react'
import './Feed.css'
import type PostModel from '../../../models/Post'
import feedService from '../../../services/feed'
import Post from '../post/Post'
import type PostComment from '../../../models/PostComment'

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

    function addComment(comment: PostComment) {
        const newFeed = [...feed]
        newFeed.find(post => post.id === comment.postId)?.comments.push(comment)
        setFeed(newFeed)
    }
    
    return (
        <div className='Feed'>
            {feed.map(post => <Post 
                key={post.id} 
                post={post} 
                isReadOnly={true}
                addComment={addComment}
            />)}
        </div>
    )
}