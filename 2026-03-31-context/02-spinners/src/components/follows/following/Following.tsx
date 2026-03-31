import { useEffect, useState } from 'react'
import './Following.css'
import type User from '../../../models/User'
import followingService from '../../../services/following'
import Follow from '../follow/Follow'

export default function Following() {

  const [following, setFollowing] = useState<User[]>([])

  useEffect(() => {
    followingService.getFollowing()
      .then(setFollowing)
      .catch(alert)
  }, [])

  function unfollow(id: string) {
    const newFollowingList = following.filter(user => user.id !== id)
    setFollowing(newFollowingList)
  }


  return (
    <div className='Following'>
      {following.map(follow => <Follow 
        key={follow.id} 
        user={follow}
        isFollowing={true}
        unfollow={unfollow}
      />)}
    </div>
  )
}
