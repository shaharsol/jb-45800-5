import { useEffect, useState } from 'react'
import './Following.css'
import type User from '../../../models/User'
import followingService from '../../../services/following'
import Follow from '../follow/Follow'
import Spinner from '../../common/spinner/Spinner'

export default function Following() {

  const [following, setFollowing] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  
  useEffect(() => {

    (async() => {
      try {
        setIsLoading(true)
        const following = await followingService.getFollowing()
        setIsLoaded(true)
        setFollowing(following)
      } catch (e) {
        setIsLoaded(false)
        alert(e)
      } finally {
        setIsLoading(false)

      }
    })()
  }, [])

  function unfollow(id: string) {
    const newFollowingList = following.filter(user => user.id !== id)
    setFollowing(newFollowingList)
  }


  return (
    <div className='Following'>

      {isLoading && <Spinner />}

      {!isLoading && !isLoaded && <h4>error loading following...</h4>}

      {!isLoading && isLoaded && <>
        {following.map(follow => <Follow 
          key={follow.id} 
          user={follow}
          isFollowing={true}
          unfollow={unfollow}
        />)}
      </>}
    </div>
  )
}
