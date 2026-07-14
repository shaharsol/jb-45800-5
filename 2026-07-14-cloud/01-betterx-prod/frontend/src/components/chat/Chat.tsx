import { useEffect, useRef, useState, type FormEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'
import './Chat.css'
import useService from '../../hooks/use-service'
import FreeTextService from '../../services/auth-aware/FreeTextService'
import { showErrorToast } from '../common/show-error-toast'
import Spinner from '../common/spinner/Spinner'
import TypingText from './TypingText'

type ChatMessageItem = {
    id: string
    role: 'user' | 'assistant'
    content: string
    animate?: boolean
}

export default function Chat() {
    const chatIdRef = useRef<string>(uuidv4())
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [messages, setMessages] = useState<ChatMessageItem[]>([])
    const [prompt, setPrompt] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [typingMessageId, setTypingMessageId] = useState<string | null>(null)

    const freeTextService = useService(FreeTextService)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, typingMessageId, isSending])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const trimmedPrompt = prompt.trim()

        if (!trimmedPrompt || isSending) {
            return
        }

        const userMessage: ChatMessageItem = {
            id: uuidv4(),
            role: 'user',
            content: trimmedPrompt,
        }

        setMessages((current) => [...current, userMessage])
        setPrompt('')
        setIsSending(true)

        try {
            const { answer } = await freeTextService.sendPrompt(trimmedPrompt, chatIdRef.current)
            const assistantMessage: ChatMessageItem = {
                id: uuidv4(),
                role: 'assistant',
                content: answer,
                animate: true,
            }

            setMessages((current) => [...current, assistantMessage])
            setTypingMessageId(assistantMessage.id)
        } catch (e) {
            showErrorToast(e)
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className='Chat'>
            <h2>BetterX Assistant</h2>

            <div className='Chat-messages'>
                {messages.length === 0 && (
                    <p className='Chat-empty'>ask me anything about your followers, feed, or posts</p>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`Chat-message Chat-message--${message.role}`}
                    >
                        <div className='Chat-bubble'>
                            {message.role === 'assistant' && message.animate && typingMessageId === message.id ? (
                                <TypingText
                                    text={message.content}
                                    onComplete={() => setTypingMessageId(null)}
                                />
                            ) : (
                                message.content
                            )}
                        </div>
                    </div>
                ))}

                {isSending && (
                    <div className='Chat-message Chat-message--assistant'>
                        <div className='Chat-bubble Chat-bubble--typing'>
                            <Spinner />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form className='Chat-form' onSubmit={handleSubmit}>
                <textarea
                    className='Chat-input'
                    placeholder='type your message...'
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    rows={3}
                    disabled={isSending}
                />
                <button className='Chat-send' type='submit' disabled={isSending || !prompt.trim()}>
                    send
                </button>
            </form>
        </div>
    )
}
