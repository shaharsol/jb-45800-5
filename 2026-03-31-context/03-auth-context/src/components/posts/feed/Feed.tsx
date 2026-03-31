import { useEffect, useState } from 'react'
import './Feed.css'
import type PostModel from '../../../models/Post'
import feedService from '../../../services/feed'
import Post from '../post/Post'
import type PostComment from '../../../models/PostComment'
import Spinner from '../../common/spinner/Spinner'

export default function Feed() {

    const [feed, setFeed] = useState<PostModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    useEffect(() => {
        // feedService.getFeed()
        //     .then(setFeed)
        //     .catch(e => alert(e.message))

        (async() => {
            try {
                setIsLoading(true)
                const posts = await feedService.getFeed()
                setIsLoaded(true)
                setFeed(posts)
            } catch (e) {
                setIsLoaded(false)
                alert(e)
            } finally {
                setIsLoading(false)
            }
        })()        
    }, [])

    function addComment(comment: PostComment) {
        const newFeed = [...feed]
        newFeed.find(post => post.id === comment.postId)?.comments.push(comment)
        setFeed(newFeed)
    }
    
    return (
        <div className='Feed'>

            {isLoading && <Spinner />}

            {!isLoading && isLoaded && <>
                {feed.map(post => <Post 
                    key={post.id} 
                    post={post} 
                    isReadOnly={true}
                    addComment={addComment}
                />)}
            </>}

            {!isLoading && !isLoaded && <div>
                <h4>error loading data...</h4>
            </div>}
        </div>
    )
}