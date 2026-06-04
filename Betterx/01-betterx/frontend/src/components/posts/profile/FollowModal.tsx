import { useState } from 'react'
import './FollowModal.css'
import { getUserAvatar } from '../../../utils/userAvatar'

interface FollowUser {
    id: string
    username: string
}

interface FollowModalProps {
    isOpen: boolean
    onClose: () => void
    title: 'Following' | 'Followers'
    users: FollowUser[]
}

export default function FollowModal({ isOpen, onClose, title, users }: FollowModalProps) {
    const [searchTerm, setSearchTerm] = useState<string>('')

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (!isOpen) return null

    return (
        <div className="FollowModal-Overlay" onClick={onClose}>
            <div className="FollowModal" onClick={(e) => e.stopPropagation()}>
                <div className="FollowModal-Header">
                    <h2>{title}</h2>
                    <button className="FollowModal-Close" onClick={onClose}>×</button>
                </div>

                <div className="FollowModal-SearchWrap">
                    <input
                        type="text"
                        placeholder={`Search ${title.toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="FollowModal-Search"
                    />
                </div>

                <div className="FollowModal-List">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <div key={user.id} className="FollowModal-Item">
                                <img
                                    src={getUserAvatar(user.username)}
                                    alt={user.username}
                                    className="FollowModal-Avatar"
                                />
                                <span className="FollowModal-Username">{user.username}</span>
                            </div>
                        ))
                    ) : (
                        <div className="FollowModal-Empty">
                            No {title.toLowerCase()} found
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
