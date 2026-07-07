import { useContext, useEffect, type PropsWithChildren } from "react"
import { SocketMessages } from "socket-enums-shaharsol-xyz"
import { io } from "socket.io-client"
import { useAppDispatch } from "../../redux/hooks"
import { add } from "../../redux/profile-slice"
import type Post from "../../models/Post"
import AuthContext from "../auth/auth/AuthContext"
import useUserId from "../../hooks/use-userId"
import { newFollower } from "../../redux/followers-slice"
import { follow as followUser } from "../../redux/following-slice"
import store from "../../redux/store"
import type User from "../../models/User"

function getFollowIds(follow: Record<string, unknown>) {
    const dataValues = follow.dataValues as Record<string, string> | undefined

    return {
        followerId: (follow.followerId as string | undefined) ?? dataValues?.followerId,
        followeeId: (follow.followeeId as string | undefined) ?? dataValues?.followeeId,
    }
}

function resolveFollowee(follow: Record<string, unknown>, followeeId: string): User | undefined {
    const followee = follow.followee as User | undefined

    if (followee?.id) {
        return followee
    }

    const state = store.getState()

    return state.followersSlice.followers.find((user) => user.id === followeeId)
        ?? state.followingSlice.following.find((user) => user.id === followeeId)
}

export default function Io(props: PropsWithChildren) {

    const { clientId } = useContext(AuthContext)!
    const userId = useUserId()

    const { children } = props

    const dispatch = useAppDispatch()

    useEffect(() => {
        const socket = io(import.meta.env.VITE_IO_SERVER_URL)
        console.log('client started listening for socket messages')
        socket.onAny((eventName: string, payload: any) => {
            console.log(`got a ${eventName} socket message`, payload)
            console.log(eventName)
            console.log(SocketMessages.NEW_POST)
            switch (eventName) {
                case SocketMessages.NEW_FOLLOW: 
                    if(clientId !== payload.clientId) {
                        const follow = payload.follow as Record<string, unknown>
                        const { followerId, followeeId } = getFollowIds(follow)

                        if (followeeId === userId) {
                            dispatch(newFollower(follow.follower as User))
                        } else if (followerId === userId && followeeId) {
                            const alreadyFollowing = store.getState().followingSlice.following
                                .some((user) => user.id === followeeId)

                            if (!alreadyFollowing) {
                                const followee = resolveFollowee(follow, followeeId)

                                if (followee) {
                                    dispatch(followUser(followee))
                                }
                            }
                        }
                    }
                    break;
                case SocketMessages.NEW_POST:
                    if(clientId !== payload.clientId) {
                        console.log('dispatching the NEW_POST')
                        dispatch(add(payload.post as Post)) 
                    }
                    break;
            }
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    return (
        <>
            {children}
        </>
    )
}