import { useEffect, useRef, useState } from 'react'

type TypingTextProps = {
    text: string
    onComplete?: () => void
}

export default function TypingText({ text, onComplete }: TypingTextProps) {
    const [displayed, setDisplayed] = useState('')
    const onCompleteRef = useRef(onComplete)

    onCompleteRef.current = onComplete

    useEffect(() => {
        const tokens = text.split(/(\s+)/)
        let index = 0
        let timeoutId: ReturnType<typeof setTimeout>
        let cancelled = false

        setDisplayed('')

        function tick() {
            if (cancelled) {
                return
            }

            if (index >= tokens.length) {
                onCompleteRef.current?.()
                return
            }

            const token = tokens[index]
            index += 1
            setDisplayed((current) => current + token)
            timeoutId = setTimeout(tick, 25 + Math.random() * 35)
        }

        tick()

        return () => {
            cancelled = true
            clearTimeout(timeoutId)
        }
    }, [text])

    return <span>{displayed}</span>
}
