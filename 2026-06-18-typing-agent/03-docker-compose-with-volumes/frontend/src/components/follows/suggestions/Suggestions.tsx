import { useEffect, useState } from 'react'
import './Suggestions.css'
import Spinner from '../../common/spinner/Spinner'
import useService from '../../../hooks/use-service'
import FollowingService from '../../../services/auth-aware/FollowingService'
import type FollowSuggestion from '../../../models/FollowSuggestion'
import { showErrorToast } from '../../common/show-error-toast'
import Suggestion from './Suggestion'

export default function Suggestions() {

    const [suggestions, setSuggestions] = useState<FollowSuggestion[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    const followingService = useService(FollowingService)

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true)
                const data = await followingService.suggest()
                setIsLoaded(true)
                setSuggestions(data)
            } catch (e) {
                setIsLoaded(false)
                showErrorToast(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [])

    return (
        <div className='Suggestions'>
            <h2>People you may want to follow</h2>

            {isLoading && <Spinner />}

            {!isLoading && !isLoaded && <h4>error loading suggestions...</h4>}

            {!isLoading && isLoaded && suggestions.length === 0 && (
                <p className='Suggestions-empty'>no suggestions right now</p>
            )}

            {!isLoading && isLoaded && suggestions.length > 0 && (
                <div className='Suggestions-list'>
                    {suggestions.map(suggestion => (
                        <Suggestion
                            key={suggestion.userId}
                            suggestion={suggestion}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
